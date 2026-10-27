-- PREPARED, NOT APPLIED · 27 Oct 2026 · switch lesson counts to the database's own count (coe_lc_*). Needs Misty's OK.
-- After this, management (coe_pkg_rows / ACTIVE screen), the student portal and the partner portal (coe_portal_pkgs) all read the
-- database count, which is computed live on every read: no Google copy in between for taught classes from October on.
-- Rollback: SQL-db-lesson-calc-SWITCH-ROLLBACK-20261027.sql (restores every definition saved in coe_defs_20261027).
-- Apply as the numbered steps below, one migration each, so a refusal points at one step.

-- 1 · save today's definitions (for the rollback) and keep the sheet-based calculation under new names
create table if not exists public.coe_defs_20261027 (name text primary key, def text not null, saved_at timestamptz default now());
insert into public.coe_defs_20261027 (name, def) values
  ('view coe_pkg_calc', pg_get_viewdef('public.coe_pkg_calc'::regclass, true)),
  ('view coe_pkg_mon', pg_get_viewdef('public.coe_pkg_mon'::regclass, true)),
  ('function coe_pkg_sync', pg_get_functiondef('public.coe_pkg_sync'::regproc)),
  ('function coe_portal_pkgs', pg_get_functiondef('public.coe_portal_pkgs(text[])'::regprocedure))
on conflict (name) do nothing;
do $s1$ begin
  execute 'create view public.coe_pkg_calc_sheet as ' || (select def from public.coe_defs_20261027 where name = 'view coe_pkg_calc');
  execute 'create view public.coe_pkg_mon_sheet as ' || (select def from public.coe_defs_20261027 where name = 'view coe_pkg_mon');
end $s1$;

-- 2 · the database count, reading the sheet-based numbers only for comparison / the few rows without a start date
--     opening balance: packages bought before 2025 keep fin_adj / avail_adj (their pre-2025 lessons exist only there)
do $s2$ declare d text; begin
  d := pg_get_viewdef('public.coe_lc_calc3'::regclass, true);
  if position(' coe_pkg_calc_' in d) > 0 or position('FROM coe_pkg_calc' in d) = 0 then raise exception 'calc3 anchor'; end if;
  d := replace(d, 'coe_pkg_calc', 'coe_pkg_calc_sheet');   -- the FROM and its qualified columns (coe_pkg_calc.id …)
  execute 'create view public.coe_lc_calc4 as ' || d;
end $s2$;
create view public.coe_lc_live as
select c.id, c.code, c.name, c.teacher, c.buy, c.months, c.subs,
  c.fin + case when c.buy < date '2025-01-01' then coalesce(c.fin_adj, 0) else 0 end fin,
  case when c.avail is null then null
       else c.avail - case when c.buy < date '2025-01-01' then coalesce(c.pkg_fin_adj, 0) - coalesce(c.avail_adj, 0) else 0 end end avail,
  case when p.deadline_set then p.deadline when p.buy is null or p.enrolled is null then null::date
       else (p.buy + case when p.enrolled < 30 then '4 mons'::interval when p.enrolled < 60 then '8 mons'::interval else '1 year'::interval end)::date end deadline,
  c.sheet_r, c.unverified
from public.coe_lc_calc4 c join public.coe_packages p on p.id = c.id;
revoke all on public.coe_pkg_calc_sheet, public.coe_pkg_mon_sheet, public.coe_lc_calc4, public.coe_lc_live from anon, authenticated;
grant select on public.coe_pkg_calc_sheet, public.coe_pkg_mon_sheet, public.coe_lc_calc4, public.coe_lc_live to service_role;

-- 3 · management reads (coe_pkg_rows, coe_pkg_check_run, coe_pkg_subs, ...) follow coe_pkg_calc / coe_pkg_mon: same columns, new source
create or replace view public.coe_pkg_calc as
select l.id, l.code, l.name, l.teacher, l.buy, l.months, l.subs, l.fin, l.avail, l.deadline, l.sheet_r, 0::numeric m_sheet, 0::numeric m_db
from public.coe_lc_live l;
create or replace view public.coe_pkg_mon as
select id, m, v from public.coe_lc_mon
union all
select s.id, s.m, s.v from public.coe_pkg_mon_sheet s join public.coe_packages p on p.id = s.id where p.buy is null and p.removed_at is null;

