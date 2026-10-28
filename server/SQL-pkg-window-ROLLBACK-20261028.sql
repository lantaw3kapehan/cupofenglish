-- Rollback of SQL-pkg-window-20261028.sql: restore both views and undo the fin_adj moves ('window fix kept').
do $rb$ begin
  execute 'create or replace view public.coe_pkg_calc as ' || (select def from public.coe_defs_20261028 where name = 'view coe_pkg_calc');
  execute 'create or replace view public.coe_pkg_mon as ' || (select def from public.coe_defs_20261028 where name = 'view coe_pkg_mon');
  update public.coe_packages p set fin_adj = p.fin_adj - l.d, updated_at = now()
    from (select pkg, sum((detail->>'fin')::numeric) d from public.coe_pkg_log where what = 'window fix kept' group by pkg) l where l.pkg = p.id;
  insert into public.coe_pkg_log (what, detail) values ('window fix rolled back', '{}'::jsonb);
end $rb$;
