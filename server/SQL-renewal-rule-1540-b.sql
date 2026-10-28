-- 1540 (b) · the database lesson counter follows the renewal rule: a class on the package's start day that ended before the
-- renewal was recorded (coe_renew_at.at) is counted in the OLD package (as "before the start"), never in the new one; and the
-- CARRY OVER Google recorded is lowered by the lessons that were held before the renewal but not yet counted (coe_renew_at.early),
-- only while the sheet still holds that recorded value (once someone corrects CARRY OVER in the sheet, nothing is taken twice).
create or replace function coe_renew_early(p_code text, p_buy date, p_r int, p_carry numeric) returns numeric language sql stable as $f$
  select coalesce((select ra.early from coe_renew_at ra where ra.code = p_code and ra.buy = p_buy and (ra.row_r is null or ra.row_r = p_r)
                   and ra.left_rec = p_carry and ra.early > 0 limit 1), 0)
$f$;

create or replace view coe_cls_days as
 SELECT c.code, lower(TRIM(BOTH FROM (c.teachers ->> 0))) AS t, c.day,
   sum((round((((EXTRACT(epoch FROM (c.ends_at - c.starts_at)) / 60.0) / 50.0) * (2)::numeric)) / (2)::numeric)) AS h,
   COALESCE(sum((round((((EXTRACT(epoch FROM (c.ends_at - c.starts_at)) / 60.0) / 50.0) * (2)::numeric)) / (2)::numeric))
     FILTER (WHERE EXISTS (SELECT 1 FROM coe_renew_at ra WHERE ra.code = c.code AND ra.buy = c.day AND c.ends_at <= ra.at)), (0)::numeric) AS hb
 FROM classes c
 WHERE c.day >= '2026-10-01'::date AND c.day <= ((now() AT TIME ZONE 'Asia/Manila'::text))::date AND c.ends_at <= now() AND NOT c.cancelled
   AND c.id !~~ 'pend-%'::text AND c.code ~~ 'ST-%'::text
   AND regexp_replace(COALESCE((c.data ->> 'title'::text), ''::text), '\s+X$'::text, ''::text, 'i'::text) !~* '-(TC|SC)$'::text
 GROUP BY c.code, (lower(TRIM(BOTH FROM (c.teachers ->> 0)))), c.day;

create or replace view coe_lc_days as
 WITH hd AS (SELECT sheet_rows.tab, coe_day((sheet_rows.data ->> 4)) AS m0 FROM sheet_rows WHERE ((sheet_rows.tab ~~* '%-DAILY'::text) AND (sheet_rows.r = 1))),
 daily AS (SELECT upper(TRIM(BOTH FROM (s.data ->> 0))) AS code, lower(TRIM(BOTH FROM COALESCE((s.data ->> 2), ''::text))) AS t, (hd.m0 + (j.j - 4)) AS d, coe_num((s.data ->> j.j)) AS v
   FROM ((sheet_rows s JOIN hd ON ((hd.tab = s.tab))) CROSS JOIN generate_series(4, 34) j(j))
   WHERE ((s.r >= 3) AND ((s.data ->> 0) ~ '^ST-'::text) AND (coe_num((s.data ->> j.j)) > (0)::numeric) AND (hd.m0 < '2026-10-01'::date) AND ((hd.m0 + (j.j - 4)) < (hd.m0 + '1 mon'::interval)))),
 cal AS (SELECT c.code, lower(TRIM(BOTH FROM (c.teachers ->> 0))) AS t, c.day AS d,
     (round((((EXTRACT(epoch FROM (c.ends_at - c.starts_at)) / 60.0) / 50.0) * (2)::numeric)) / (2)::numeric) AS v,
     EXISTS (SELECT 1 FROM coe_renew_at ra WHERE ra.code = c.code AND ra.buy = c.day AND c.ends_at <= ra.at) AS b4
   FROM classes c
   WHERE ((c.day >= '2026-10-01'::date) AND (c.day <= ((now() AT TIME ZONE 'Asia/Manila'::text))::date) AND (c.ends_at <= now()) AND (NOT c.cancelled) AND (c.id !~~ 'pend-%'::text) AND (c.code ~~ 'ST-%'::text) AND (regexp_replace(COALESCE((c.data ->> 'title'::text), ''::text), '\s+X$'::text, ''::text, 'i'::text) !~* '-(TC|SC)$'::text)))
 SELECT daily.code, daily.t, daily.d, sum(daily.v) AS v, 'daily'::text AS src, (0)::numeric AS hb FROM daily GROUP BY daily.code, daily.t, daily.d
 UNION ALL
 SELECT cal.code, cal.t, cal.d, sum(cal.v) AS v, 'cal'::text AS src, COALESCE(sum(cal.v) FILTER (WHERE cal.b4), (0)::numeric) AS hb FROM cal GROUP BY cal.code, cal.t, cal.d;

