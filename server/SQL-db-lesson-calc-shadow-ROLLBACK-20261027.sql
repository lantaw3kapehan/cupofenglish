-- Rollback for SQL-db-lesson-calc-shadow-20261027.sql: removes only the shadow objects (nothing else reads them).
drop view if exists public.coe_lc_calc;
drop view if exists public.coe_lc_mon;
drop view if exists public.coe_lc_days;
