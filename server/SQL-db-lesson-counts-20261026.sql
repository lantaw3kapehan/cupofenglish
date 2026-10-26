-- 26 Oct 2026 · lessons from October 2026 on are counted by the DATABASE from the calendar copy (classes), only once a class has ended.
-- Before October the sheet's S-MONTHLY stays the source (closed months). The sheet calibration keeps working exactly as before:
-- the sheet's numbers are shifted by the same (database − sheet) October+ difference, so only the calendar difference changes the counts.
create or replace view public.coe_cls_units as
  select c.code, lower(trim(c.teachers->>0)) t, date_trunc('month', c.day)::date m,
         sum(round(extract(epoch from (c.ends_at - c.starts_at)) / 60.0 / 50.0 * 2) / 2) h
  from public.classes c
  where c.day >= date '2026-10-01' and c.day <= ((now() at time zone 'Asia/Manila')::date)
    and c.ends_at <= now() and not c.cancelled and c.id not like 'pend-%' and c.code like 'ST-%'
    and regexp_replace(coalesce(c.data->>'title', ''), '\s+X$', '', 'i') !~* '-(TC|SC)$'
  group by 1, 2, 3;

create or replace view public.coe_pkg_calc as
WITH today AS MATERIALIZED ( SELECT ((now() AT TIME ZONE 'Asia/Manila'::text))::date AS d ),
mon AS MATERIALIZED ( SELECT TRIM(BOTH FROM (sheet_rows.data ->> 1)) AS code, TRIM(BOTH FROM COALESCE((sheet_rows.data ->> 3), ''::text)) AS teacher, coe_day((sheet_rows.data ->> 0)) AS m, sum(coe_num((sheet_rows.data ->> 6))) AS h FROM sheet_rows WHERE ((sheet_rows.tab = 'S-MONTHLY'::text) AND (sheet_rows.r >= 2)) GROUP BY 1, 2, 3 ),
cls AS MATERIALIZED ( SELECT code, t, m, h FROM coe_cls_units ),
sub AS MATERIALIZED ( SELECT DISTINCT TRIM(BOTH FROM (sheet_rows.data ->> 3)) AS code, (sheet_rows.data ->> 0) AS ts, (sheet_rows.data ->> 5) AS tt, TRIM(BOTH FROM COALESCE((sheet_rows.data ->> 11), ''::text)) AS rt, coe_num((sheet_rows.data ->> 8)) AS u FROM sheet_rows WHERE ((sheet_rows.tab = 'TC&SUB'::text) AND (sheet_rows.r >= 2) AND ((sheet_rows.data ->> 9) = 'Subbed'::text)) ),
live AS MATERIALIZED ( SELECT * FROM coe_packages WHERE (coe_packages.removed_at IS NULL) ),
p AS ( SELECT k.*, ( SELECT (max(key.key))::date FROM jsonb_object_keys(k.month_adj) key(key)) AS adj_last, ( SELECT (min(date_trunc('month'::text, (z.buy)::timestamp with time zone)))::date FROM live z WHERE ((z.code = k.code) AND (z.teacher = k.teacher) AND (z.id <> k.id) AND (z.buy > COALESCE(k.buy, '1900-01-01'::date)))) AS next_m FROM live k ),
pm AS ( SELECT p.id, (g.m)::date AS m,
    COALESCE(mon.h, 0::numeric) AS hs, COALESCE(cls.h, 0::numeric) AS hd,
    COALESCE(((p.month_adj ->> ((g.m)::date)::text))::numeric, 0::numeric) AS adj
  FROM p CROSS JOIN generate_series('2025-01-01'::date::timestamp with time zone, (date_trunc('month'::text, (( SELECT today.d FROM today))::timestamp with time zone))::date::timestamp with time zone, '1 mon'::interval) g(m)
  LEFT JOIN mon ON mon.code = p.code AND mon.teacher = p.teacher AND mon.m = (g.m)::date
  LEFT JOIN cls ON cls.code = p.code AND cls.t = lower(trim(p.teacher)) AND cls.m = (g.m)::date
  WHERE CASE WHEN (p.month_adj <> '{}'::jsonb) THEN ((p.month_adj ? ((g.m)::date)::text) OR ((p.adj_last >= '2026-10-01'::date) AND ((g.m)::date > p.adj_last) AND ((p.next_m IS NULL) OR ((g.m)::date < p.next_m)))) ELSE (((p.buy IS NULL) OR ((g.m)::date >= (date_trunc('month'::text, (p.buy)::timestamp with time zone))::date)) AND ((p.next_m IS NULL) OR ((g.m)::date < p.next_m))) END ),
