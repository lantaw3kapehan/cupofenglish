-- Rollback of SQL-db-lesson-calc-SWITCH-20261027.sql: puts back the definitions saved before the switch.
do $rb$ begin
  execute 'create or replace view public.coe_pkg_calc as ' || (select def from public.coe_defs_20261027 where name = 'view coe_pkg_calc');
  execute 'create or replace view public.coe_pkg_mon as ' || (select def from public.coe_defs_20261027 where name = 'view coe_pkg_mon');
  execute (select def from public.coe_defs_20261027 where name = 'function coe_pkg_sync');
  execute (select def from public.coe_defs_20261027 where name = 'function coe_portal_pkgs');
end $rb$;
-- The extra views (coe_pkg_calc_sheet, coe_pkg_mon_sheet, coe_lc_calc4, coe_lc_live) are harmless once unused; drop them only if wanted:
-- drop view if exists public.coe_lc_live; drop view if exists public.coe_lc_calc4; drop view if exists public.coe_pkg_mon_sheet; drop view if exists public.coe_pkg_calc_sheet;
-- Note: while the switch was live, coe_pkg_sync did not write fin_adj/avail_adj. After rollback it resumes and re-calibrates to the sheet
-- (each correction waits 8 minutes, as before).
