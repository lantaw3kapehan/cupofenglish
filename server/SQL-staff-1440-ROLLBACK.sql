-- Rollback for 1440/1441 (Add teacher / staff). Run only if the feature is removed; first revert patches 1440 + 1441 in app.html
-- (git revert, or reset main to branch rollback-pre-1440) and delete the edge function coe-staff (Supabase › Edge Functions).
-- MASTERLIST, PAYROLL and sign-in in Google are not touched by this; STAFF28 cell notes allow zzStaff28Undo there.
-- sys:fixedpay keeps its last list (it is still read by FIXPAY28); sys:chat exclude list stays as it is.
drop function if exists public.staff_class_stats();
drop table if exists public.staff_log;
drop table if exists public.staff;
