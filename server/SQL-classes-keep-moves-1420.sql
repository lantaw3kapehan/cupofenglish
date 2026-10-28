-- Applied 28 Oct 2026 as migration classes_keep_moves_1420 (see teacher-app/CHANGES-2026-10-28-reschedule-cache.md)
-- ROLLBACK:  drop trigger classes_keep_moves on public.classes; drop function public.coe_classes_keep_moves(); drop function public.coe_class_move_state(text);
create index if not exists writes_editclass_recent on writes (created_at) where fn = 'editClass';
-- coe_class_move_state(p_id): 'away' = moved away from this id in the last 10 min, 'here' = moved to this id (latest move write new/busy/done wins)
-- coe_classes_keep_moves(): BEFORE INSERT/UPDATE/DELETE on classes · insert/update of an 'away' id is skipped (update keeps old), delete of a 'here' id is skipped
