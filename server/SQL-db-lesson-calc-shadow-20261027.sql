-- 27 Oct 2026 · SHADOW lesson counter (nothing user-facing reads these yet).
-- Misty: "it should be like this, since we are now sharing information with parents and partners".
-- The database counts each package's lessons itself, from the lessons actually taught, split at the exact package start
-- (renewal / enrol) date. Lessons before the start date belong to the previous package (the carry-over is what was left
-- on the renewal day). Additive only: new views coe_lc_days / coe_lc_mon / coe_lc_calc, function coe_lc_check_run,
-- one daily cron job. Nothing existing is altered. Rollback: SQL-db-lesson-calc-shadow-ROLLBACK-20261027.sql.
--
-- Where the taught lessons come from (per day, per student code + teacher):
--   * from 1 Oct 2026: the calendar copy (classes) – the same rule management already uses for October on
--     (class ended, not cancelled, not -TC / -SC; 25 min = 0.5, 50 min = 1).
--   * before October: the sheet's DAILY tabs (one cell per day), used only where that month's DAILY total for the
--     student + teacher equals the sheet's monthly value (S-MONTHLY), so the day split is trustworthy.
-- Month values of a package:
--   * a month entirely inside the package: the classes (Oct on) or the sheet's own month value (closed months, incl. the
--     ACTIVE month override) – unchanged from today.
--   * the package's FIRST month when it started after the 1st (renewal month): only the days on/after the start date.
--     Before October this needs a trustworthy DAILY split; without one the month is marked "unverified" (核对中).
-- Substitute lessons (TC&SUB, Subbed), fin_adj, avail_adj, shared packages and the deadline: exactly as coe_pkg_calc.

create or replace view public.coe_lc_days as
with hd as (select tab, coe_day(data->>4) m0 from public.sheet_rows where tab ilike '%-DAILY' and r = 1),
daily as (
  select upper(trim(s.data->>0)) code, lower(trim(coalesce(s.data->>2, ''))) t, (hd.m0 + (j.j - 4)) d, coe_num(s.data->>j.j) v
  from public.sheet_rows s join hd on hd.tab = s.tab cross join generate_series(4, 34) j(j)
  where s.r >= 3 and (s.data->>0) ~ '^ST-' and coe_num(s.data->>j.j) > 0
    and hd.m0 < date '2026-10-01' and (hd.m0 + (j.j - 4)) < (hd.m0 + interval '1 mon')),
cal as (
  select c.code, lower(trim(c.teachers->>0)) t, c.day d, round(extract(epoch from (c.ends_at - c.starts_at)) / 60.0 / 50.0 * 2) / 2 v
  from public.classes c
  where c.day >= date '2026-10-01' and c.day <= ((now() at time zone 'Asia/Manila')::date)
    and c.ends_at <= now() and not c.cancelled and c.id not like 'pend-%' and c.code like 'ST-%'
    and regexp_replace(coalesce(c.data->>'title', ''), '\s+X$', '', 'i') !~* '-(TC|SC)$')
select code, t, d, sum(v) v, 'daily'::text src from daily group by 1, 2, 3
union all
select code, t, d, sum(v) v, 'cal'::text src from cal group by 1, 2, 3;

create or replace view public.coe_lc_mon as
with today as materialized (select ((now() at time zone 'Asia/Manila'))::date d),
mon as materialized (select upper(trim(data->>1)) code, lower(trim(coalesce(data->>3, ''))) t, coe_day(data->>0) m, sum(coe_num(data->>6)) h
                     from public.sheet_rows where tab = 'S-MONTHLY' and r >= 2 group by 1, 2, 3),
dd as materialized (select code, t, d, v, src, date_trunc('month', d)::date m from public.coe_lc_days),
dm as materialized (select code, t, m, sum(v) tot from dd where src = 'daily' group by 1, 2, 3),
live as materialized (select * from public.coe_packages where removed_at is null),
p as (select k.id, k.code, k.teacher, lower(trim(k.teacher)) t, k.buy, k.month_adj,
        (select min(z.buy) from live z where z.code = k.code and lower(z.teacher) = lower(k.teacher) and z.id <> k.id and z.buy > coalesce(k.buy, '1900-01-01'::date)) nxt
      from live k where k.buy is not null),
pm as (select p.*, g.m::date m, (g.m + interval '1 mon')::date m1 from p cross join lateral generate_series(date_trunc('month', p.buy), date_trunc('month', (select d from today)), '1 mon') g(m)
       where p.nxt is null or g.m::date < p.nxt),
x as (select pm.*,
        coalesce(mon.h, 0) mh, coalesce((pm.month_adj->>(pm.m::text))::numeric, 0) adj, dm.tot dtot,
        (pm.buy <= pm.m and (pm.nxt is null or pm.nxt >= pm.m1)) whole,
        coalesce((select sum(v) from dd where dd.code = pm.code and dd.t = pm.t and dd.m = pm.m and dd.d >= greatest(pm.buy, pm.m) and dd.d < least(coalesce(pm.nxt, '9999-12-31'), pm.m1)), 0) after_start,
        coalesce((select sum(v) from dd where dd.code = pm.code and dd.t = pm.t and dd.m = pm.m and dd.d < pm.buy), 0) before_start
      from pm left join mon on mon.code = pm.code and mon.t = pm.t and mon.m = pm.m
              left join dm on dm.code = pm.code and dm.t = pm.t and dm.m = pm.m)
