-- 2073 (11 Nov, Misty: "CONTINUE THE PLAN TO MOVE OFF GOOGLE"): the rest of the leave saves are finished by the database.
-- mgmtLeaveSave (new, change, remove, with proof files), mgmtLeaveAsk, tLeaveReply (also with files), tLeaveInformed, mgmtLeaveInformed, tLeaveCancel.
-- coe_dbf_h_leave already makes every change in coe_leave (and logs it in coe_dbf_log); this gives Google's answer and stops Google doing it again.
-- When the handler made no change (a refusal), Google answers with its message as before. Undo: sys:live.leaveGoogle = true.

-- 1 · a teacher's answer WITH files: the handler now records it too (Google's thread line: "<text or 'Sent a file'> · n file(s) attached")
do $$ declare d text := pg_get_functiondef('coe_dbf_h_leave(writes)'::regprocedure); begin
  d := replace(d, $x$    if jsonb_typeof(a->3) = 'array' and jsonb_array_length(a->3) > 0 then return; end if;   -- with files: Google only
    q := trim(coe_dbf_s(a->2));
    select * into x from coe_leave where removed_at is null and leave_id = coe_dbf_s(a->1) order by sheet_r nulls last limit 1;
    if x.id is null or lower(x.teacher) <> lower(who) or x.status <> 'Pending' or q = '' then return; end if;$x$,
  $x$    q := trim(coe_dbf_s(a->2));   -- 2073: with files too (the files go to storage through coe-proof)
    select * into x from coe_leave where removed_at is null and leave_id = coe_dbf_s(a->1) order by sheet_r nulls last limit 1;
    v_key := case when jsonb_typeof(a->3) = 'array' then least(jsonb_array_length(a->3), 3)::text else '0' end;
    if x.id is null or lower(x.teacher) <> lower(who) or x.status <> 'Pending' or (q = '' and v_key = '0') then return; end if;
    if v_key <> '0' then q := coalesce(nullif(q, ''), 'Sent a file') || ' · ' || v_key || ' file' || case when v_key = '1' then '' else 's' end || ' attached'; end if;$x$);
  if position('2073: with files too' in d) = 0 then raise exception 'tLeaveReply branch not found'; end if;
  execute d; end $$;

-- 2 · the answer, the LV- number of a leave made by management, and the proof queue
create or replace function coe_leave2_takeover() returns trigger language plpgsql security definer set search_path = public as $$
declare st text; l coe_leave; lg coe_dbf_log; f jsonb; a jsonb := new.args; lv text; k int := 0; nf int := 0; res jsonb; files jsonb;
begin
  if coalesce((select (data->>'leaveGoogle')::boolean from docs where key = 'sys:live'), false) then return new; end if;
  select status into st from writes where id = new.id; if coalesce(st, '') <> 'new' then return new; end if;
  select * into lg from coe_dbf_log where wid = new.id and tbl = 'coe_leave' and undone_at is null order by id desc limit 1;
  if lg.wid is null then return new; end if;            -- no change made (a refusal): Google answers as before
  select * into l from coe_leave where id = lg.row_key::bigint;
  if l.id is null then return new; end if;
  f := case when jsonb_typeof(a->1) = 'object' then a->1 else '{}'::jsonb end;
  files := case when new.fn = 'tLeaveReply' then a->3 when new.fn = 'mgmtLeaveSave' then f->'files' end;
  if jsonb_typeof(files) = 'array' then nf := least(jsonb_array_length(files), 3); end if;

  if new.fn = 'mgmtLeaveSave' then
    if lg.op = 'insert' then
      lv := 'LV-' || to_char(new.created_at at time zone 'Asia/Manila', 'YYMMDDHH24MISS');
      while exists (select 1 from coe_leave where leave_id = lv and id <> l.id) and k < 50 loop
        k := k + 1; lv := 'LV-' || to_char((new.created_at + k * interval '1 second') at time zone 'Asia/Manila', 'YYMMDDHH24MISS'); end loop;
      update coe_leave set leave_id = lv, updated_at = now() where id = l.id;
      res := jsonb_build_object('ok', true, 'id', lv, 'teacher', l.teacher, 'status', l.status,
        'note', l.teacher || ' · ' || l.type || ' · ' || l.from_d || case when l.to_d is distinct from l.from_d then ' → ' || l.to_d else '' end
                || ' · ' || case when l.status = 'Pending' then 'sent to the President' else l.status end);
    elsif coalesce(f->>'remove', '') not in ('', 'false') then
      res := jsonb_build_object('ok', true, 'teacher', l.teacher, 'note', 'Removed · ' || l.teacher || ' · ' || l.type); nf := 0;
    else
      res := jsonb_build_object('ok', true, 'teacher', l.teacher, 'status', l.status,
        'note', l.teacher || ' · ' || l.type || ' · ' || case when coalesce(f->>'endorse', '') not in ('', 'false') and l.status = 'Pending' then 'checked, sent to the President' else l.status end);
    end if;
  elsif new.fn = 'mgmtLeaveAsk' then
    res := jsonb_build_object('ok', true, 'teacher', l.teacher, 'note', 'Asked Teacher ' || l.teacher || ' for more details');
  elsif new.fn = 'tLeaveReply' then
    res := jsonb_build_object('ok', true, 'files', nf, 'note', 'Sent · Operations will check it');
  elsif new.fn in ('tLeaveInformed', 'mgmtLeaveInformed') then
    res := jsonb_build_object('ok', true);
  elsif new.fn = 'tLeaveCancel' then
    res := jsonb_build_object('ok', true, 'note', l.type || ' · ' || l.from_d || case when l.to_d is distinct from l.from_d then ' → ' || l.to_d else '' end);
  else return new; end if;

  res := res || jsonb_build_object('db', true, 'proofPending', nf > 0, 'leaveRow', l.id);
  update writes set status = 'done', done_at = now(), result = res where id = new.id and status = 'new';
  if nf > 0 then begin perform net.http_post(url := 'https://rlxkiahqjsabopmuhern.supabase.co/functions/v1/coe-proof', body := '{"op":"run"}'::jsonb); exception when others then null; end; end if;
  return new;
