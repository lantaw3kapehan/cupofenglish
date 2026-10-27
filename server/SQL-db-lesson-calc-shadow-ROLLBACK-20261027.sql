-- Rollback for the shadow lesson counter (nothing else reads these objects).
select cron.unschedule('coe-lc-check');
drop function if exists public.coe_lc_check_run();
drop view if exists public.coe_lc_calc3;
drop view if exists public.coe_lc_calc;
drop view if exists public.coe_lc_mon;
drop view if exists public.coe_lc_days;
delete from public.docs where key = 'sys:lessoncheck';