select id, code, teacher, m, mh + adj sheet_v,
  case
    when m >= date '2026-10-01' then after_start                                             -- database calendar only (no sheet override) from October
    when whole then mh + adj                                                                 -- closed month fully inside the package: the sheet's month value
    when after_start = mh + adj then mh + adj                                                -- renewal month: the sheet already counts only from the start date
    when coalesce(dtot, 0) = mh then after_start                                             -- renewal month: trustworthy DAILY split, count from the start date
    else mh + adj                                                                            -- renewal month that cannot be verified: keep the sheet value, flagged
  end v,
  case
    when m >= date '2026-10-01' then case when whole then 'cal' else 'cal-split' end
    when whole then 'sheet'
    when after_start = mh + adj then 'sheet-split-ok'
    when coalesce(dtot, 0) = mh then 'daily-split'
    else 'unverified'
  end src,
  before_start, after_start, dtot daily_total
from x;

drop view if exists public.coe_lc_calc;
create view public.coe_lc_calc as
-- fin / avail are the database's OWN numbers: taught lessons (coe_lc_mon) + substitute lessons, with NO sheet calibration
-- (coe_packages.fin_adj / avail_adj are "sheet fix kept" corrections that make today's numbers equal the sheet; they are
-- shown separately so every difference can be explained).
with today as materialized (select ((now() at time zone 'Asia/Manila'))::date d),
sub as materialized (select distinct trim(both from (data->>3)) code, (data->>0) ts, (data->>5) tt, trim(both from coalesce(data->>11, '')) rt, coe_num(data->>8) u
                     from public.sheet_rows where tab = 'TC&SUB' and r >= 2 and (data->>9) = 'Subbed'),
live as materialized (select * from public.coe_packages where removed_at is null),
lm as materialized (select id, sum(v) months, sum(sheet_v) sheet_months,
                      string_agg(case when src = 'unverified' and (before_start > 0 or daily_total is null) then to_char(m, 'YYYY-MM') end, ',' order by m) unverified,
                      string_agg(case when src in ('daily-split', 'cal-split') then to_char(m, 'YYYY-MM') end, ',' order by m) split_months from public.coe_lc_mon group by id),
oc as materialized (select id, months old_months, avail old_avail, fin old_fin from public.coe_pkg_calc),
c1 as (select p.*, case when p.buy is null then oc.old_months else coalesce(lm.months, 0) end months,
     concat_ws(',', lm.unverified,
       case when p.buy is null then 'no start date' end,
       case when exists (select 1 from live z where z.id <> p.id and z.code = p.code and lower(z.teacher) = lower(p.teacher) and z.buy is not distinct from p.buy) then 'duplicate package row' end) unverified,
     lm.split_months, oc.old_months, oc.old_avail, oc.old_fin,
   coalesce((select sum(sub.u) from sub, today where sub.code = p.code and (p.buy is null or substr(sub.ts, 1, 19) >= p.buy::text)
     and substr(sub.ts, 1, 19) < least(coalesce((select min(z.buy) from live z where z.code = p.code and lower(z.teacher) = lower(p.teacher) and z.buy > coalesce(p.buy, '1900-01-01'::date))::text, '9999'), (today.d + 1)::text)
     and (lower(sub.rt) = lower(p.teacher) or (not exists (select 1 from live z where z.code = p.code and lower(z.teacher) = lower(sub.rt) and (z.buy is null or z.buy::text <= substr(sub.ts, 1, 10)))
          and p.id = (select z.id from live z where z.code = p.code and (z.buy is null or z.buy::text <= substr(sub.ts, 1, 10)) order by z.buy desc nulls last, z.sheet_r, z.id limit 1)))), 0) subs
  from live p left join lm on lm.id = p.id left join oc on oc.id = p.id),
c2 as materialized (select c1.*, c1.months + c1.subs fin, coalesce(nullif(trim(coalesce(c1.shared, '')), ''), c1.code) pkg,
   coalesce(c1.transfer_out, 0) + coalesce(c1.carry, 0) + coalesce(c1.gift, 0) + coalesce(c1.returned, 0) + coalesce(c1.incentive, 0) extra from c1),
shr as (select pkg, sum(extra) se, sum(fin) sf, sum(fin_adj) sfa, string_agg(nullif(unverified, ''), ',') su from c2 where enrolled is null group by pkg)
select x.id, x.code, x.name, x.teacher, x.buy, x.months, x.subs, x.fin,
  case when x.enrolled is null or x.avail_off then null::numeric else x.extra + x.enrolled + coalesce(shr.se, 0) - (x.fin + coalesce(shr.sf, 0)) end avail,
  case when x.enrolled is null then nullif(x.unverified, '') else nullif(concat_ws(',', nullif(x.unverified, ''), shr.su), '') end unverified,
  x.split_months, x.old_months, x.old_fin, x.old_avail, x.sheet_r, x.enrolled, x.pkg,
  x.fin_adj, x.avail_adj, case when x.enrolled is not null then x.fin_adj + coalesce(shr.sfa, 0) end pkg_fin_adj, x.avail_off
from c2 x left join shr on shr.pkg = x.pkg;

revoke all on public.coe_lc_days, public.coe_lc_mon, public.coe_lc_calc from anon, authenticated;
grant select on public.coe_lc_days, public.coe_lc_mon, public.coe_lc_calc to service_role;