exception when others then
  begin insert into coe_trigger_errors (fn, err, at) values ('coe_leave2_takeover', sqlerrm, now()); exception when others then null; end;
  return new;
end $$;
revoke execute on function coe_leave2_takeover() from public, anon, authenticated;

-- 3 · the proof queue: any leave save with files; a teacher's request sets the proof, the others add to it
create or replace function coe_proof_claim(p_n int default 6) returns setof writes language sql security definer set search_path = public as $$
  update writes w set result = jsonb_set(w.result, '{proofPending}', '"busy"'), done_at = coalesce(w.done_at, now())
  where w.id in (select id from writes where fn in ('timeIn', 'classIn', 'tLeaveRequest', 'tLeaveReply', 'mgmtLeaveSave') and created_at > now() - interval '3 days'
                   and (result->>'proofPending' = 'true' or (result->>'proofPending' = 'busy' and done_at < now() - interval '3 minutes'))
                 order by id limit p_n for update skip locked)
  returning w.*;
$$;
create or replace function coe_leave_proof_done(p_wid bigint, p_lines text) returns void language plpgsql security definer set search_path = public as $$
declare w writes; f jsonb; rid bigint;
begin
  select * into w from writes where id = p_wid; if w.id is null then return; end if;
  rid := coalesce((w.result->>'leaveRow')::bigint, (select id from coe_leave where wid = p_wid and removed_at is null order by id desc limit 1));
  if coalesce(p_lines, '') <> '' then
    if w.fn = 'tLeaveRequest' then update coe_leave set proof = p_lines, updated_at = now() where id = rid;
    else update coe_leave set proof = concat_ws(E'\n', nullif(proof, ''), p_lines), updated_at = now() where id = rid; end if;
  end if;
  if w.fn = 'tLeaveReply' then
    if jsonb_typeof(w.args->3) = 'array' and jsonb_array_length(w.args->3) > 0 then
      update writes set args = jsonb_set(args, '{3}', (select jsonb_agg(jsonb_build_object('name', x->>'name', 'mime', x->>'mime', 'b64', '(saved)')) from jsonb_array_elements(w.args->3) x)) where id = p_wid;
    end if;
  else
    f := w.args->1;
    if jsonb_typeof(f->'files') = 'array' and jsonb_array_length(f->'files') > 0 then
      f := jsonb_set(f, '{files}', (select jsonb_agg(jsonb_build_object('name', x->>'name', 'mime', x->>'mime', 'b64', '(saved)')) from jsonb_array_elements(f->'files') x));
      update writes set args = jsonb_set(args, '{1}', f) where id = p_wid;
    end if;
  end if;
  update writes set result = jsonb_set(result, '{proofPending}', 'false') where id = p_wid;
end $$;
revoke execute on function coe_proof_claim(int), coe_leave_proof_done(bigint, text) from public, anon, authenticated;
grant execute on function coe_proof_claim(int), coe_leave_proof_done(bigint, text) to service_role;
select cron.alter_job(94, command := $c$select net.http_post(url := 'https://rlxkiahqjsabopmuhern.supabase.co/functions/v1/coe-proof', body := '{"op":"run"}'::jsonb) where exists (select 1 from writes where fn in ('timeIn','classIn','tLeaveRequest','tLeaveReply','mgmtLeaveSave') and created_at > now() - interval '3 days' and result->>'proofPending' in ('true','busy'))$c$);

-- 4 · the guard covers every leave save
create or replace function coe_guard_leave_no_google() returns jsonb language plpgsql security definer set search_path = public as $$
declare n int; e int; p int;
begin
  select count(*) into n from writes where created_at > greatest(now() - interval '24 hours', '2026-11-11 05:18+00') and status not in ('test')
    and coalesce(result->>'ok', '') = 'true' and coalesce(result->>'db', '') <> 'true'
    and (fn = 'tLeaveRequest' or (fn in ('mgmtLeaveSave', 'mgmtLeaveAsk', 'tLeaveReply', 'tLeaveInformed', 'mgmtLeaveInformed', 'tLeaveCancel') and created_at > '2026-11-11 05:45+00'));
  select count(*) into p from writes where fn in ('tLeaveRequest', 'tLeaveReply', 'mgmtLeaveSave') and created_at > now() - interval '24 hours' and result->>'proofPending' in ('true','busy') and created_at < now() - interval '10 minutes';
  select count(*) into e from coe_trigger_errors where fn in ('coe_leave_takeover', 'coe_leave2_takeover') and at > now() - interval '24 hours';
  return jsonb_build_array(jsonb_build_object('check', 'Leave saves never go to Google; proof files saved (24 h)', 'ok', n = 0 and p = 0 and e = 0,
    'why', concat_ws(' · ', case when n > 0 then n || ' finished by Google' end, case when p > 0 then p || ' proofs not saved after 10 min' end, case when e > 0 then e || ' database errors' end)));
end $$;
revoke execute on function coe_guard_leave_no_google() from public, anon, authenticated;
