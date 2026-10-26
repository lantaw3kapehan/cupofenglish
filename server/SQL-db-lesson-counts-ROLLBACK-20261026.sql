-- Rollback of SQL-db-lesson-counts-20261026.sql: restores the 25 Oct definitions saved in coe_defs_20261026.
-- The two views must be dropped and recreated (new columns m_sheet / m_db were appended), then grants restored.
do $rb$ declare v text; f text; begin
  select def into f from public.coe_defs_20261026 where name = 'function coe_pkg_sync'; execute f;
  select def into v from public.coe_defs_20261026 where name = 'view coe_pkg_calc';
  execute 'drop view public.coe_pkg_calc cascade'; execute 'create view public.coe_pkg_calc as ' || v;
  select def into v from public.coe_defs_20261026 where name = 'view coe_pkg_mon';
  execute 'create or replace view public.coe_pkg_mon as ' || v;
end $rb$;
-- coe_pkg_subs / coe_pkg_rows / coe_pkg_mirror reference coe_pkg_calc by name (plpgsql/sql bodies) and keep working; re-run if cascade dropped anything:
grant select on public.coe_pkg_calc, public.coe_pkg_mon to service_role;
revoke all on public.coe_pkg_calc, public.coe_pkg_mon from anon, authenticated;
