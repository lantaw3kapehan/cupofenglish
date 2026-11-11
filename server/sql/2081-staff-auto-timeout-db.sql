-- 2081 (11 Nov, Misty: "ok GO AHEAD"): staff auto time-out moves to the database. Google's autoClose_ (inside warmAll, off since 2079)
-- closed a management staff day left without a time-out. Same rules:
--   · management staff only (auth_users role Ops / Operations / Manager / Admin / President), "Day" rows of the last 3 days, timed in, no time-out;
--   · with a shift that day: closed at the shift end, once 60 minutes have passed after it;
--   · no shift (President), a rest day, or timed in after the shift end: closed at 23:59 of that day, once it has passed;
--   · time-out = that time, hours worked, note "Auto-closed · no time-out" (the staff pay day picks it up through coe_staff_from_timein).
-- Shifts are kept in docs sys:shifts (as Google's CFG.SHIFTS: Sunday first). Undo: select cron.unschedule('coe-auto-timeout');

insert into docs (key, scope, data) values ('sys:shifts', 'pres', jsonb_build_object(
  'celine', jsonb_build_object('title', 'Operations Coordinator',
    'week', jsonb_build_array('10:00-19:00', '13:00-22:00', '13:00-22:00', '', '13:00-22:00', '13:00-22:00', '13:00-22:00')),
  'graceMin', 60, 'noShiftOut', '23:59'))
on conflict (key) do nothing;

create or replace function coe_auto_timeout(p_dry boolean default false) returns jsonb language plpgsql security definer set search_path = public as $$
declare S jsonb := coalesce((select data from docs where key = 'sys:shifts'), '{}'::jsonb); x record; dy date; tin timestamptz; w text;
  e timestamptz; due timestamptz; d jsonb; hrs numeric; n int := 0; done jsonb := '[]'::jsonb;
  grace int := coalesce((S->>'graceMin')::int, 60); late text := coalesce(S->>'noShiftOut', '23:59');
begin
  for x in select l.id, l.data from log_rows l
           where l.tab = 'T-TIMEIN' and coalesce(l.data->>13, '') = 'Day' and coalesce(l.data->>18, '') = '' and coalesce(l.data->>3, '') ~ 'T\d\d:\d\d'
             and left(l.data->>0, 10) >= to_char((now() at time zone 'Asia/Manila')::date - 3, 'YYYY-MM-DD')
             and exists (select 1 from auth_users u where lower(trim(u.name)) = lower(trim(l.data->>1)) and u.role ~* 'ops|operation|manag|admin|president') loop
    dy := left(x.data->>0, 10)::date; tin := ((x.data->>3) || '+08:00')::timestamptz;
    w := S->lower(trim(x.data->>1))->'week'->>(extract(dow from dy)::int);
    if coalesce(w, '') ~ '^\d\d:\d\d-\d\d:\d\d$' then
      e := ((dy::text || ' ' || split_part(w, '-', 2))::timestamp at time zone 'Asia/Manila'); due := e + grace * interval '1 minute';
    else e := null; end if;
    if e is null or e < tin then e := ((dy::text || ' ' || late)::timestamp at time zone 'Asia/Manila'); due := e; end if;
    if now() < due then continue; end if;
    hrs := round((extract(epoch from e - tin) / 3600)::numeric, 2);
    d := x.data; while jsonb_array_length(d) < 21 loop d := d || '""'::jsonb; end loop;
    d := jsonb_set(jsonb_set(jsonb_set(d, '{18}', to_jsonb(to_char(e at time zone 'Asia/Manila', 'YYYY-MM-DD"T"HH24:MI:SS'))), '{19}', to_jsonb(hrs)), '{20}', '"Auto-closed · no time-out"'::jsonb);
    done := done || jsonb_build_object('who', x.data->>1, 'day', dy, 'out', to_char(e at time zone 'Asia/Manila', 'HH24:MI'), 'hours', hrs);
    if not p_dry then update log_rows set data = d, updated_at = now() where tab = 'T-TIMEIN' and id = x.id and coalesce(data->>18, '') = ''; end if;
    n := n + 1;
  end loop;
  return jsonb_build_object('closed', n, 'dry', p_dry, 'rows', done);
end $$;
revoke execute on function coe_auto_timeout(boolean) from public, anon, authenticated;

select cron.schedule('coe-auto-timeout', '*/10 * * * *', $c$select coe_auto_timeout()$c$);

-- guard 44 also checks that no management staff day before today is still open after 01:00
-- (function body as applied: see migration 2081_staff_auto_timeout_on; the "ao" count of open T-TIMEIN Day rows from the last 3 days)
