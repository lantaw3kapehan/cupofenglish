-- 2476 · 19 Nov 2026 20:15 · spread the on-the-hour pile-up (35 jobs started at 18:00:00, database restarted 18:00:52).
-- Jobs at minute 0: 37 → 18. coe-book-gaps (35 s) 17 → 42 (quietest minute).
-- Rollback: fbs-refresh, money-apply, ready-refresh, tmap, trdata-mirror, tx-db → '*/10 * * * *';
--   health, money-mirror, smonthly-mirror, weeksum, returned, rf-fill-1843 → '*/5 * * * *';
--   rank, rem-sync → '*/2 * * * *'; today → '*/3 * * * *'; class-shadow → '*/15 * * * *'; book-gaps → '17 * * * *'.
select jobname, cron.alter_job(jobid, schedule := s || ' * * * *') from (values
 ('coe-fbs-refresh','5-59/10'),('coe-money-apply','6-59/10'),('coe-ready-refresh','7-59/10'),('coe-tmap','8-59/10'),('coe-trdata-mirror','9-59/10'),('coe-tx-db','4-59/10'),
 ('coe-health','4-59/5'),('coe-money-mirror','4-59/5'),('coe-smonthly-mirror','3-59/5'),('coe-weeksum','1-59/5'),('coe-returned','3-59/5'),('coe-rf-fill-1843','4-59/5'),
 ('coe-rank','1-59/2'),('coe-rem-sync','1-59/2'),('coe-today','2-59/3'),('coe-class-shadow','7-59/15'),('coe-book-gaps','42')
) v(n,s) join cron.job j on j.jobname=v.n;
