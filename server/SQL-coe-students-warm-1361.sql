-- 1361 · Students list ready-made every minute (needs coe edge function v44 = server/coe-1361-students-warm.ts deployed first)
select cron.schedule('coe-students-warm', '* * * * *', $$select net.http_post(url := 'https://rlxkiahqjsabopmuhern.supabase.co/functions/v1/coe', body := '{"op":"warm"}'::jsonb, headers := '{"Content-Type":"application/json"}'::jsonb, timeout_milliseconds := 20000)$$);
-- rollback: select cron.unschedule('coe-students-warm'); redeploy server/coe.ts (v43); delete from docs where key = 'calc:mgmtStudents';
