-- 1613 (29 Oct 2026, speed) · the lesson-count check (cron job 27, coe-lc-check → coe_lc_check_run → docs sys:lessoncheck)
-- moves from every 2 minutes to every 10, at :03 :13 :23 … (no other job starts then: the packages sync is :00/:05, the renewal
-- check and KPI snapshot :00, the other 2-minute jobs on even minutes). Applied as migration lc_check_every10_1613.
-- Readers of sys:lessoncheck checked first: none in app.html, the repo's server code, the database (functions / views) or the
-- Apps Script copy (Code.gs); PLAN-2026-10-27-db-lesson-counts says "nothing user-facing reads them". It is a diagnostic report.
-- Load: mean 2.0 s, max 10.8 s, 2,450 s of database time in pg_stat_statements → about 5× less.
-- Old schedule backed up in docs 'bak:1613' ({"schedule": "*/2 * * * *", ...}).
select cron.alter_job(job_id := 27, schedule := '3-59/10 * * * *');
-- Undo:
--   select cron.alter_job(job_id := 27, schedule := (select data->>'schedule' from docs where key = 'bak:1613'));