pmx AS ( SELECT id, sum(CASE WHEN m >= date '2026-10-01' THEN hd ELSE hs END + adj) AS months,
    sum(CASE WHEN m >= date '2026-10-01' THEN hs ELSE 0 END) AS m_sheet, sum(CASE WHEN m >= date '2026-10-01' THEN hd ELSE 0 END) AS m_db FROM pm GROUP BY id ),
c1 AS ( SELECT p.*, COALESCE(pmx.months, 0::numeric) AS months, COALESCE(pmx.m_sheet, 0::numeric) AS m_sheet, COALESCE(pmx.m_db, 0::numeric) AS m_db,
   COALESCE(( SELECT sum(sub.u) FROM sub, today WHERE ((sub.code = p.code) AND ((p.buy IS NULL) OR (substr(sub.ts, 1, 19) >= (p.buy)::text)) AND (substr(sub.ts, 1, 19) < LEAST(COALESCE((( SELECT min(z.buy) FROM live z WHERE ((z.code = p.code) AND (lower(z.teacher) = lower(p.teacher)) AND (z.buy > COALESCE(p.buy, '1900-01-01'::date)))))::text, '9999'::text), ((today.d + 1))::text)) AND ((lower(sub.rt) = lower(p.teacher)) OR ((NOT (EXISTS ( SELECT 1 FROM live z WHERE ((z.code = p.code) AND (lower(z.teacher) = lower(sub.rt)) AND ((z.buy IS NULL) OR ((z.buy)::text <= substr(sub.ts, 1, 10))))))) AND (p.id = ( SELECT z.id FROM live z WHERE ((z.code = p.code) AND ((z.buy IS NULL) OR ((z.buy)::text <= substr(sub.ts, 1, 10)))) ORDER BY z.buy DESC NULLS LAST, z.sheet_r, z.id LIMIT 1)))))), 0::numeric) AS subs
  FROM p LEFT JOIN pmx ON pmx.id = p.id ),
c2 AS MATERIALIZED ( SELECT c1.*, ((c1.months + c1.subs) + c1.fin_adj) AS fin, COALESCE(NULLIF(TRIM(BOTH FROM COALESCE(c1.shared, ''::text)), ''::text), c1.code) AS pkg,
   ((((COALESCE(c1.transfer_out, 0::numeric) + COALESCE(c1.carry, 0::numeric)) + COALESCE(c1.gift, 0::numeric)) + COALESCE(c1.returned, 0::numeric)) + COALESCE(c1.incentive, 0::numeric)) AS extra FROM c1 ),
shr AS ( SELECT pkg, sum(extra) se, sum(fin) sf FROM c2 WHERE enrolled IS NULL GROUP BY pkg )
SELECT x.id, x.code, x.name, x.teacher, x.buy, x.months, x.subs, x.fin,
  CASE WHEN ((x.enrolled IS NULL) OR x.avail_off) THEN NULL::numeric ELSE ((((x.extra + x.enrolled) + COALESCE(shr.se, 0::numeric)) - (x.fin + COALESCE(shr.sf, 0::numeric))) + x.avail_adj) END AS avail,
  CASE WHEN x.deadline_set THEN x.deadline WHEN ((x.buy IS NULL) OR (x.enrolled IS NULL)) THEN NULL::date ELSE ((x.buy + CASE WHEN (x.enrolled < 30::numeric) THEN '4 mons'::interval WHEN (x.enrolled < 60::numeric) THEN '8 mons'::interval ELSE '1 year'::interval END))::date END AS deadline,
  x.sheet_r, x.m_sheet, x.m_db
FROM c2 x LEFT JOIN shr ON shr.pkg = x.pkg;

create or replace view public.coe_pkg_mon as
WITH today AS MATERIALIZED ( SELECT ((now() AT TIME ZONE 'Asia/Manila'::text))::date AS d ),
mon AS MATERIALIZED ( SELECT TRIM(BOTH FROM (sheet_rows.data ->> 1)) AS code, TRIM(BOTH FROM COALESCE((sheet_rows.data ->> 3), ''::text)) AS teacher, coe_day((sheet_rows.data ->> 0)) AS m, sum(coe_num((sheet_rows.data ->> 6))) AS h FROM sheet_rows WHERE ((sheet_rows.tab = 'S-MONTHLY'::text) AND (sheet_rows.r >= 2)) GROUP BY 1, 2, 3 ),
cls AS MATERIALIZED ( SELECT code, t, m, h FROM coe_cls_units ),
live AS MATERIALIZED ( SELECT * FROM coe_packages WHERE (coe_packages.removed_at IS NULL) ),
p AS ( SELECT k.id, k.code, k.teacher, k.buy, k.month_adj, ( SELECT (max(key.key))::date FROM jsonb_object_keys(k.month_adj) key(key)) AS adj_last, ( SELECT (min(date_trunc('month'::text, (z.buy)::timestamp with time zone)))::date FROM live z WHERE ((z.code = k.code) AND (z.teacher = k.teacher) AND (z.id <> k.id) AND (z.buy > COALESCE(k.buy, '1900-01-01'::date)))) AS next_m FROM live k )
SELECT p.id, (g.m)::date AS m,
  (CASE WHEN (g.m)::date >= date '2026-10-01' THEN COALESCE(cls.h, 0::numeric) ELSE COALESCE(mon.h, 0::numeric) END + COALESCE(((p.month_adj ->> ((g.m)::date)::text))::numeric, 0::numeric)) AS v
