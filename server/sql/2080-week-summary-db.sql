-- 2080 (11 Nov, Misty: "YES MOVE WEEK SUMMARY TO THE DATABASE"). Last week's summary on the Overview (mgmtWeekSum) was Google's copy,
-- made by warmAll, which is off since 2079. The database already had the same summary (coe_week_sum: the class table + the reminder log);
-- checked against Google's last copies for 26 Oct and 2 Nov: the same classes, teachers and cancellations, the same reminders (a few
-- reminder times one minute earlier: the database keeps the moment the reminder was saved).
-- This keeps the copies the app reads (President "pres:", Operations "mgmt:") up to date for this week and the 5 weeks before, every
-- 5 minutes, and only rewrites a copy when something in it changed. Google can no longer overwrite them.
-- Undo: select cron.unschedule('coe-weeksum'); (Google's copies are not used again until warmAll is back on.)

create or replace function coe_weeksum_put() returns jsonb language plpgsql security definer set search_path = public as $$
declare mon date := date_trunc('week', (now() at time zone 'Asia/Manila')::date)::date; w date; d jsonb; sc text; k text; n int := 0;
begin
  perform set_config('coe.weeksum_db', '1', true);
  for i in 0..5 loop
    w := mon - 7 * i; d := coe_week_sum(w::text) || jsonb_build_object('db', true);
    foreach sc in array array['pres', 'mgmt'] loop
      k := sc || ':mgmtWeekSum|' || jsonb_build_array(w::text)::text;
      if not exists (select 1 from docs where key = k and data->'week'->'ev' = d->'week'->'ev' and data->'week'->'rem' = d->'week'->'rem' and data ? 'db') then
        insert into docs (key, scope, data, updated_at) values (k, sc, d, now())
          on conflict (key) do update set data = excluded.data, scope = excluded.scope, updated_at = now();
        n := n + 1;
      end if;
    end loop;
  end loop;
  perform set_config('coe.weeksum_db', '', true);
  return jsonb_build_object('updated', n);
end $$;
revoke execute on function coe_weeksum_put() from public, anon, authenticated;

-- Google's copy can no longer replace the database's
create or replace function coe_docs_google_guard() returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.key = 'sys:pkglink' and coalesce(current_setting('coe.pkglink_db', true), '') <> '1'
     and coalesce((select (data->>'pkglinkDb')::boolean from docs where key = 'sys:live'), false) then return null; end if;
  if new.key = 'sys:tmap' and coalesce(current_setting('coe.tmap_db', true), '') <> '1'
     and coalesce((select (data->>'tmapDb')::boolean from docs where key = 'sys:live'), false) then return null; end if;
  if new.key = 'sys:fb' and coe_from_google() and coalesce((select (data->>'fbDocDb')::boolean from docs where key = 'sys:live'), false) then return null; end if;   -- feedback is the database's since 2064
  if new.key ~ '^(pres|mgmt):mgmtWeekSum\|' and coalesce(current_setting('coe.weeksum_db', true), '') <> '1' then return null; end if;   -- 2080: the week summary is the database's
  return new;
end $$;

select cron.schedule('coe-weeksum', '*/5 * * * *', $c$select coe_weeksum_put()$c$);

-- guard 44 also checks the week summary is fresh
create or replace function coe_guard_google_off() returns jsonb language plpgsql security definer set search_path = public as $$
declare g int; pk boolean; tm boolean; ws boolean; tabs text;
begin
  -- 2079: Google's background copies are off (a Google copy writes whole milliseconds; the database writes microseconds)
  select count(*), string_agg(tab, ', ') into g, tabs from sheet_tabs where synced_at > now() - interval '2 hours' and synced_at > '2026-11-11 06:40+00' and extract(microseconds from synced_at)::bigint % 1000 = 0;
  pk := exists (select 1 from docs where key = 'sys:pkglink' and data->>'dbBuilt' = 'true' and updated_at > now() - interval '10 minutes');
  tm := exists (select 1 from docs where key = 'sys:tmap' and data->>'dbBuilt' = 'true' and updated_at > now() - interval '30 minutes');
  -- 2080: last week's summary exists for both President and Operations, made by the database
  ws := (select count(*) from docs where key in ('pres:mgmtWeekSum|' || jsonb_build_array((date_trunc('week', (now() at time zone 'Asia/Manila')::date)::date - 7)::text)::text,
                                                 'mgmt:mgmtWeekSum|' || jsonb_build_array((date_trunc('week', (now() at time zone 'Asia/Manila')::date)::date - 7)::text)::text) and data ? 'db') = 2;
  return jsonb_build_array(jsonb_build_object('check', 'Google is off: no Google copies; package check, teacher map and week summary from the database', 'ok', g = 0 and pk and tm and ws,
    'why', concat_ws(' · ', case when g > 0 then 'Google copied: ' || tabs end, case when not pk then 'package check copy old' end, case when not tm then 'teacher map old' end, case when not ws then 'week summary missing' end)));
end $$;
revoke execute on function coe_guard_google_off() from public, anon, authenticated;

select coe_weeksum_put();

-- 2080b: sbDrain (kept for class videos and sign-in changes) still re-stamps "copied" on frozen tabs without changing any row.
-- The check counts a Google copy only when rows of that tab really changed around that time.
create or replace function coe_guard_google_off() returns jsonb language plpgsql security definer set search_path = public as $$
declare g int; pk boolean; tm boolean; ws boolean; tabs text; mon date := date_trunc('week', (now() at time zone 'Asia/Manila')::date)::date;
begin
  select count(*), string_agg(t.tab, ', ') into g, tabs from sheet_tabs t
   where t.synced_at > now() - interval '2 hours' and t.synced_at > '2026-11-11 06:40+00' and extract(microseconds from t.synced_at)::bigint % 1000 = 0
     and exists (select 1 from sheet_rows r where r.tab = t.tab and r.updated_at between t.synced_at - interval '2 minutes' and t.synced_at + interval '2 minutes');
  pk := exists (select 1 from docs where key = 'sys:pkglink' and data->>'dbBuilt' = 'true' and updated_at > now() - interval '10 minutes');
  tm := exists (select 1 from docs where key = 'sys:tmap' and data->>'dbBuilt' = 'true' and updated_at > now() - interval '30 minutes');
  ws := (select count(*) from docs where key in ('pres:mgmtWeekSum|' || jsonb_build_array((mon - 7)::text)::text, 'mgmt:mgmtWeekSum|' || jsonb_build_array((mon - 7)::text)::text) and data ? 'db') = 2;
  return jsonb_build_array(jsonb_build_object('check', 'Google is off: no Google copies; package check, teacher map and week summary from the database', 'ok', g = 0 and pk and tm and ws,
    'why', concat_ws(' · ', case when g > 0 then 'Google copied: ' || tabs end, case when not pk then 'package check copy old' end, case when not tm then 'teacher map old' end, case when not ws then 'week summary missing' end)));
end $$;
revoke execute on function coe_guard_google_off() from public, anon, authenticated;
