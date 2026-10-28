-- 28 Oct 2026 · lesson count: a renewed package (renewed IN PLACE, same row) must not count lessons from before its start date.
-- Bug: Luna ST-2026-030 renewed (start 31 Oct, 4 carried + 33) showed 8 left instead of 37 – her row's month_adj still listed
-- March–October, and coe_pkg_calc / coe_pkg_mon count every month listed there, so the previous cycle's 29 lessons were charged again.
-- Fix (both views, same rule):
--   1. months before the package's start month never count (whatever month_adj lists);
--   2. in the start month from October 2026 on (database calendar), only lessons on/after the start date count
--      (m_db / m_sheet stay whole-month, so coe_pkg_sync's sheet comparison is unchanged).
-- Packages whose numbers already equal the sheet (incl. every "sheet fix kept" from renew27) keep exactly the same numbers:
-- the difference is moved into fin_adj in the same transaction and logged ('window fix'). Only packages that did NOT match the
-- sheet change (Luna). Rollback: SQL-pkg-window-ROLLBACK-20261028.sql.
create table if not exists public.coe_defs_20261028 (name text primary key, def text not null, saved_at timestamptz default now());
insert into public.coe_defs_20261028 (name, def) values
  ('view coe_pkg_calc', pg_get_viewdef('public.coe_pkg_calc'::regclass, true)),
  ('view coe_pkg_mon', pg_get_viewdef('public.coe_pkg_mon'::regclass, true))
on conflict (name) do nothing;

create or replace view public.coe_cls_days as
  select c.code, lower(trim(c.teachers->>0)) t, c.day, sum(round(extract(epoch from (c.ends_at - c.starts_at)) / 60.0 / 50.0 * 2) / 2) h
  from public.classes c
  where c.day >= date '2026-10-01' and c.day <= ((now() at time zone 'Asia/Manila')::date)
    and c.ends_at <= now() and not c.cancelled and c.id not like 'pend-%' and c.code like 'ST-%'
    and regexp_replace(coalesce(c.data->>'title', ''), '\s+X$', '', 'i') !~* '-(TC|SC)$'
  group by 1, 2, 3;
revoke all on public.coe_cls_days from anon, authenticated;
grant select on public.coe_cls_days to service_role;

do $w$
declare dc text; dm text; n int; f record; k int := 0;
  w_old text := 'WHEN p.month_adj <> ''{}''::jsonb THEN p.month_adj ? g.m::date::text OR p.adj_last >= ''2026-10-01''::date AND g.m::date > p.adj_last AND (p.next_m IS NULL OR g.m::date < p.next_m)';
  w_new text := 'WHEN p.month_adj <> ''{}''::jsonb THEN (p.buy IS NULL OR g.m::date >= date_trunc(''month''::text, p.buy::timestamp with time zone)::date) AND (p.month_adj ? g.m::date::text OR p.adj_last >= ''2026-10-01''::date AND g.m::date > p.adj_last AND (p.next_m IS NULL OR g.m::date < p.next_m))';
  pre text := 'COALESCE(( SELECT sum(x.h) FROM coe_cls_days x WHERE x.code = p.code AND x.t = lower(TRIM(BOTH FROM p.teacher)) AND x.day >= g.m::date AND x.day < p.buy), 0::numeric)';
  c_old1 text := 'COALESCE(cls.h, 0::numeric) AS hd,';
  c_old2 text := E'WHEN pm.m >= ''2026-10-01''::date THEN pm.hd\n                    ELSE pm.hs\n                END + pm.adj) AS months';
  m_old text := 'WHEN g.m::date >= ''2026-10-01''::date THEN COALESCE(cls.h, 0::numeric)';
begin
  dc := pg_get_viewdef('public.coe_pkg_calc'::regclass, true);
  dm := pg_get_viewdef('public.coe_pkg_mon'::regclass, true);
  select (length(dc) - length(replace(dc, w_old, ''))) / length(w_old) into n; if n <> 1 then raise exception 'calc where %', n; end if;
  select (length(dc) - length(replace(dc, c_old1, ''))) / length(c_old1) into n; if n <> 1 then raise exception 'calc hd %', n; end if;
  select (length(dc) - length(replace(dc, c_old2, ''))) / length(c_old2) into n; if n <> 1 then raise exception 'calc months %', n; end if;
  select (length(dm) - length(replace(dm, w_old, ''))) / length(w_old) into n; if n <> 1 then raise exception 'mon where %', n; end if;
  select (length(dm) - length(replace(dm, m_old, ''))) / length(m_old) into n; if n <> 1 then raise exception 'mon v %', n; end if;
  dc := replace(dc, w_old, w_new);
  dc := replace(dc, c_old1, c_old1 || ' ' || pre || ' AS pre,');
  dc := replace(dc, c_old2, E'WHEN pm.m >= ''2026-10-01''::date THEN pm.hd - pm.pre\n                    ELSE pm.hs\n                END + pm.adj) AS months');
  dm := replace(dm, w_old, w_new);
  dm := replace(dm, m_old, m_old || ' - ' || pre);

  -- numbers before, and whether each package currently equals the sheet (same test as coe_pkg_sync)
  create table public.coe_window_20261028 as
    select c.id, c.code, c.name, c.teacher, c.fin old_fin, c.avail old_avail,
      coe_num(sr.data->>45) - coalesce(coe_num(sr.data->>44), 0) + coalesce(c.subs, 0) - coalesce(c.m_sheet, 0) + coalesce(c.m_db, 0) sf
    from public.coe_pkg_calc c join public.coe_packages p on p.id = c.id
    left join public.sheet_rows sr on sr.tab = 'ACTIVE~' and sr.r = p.sheet_r and trim(sr.data->>0) = p.code;

  execute 'create or replace view public.coe_pkg_calc as ' || dc;
  execute 'create or replace view public.coe_pkg_mon as ' || dm;

  for f in select b.id, b.code, b.old_fin, c.fin new_fin, b.sf from public.coe_window_20261028 b join public.coe_pkg_calc c on c.id = b.id
           where c.fin is distinct from b.old_fin loop
    if f.sf is not null and abs(f.old_fin - f.sf) < 0.01 then      -- already equal to the sheet: keep the number, move the difference into fin_adj
      update public.coe_packages set fin_adj = fin_adj + (f.old_fin - f.new_fin), updated_at = now() where id = f.id;
      insert into public.coe_pkg_log (pkg, code, what, detail) values (f.id, f.code, 'window fix kept', jsonb_build_object('fin', f.old_fin - f.new_fin));
    else
      insert into public.coe_pkg_log (pkg, code, what, detail) values (f.id, f.code, 'window fix', jsonb_build_object('fin_before', f.old_fin, 'fin_after', f.new_fin, 'sheet', f.sf));
      k := k + 1;
    end if;
  end loop;
  raise notice 'packages whose count changed: %', k;
end $w$;