FROM p CROSS JOIN generate_series('2025-01-01'::date::timestamp with time zone, (date_trunc('month'::text, (( SELECT today.d FROM today))::timestamp with time zone))::date::timestamp with time zone, '1 mon'::interval) g(m)
LEFT JOIN mon ON mon.code = p.code AND mon.teacher = p.teacher AND mon.m = (g.m)::date
LEFT JOIN cls ON cls.code = p.code AND cls.t = lower(trim(p.teacher)) AND cls.m = (g.m)::date
WHERE CASE WHEN (p.month_adj <> '{}'::jsonb) THEN ((p.month_adj ? ((g.m)::date)::text) OR ((p.adj_last >= '2026-10-01'::date) AND ((g.m)::date > p.adj_last) AND ((p.next_m IS NULL) OR ((g.m)::date < p.next_m)))) ELSE (((p.buy IS NULL) OR ((g.m)::date >= (date_trunc('month'::text, (p.buy)::timestamp with time zone))::date)) AND ((p.next_m IS NULL) OR ((g.m)::date < p.next_m))) END;


-- calibration: shift the sheet's numbers by the database's own October+ lessons (same decisions as before, new level)
do $mig$
declare d text; n int;
begin
  select def into d from public.coe_defs_20261026 where name = 'function coe_pkg_sync';
  select (length(d) - length(replace(d, 'coalesce(coe_num(sr.data->>44), 0) ssub', ''))) / length('coalesce(coe_num(sr.data->>44), 0) ssub') into n; if n <> 1 then raise exception 'ps anchor %', n; end if;
  d := replace(d, 'coalesce(coe_num(sr.data->>44), 0) ssub', 'coalesce(coe_num(sr.data->>44), 0) ssub, coalesce(c.m_sheet, 0) msh, coalesce(c.m_db, 0) mdb');
  select (length(d) - length(replace(d, 'c.subs dsub, coe_num(sr.data->>44) ssub,', ''))) / length('c.subs dsub, coe_num(sr.data->>44) ssub,') into n; if n <> 1 then raise exception 'loop anchor %', n; end if;
  d := replace(d, 'c.subs dsub, coe_num(sr.data->>44) ssub,', 'c.subs dsub, coe_num(sr.data->>44) ssub, coalesce(c.m_sheet, 0) msh, coalesce(c.m_db, 0) mdb,');
  select (length(d) - length(replace(d, 'sf := rec.s_fin - coalesce(rec.ssub, 0) + coalesce(rec.dsub, 0);', ''))) / length('sf := rec.s_fin - coalesce(rec.ssub, 0) + coalesce(rec.dsub, 0);') into n; if n <> 1 then raise exception 'sf anchor %', n; end if;
  d := replace(d, 'sf := rec.s_fin - coalesce(rec.ssub, 0) + coalesce(rec.dsub, 0);', 'sf := rec.s_fin - coalesce(rec.ssub, 0) + coalesce(rec.dsub, 0) - rec.msh + rec.mdb;   -- 26 Oct: October+ lessons are the database''s own (taught classes)');
  select (length(d) - length(replace(d, 'select sum(x.ssub - x.dsub) from ps x', ''))) / length('select sum(x.ssub - x.dsub) from ps x') into n; if n <> 1 then raise exception 'sa anchor %', n; end if;
  d := replace(d, 'select sum(x.ssub - x.dsub) from ps x', 'select sum(x.ssub - x.dsub + x.msh - x.mdb) from ps x');
  execute d;
end $mig$;

revoke all on public.coe_cls_units, public.coe_pkg_calc, public.coe_pkg_mon from anon, authenticated;
grant select on public.coe_cls_units, public.coe_pkg_calc, public.coe_pkg_mon to service_role;
drop view if exists public.coe_pkg_calc_v3;