do $d$
declare v text; v0 text;
begin
  -- coe_pkg_calc: lessons before the package = days before the start + the start day's lessons that ended before the renewal; carry less "early"
  v := pg_get_viewdef('coe_pkg_calc'::regclass); v0 := v;
  v := replace(v, 'AND (x_1.day < p.buy))', 'AND (x_1.day <= p.buy))');
  v := replace(v, 'sum(x_1.h) AS sum', 'sum(CASE WHEN (x_1.day < p.buy) THEN x_1.h ELSE x_1.hb END) AS sum');
  v := replace(v, 'COALESCE(c1.carry, (0)::numeric)', '(COALESCE(c1.carry, (0)::numeric) - coe_renew_early(c1.code, c1.buy, c1.sheet_r, c1.carry))');
  v := regexp_replace(v, 'x\.m_db\s+FROM \(c2 x', 'x.m_db, (COALESCE(x.carry, (0)::numeric) - coe_renew_early(x.code, x.buy, x.sheet_r, x.carry)) AS carry_eff FROM (c2 x');
  if v = v0 or position('x_1.hb' in v) = 0 or position('AS carry_eff' in v) = 0 or position('coe_renew_early(c1.code' in v) = 0 then raise exception '1540: coe_pkg_calc text did not match'; end if;
  execute 'create or replace view coe_pkg_calc as ' || v;

  v := pg_get_viewdef('coe_pkg_mon'::regclass); v0 := v;
  v := replace(v, 'AND (x.day < p.buy))', 'AND (x.day <= p.buy))');
  v := replace(v, 'sum(x.h) AS sum', 'sum(CASE WHEN (x.day < p.buy) THEN x.h ELSE x.hb END) AS sum');
  if v = v0 or position('x.hb' in v) = 0 then raise exception '1540: coe_pkg_mon text did not match'; end if;
  execute 'create or replace view coe_pkg_mon as ' || v;

  v := pg_get_viewdef('coe_lc_mon'::regclass); v0 := v;
  v := replace(v, 'coe_lc_days.src,', 'coe_lc_days.src, coe_lc_days.hb,');
  v := replace(v, 'sum(dd.v) FILTER (WHERE (dd.d < pm.buy)) AS before_start',
                  '(COALESCE(sum(dd.v) FILTER (WHERE (dd.d < pm.buy)), (0)::numeric) + COALESCE(sum(dd.hb) FILTER (WHERE (dd.d = pm.buy)), (0)::numeric)) AS before_start');
  v := regexp_replace(v, '(sum\(dd\.v\) FILTER \(WHERE \(\(dd\.d >= GREATEST\(pm\.buy, pm\.m\)\) AND \(dd\.d < LEAST\(COALESCE\(pm\.nxt, ''9999-12-31''::date\), pm\.m1\)\)\)\)) AS after_start',
                  '(\1 - COALESCE(sum(dd.hb) FILTER (WHERE (dd.d = pm.buy)), (0)::numeric)) AS after_start');
  if v = v0 or position('dd.hb) FILTER (WHERE (dd.d = pm.buy)), (0)::numeric)) AS after_start' in v) = 0 or position('coe_lc_days.hb' in v) = 0 then raise exception '1540: coe_lc_mon text did not match'; end if;
  execute 'create or replace view coe_lc_mon as ' || v;

  -- the ACTIVE copy the app shows: CARRY OVER = the carry the counter uses
  v := pg_get_functiondef('coe_pkg_rows'::regproc); v0 := v;
  v := replace(v, 'c.fin, c.avail, c.deadline cdl, c.subs', 'c.fin, c.avail, c.deadline cdl, c.subs, c.carry_eff ce');
  v := replace(v, 'd := jsonb_set(d, ''{5}'', coalesce(to_jsonb(rec.carry), nz));', 'd := jsonb_set(d, ''{5}'', coalesce(to_jsonb(case when rec.carry is null then null else rec.ce end), nz));');
  if v = v0 or position('rec.ce' in v) = 0 or position('c.carry_eff ce' in v) = 0 then raise exception '1540: coe_pkg_rows text did not match'; end if;
  execute v;
end $d$;