-- 4 · stop the sheet calibration: coe_pkg_sync keeps copying package details (names, enrolled, start, deadline) but no longer
--     writes fin_adj / avail_adj to make the numbers equal the sheet
do $s4$ declare d text; n int; begin
  d := pg_get_functiondef('public.coe_pkg_sync'::regproc);
  select (length(d) - length(replace(d, '''fin'', case when fresh and', ''))) / length('''fin'', case when fresh and') into n; if n <> 1 then raise exception 'fin anchor %', n; end if;
  d := replace(d, '''fin'', case when fresh and', '''fin'', case when false and');
  select (length(d) - length(replace(d, '''avail'', case when fresh and', ''))) / length('''avail'', case when fresh and') into n; if n <> 1 then raise exception 'avail anchor %', n; end if;
  d := replace(d, '''avail'', case when fresh and', '''avail'', case when false and');
  execute d;
end $s4$;

-- 5 · student + partner portals (coe_portal_pkgs): used / left from the database count, no "since last Google copy" gap
do $s5$ declare d text; n int;
  procedure_anchor text;
begin
  d := pg_get_functiondef('public.coe_portal_pkgs(text[])'::regprocedure);
  procedure_anchor := 'from sheet_rows s where s.tab = ''ACTIVE'' and s.r >= 5';
  select (length(d) - length(replace(d, procedure_anchor, ''))) / length(procedure_anchor) into n; if n <> 1 then raise exception 'ar0 anchor %', n; end if;
  d := replace(d, procedure_anchor, 'from sheet_rows s left join coe_packages pk on pk.removed_at is null and pk.sheet_r = s.r and pk.code = upper(trim(s.data->>0)) left join coe_lc_live lc on lc.id = pk.id where s.tab = ''ACTIVE'' and s.r >= 5');
  procedure_anchor := 'coalesce(round(coe_num(s.data->>45), 1), 0) fin0,';
  select (length(d) - length(replace(d, procedure_anchor, ''))) / length(procedure_anchor) into n; if n <> 1 then raise exception 'fin0 anchor %', n; end if;
  d := replace(d, procedure_anchor, 'coalesce(round(lc.fin, 1), round(coe_num(s.data->>45), 1), 0) fin0,');
  procedure_anchor := 'case when trim(coalesce(s.data->>46,'''')) = '''' then null else round(coe_num(s.data->>46), 1) end av0,';
  select (length(d) - length(replace(d, procedure_anchor, ''))) / length(procedure_anchor) into n; if n <> 1 then raise exception 'av0 anchor %', n; end if;
  d := replace(d, procedure_anchor, 'case when lc.id is not null and pk.enrolled is not null then round(lc.avail, 1) when lc.id is not null then null when trim(coalesce(s.data->>46,'''')) = '''' then null else round(coe_num(s.data->>46), 1) end av0,');
  procedure_anchor := 'gdays as (select distinct c.day from classes c where ';
  select (length(d) - length(replace(d, procedure_anchor, ''))) / length(procedure_anchor) into n; if n <> 1 then raise exception 'gap anchor %', n; end if;
  d := replace(d, procedure_anchor, 'gdays as (select distinct c.day from classes c where false and ');
  execute d;
end $s5$;

-- 6 · after applying: select public.coe_lc_check_run(); then compare coe_pkg_calc_sheet vs coe_pkg_calc for every student.
-- 7 · keep the comparison meaningful after the switch: coe_lc_check_run / coe_lc_calc3 compare against coe_pkg_calc, which
--     now IS the database count. Re-point the check at coe_pkg_calc_sheet / coe_pkg_mon_sheet (same anchored replace as step 2).
