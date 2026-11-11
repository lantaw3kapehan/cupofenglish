-- 2083 (11 Nov 17:55, Misty: "DO IT NOW SINCE WE ARE BECOMING REPETITIVE WITH THIS AGAIN"): a class cancel / restore / move made in the app is final
-- in the database the moment it is saved. Google Calendar still gets the same change in the background as a copy (coe-mgmt classEdit), but its
-- answer can no longer undo it: coe-mgmt only writes Google's answer onto a save still 'busy', and this marks it 'done' at once, so
-- coe_class_edit_revert (acts only on 'error') never runs. The make-up row the database adds becomes a real class at once (app-<save>-m).
-- Switch: docs sys:live.classDbFinal (false = Google decides again, as before).
-- Tested 11 Nov 18:05 with a made-up student (ST-2099-999, rolled back): status done · db true · Google's refusal changed 0 rows · class stays
-- cancelled · make-up row app-<save>-m.
-- Still Google's: the rare cancel + make-up + "stop this schedule" together, and any other class action not sent through coe-mgmt classEdit.
-- If Google refuses a "stop this schedule" / "move the later classes too", coe-mgmt still puts those later classes back (the first class stays).
update docs set data = data || '{"classDbFinal": true}'::jsonb where key = 'sys:live';

create or replace function coe_class_edit_dbfinal() returns trigger language plpgsql security definer set search_path = public as $$
begin
  if not coalesce((select (data->>'classDbFinal')::boolean from docs where key = 'sys:live'), false) then return new; end if;
  if new.fn <> 'editClass' or new.status <> 'busy' or jsonb_typeof(new.args->3) is distinct from 'object' or jsonb_typeof(new.args->3->'before') is distinct from 'object' then return new; end if;
  update writes set status = 'done', done_at = now(),
    result = jsonb_build_object('ok', true, 'db', true, 'note', 'Saved in the app · Google Calendar gets a copy')
  where id = new.id and status = 'busy';
  return new;
exception when others then
  begin insert into coe_trigger_errors (fn, err, at) values ('coe_class_edit_dbfinal', sqlerrm, now()); exception when others then null; end;
  return new;
end $$;
revoke execute on function coe_class_edit_dbfinal() from public, anon, authenticated;
drop trigger if exists zz_coe_class_edit_dbfinal on writes;
create trigger zz_coe_class_edit_dbfinal after insert on writes for each row when (new.fn = 'editClass') execute function coe_class_edit_dbfinal();

create or replace function coe_class_makeup_dbfinal() returns trigger language plpgsql security definer set search_path = public as $$
declare wid bigint;
begin
  if new.id !~ '^pend-\d+-m\|' then return new; end if;
  wid := substring(new.id from '^pend-(\d+)-m')::bigint;
  if exists (select 1 from writes where id = wid and fn = 'editClass' and status = 'done' and result->>'db' = 'true') then perform coe_class_pend_fix(wid); end if;
  return new;
exception when others then
  begin insert into coe_trigger_errors (fn, err, at) values ('coe_class_makeup_dbfinal', sqlerrm, now()); exception when others then null; end;
  return new;
end $$;
revoke execute on function coe_class_makeup_dbfinal() from public, anon, authenticated;
drop trigger if exists zz_coe_class_makeup_dbfinal on classes;
create trigger zz_coe_class_makeup_dbfinal after insert on classes for each row when (new.id like 'pend-%') execute function coe_class_makeup_dbfinal();
