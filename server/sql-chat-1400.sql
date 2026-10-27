-- 27 Oct 2026 · 1400 · Team Chat pilot (additive only). Read/written only by the coe-chat edge function (service role); RLS on, no policies.
create table if not exists public.chat_groups (
  id text primary key, name text not null, kind text not null default 'group', sort int not null default 0, created_at timestamptz not null default now());
create table if not exists public.chat_messages (
  id bigserial primary key, gid text not null references public.chat_groups(id), author text not null, author_mgmt boolean not null default false,
  kind text not null default 'text', body text not null default '', img_path text, meta jsonb, mentions text[] not null default '{}',
  needs_reply boolean not null default false, reply_by timestamptz, confirm boolean not null default false, pinned boolean not null default false,
  hidden boolean not null default false, hidden_by text, parent_id bigint, ukey text unique, edited_at timestamptz,
  day date not null default (now() at time zone 'Asia/Manila')::date, created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create index if not exists chat_messages_gid_day on public.chat_messages (gid, day, id);
create index if not exists chat_messages_open on public.chat_messages (gid) where (needs_reply or confirm) and not hidden;
create index if not exists chat_messages_fts on public.chat_messages using gin (to_tsvector('simple', body));
create table if not exists public.chat_reads (
  mid bigint not null references public.chat_messages(id), name text not null, seen_at timestamptz, replied_at timestamptz, confirmed_at timestamptz,
  nudged_at timestamptz, alerted_at timestamptz, primary key (mid, name));
create table if not exists public.chat_outbox (
  id bigserial primary key, to_name text not null, title text not null, body text not null, tag text, release_at timestamptz not null default now(),
  queued_at timestamptz, created_at timestamptz not null default now());
alter table public.chat_groups enable row level security;
alter table public.chat_messages enable row level security;
alter table public.chat_reads enable row level security;
alter table public.chat_outbox enable row level security;
grant select, insert, update on public.chat_groups, public.chat_messages, public.chat_reads, public.chat_outbox to service_role;
grant usage, select on sequence public.chat_messages_id_seq, public.chat_outbox_id_seq to service_role;
insert into public.chat_groups (id, name, kind, sort) values
  ('all', 'All Teachers', 'group', 1), ('timein', 'Time-in', 'group', 2), ('ann', 'Announcements', 'group', 3), ('subs', 'Substitutes', 'group', 4)
on conflict (id) do nothing;
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('chat', 'chat', false, 400000, array['image/jpeg','image/png','image/webp']) on conflict (id) do nothing;
insert into public.docs (key, scope, data, updated_at)
values ('sys:chat', 'mgmt', '{"enabled": true, "pilot": ["Pam", "Kat", "April"]}'::jsonb, now()) on conflict (key) do nothing;

-- phone alerts: hold while the teacher is in class, then hand to the existing push queue (coe-push-drain sends it)
create or replace function public.coe_chat_out() returns int language plpgsql security definer set search_path = public as $$
declare n int := 0;
begin
  -- nudge: tagged / needs-reply, not seen after 10 min → remind the person once; still not seen after 20 min → tell management once
  insert into chat_outbox (to_name, title, body, tag)
  select r.name, 'Reminder · ' || g.name, left(m.author || ': ' || m.body, 140), 'chat-' || m.id
  from chat_reads r join chat_messages m on m.id = r.mid join chat_groups g on g.id = m.gid
  where r.seen_at is null and r.nudged_at is null and not m.hidden and m.created_at < now() - interval '10 minutes' and m.created_at > now() - interval '1 day'
    and (r.name = any(m.mentions) or m.needs_reply);
  update chat_reads r set nudged_at = now() from chat_messages m
  where m.id = r.mid and r.seen_at is null and r.nudged_at is null and not m.hidden and m.created_at < now() - interval '10 minutes' and m.created_at > now() - interval '1 day'
    and (r.name = any(m.mentions) or m.needs_reply);
  insert into chat_outbox (to_name, title, body, tag)
  select m.author, 'Not seen · ' || r.name, left(g.name || ': ' || m.body, 140), 'chat-ns-' || m.id
  from chat_reads r join chat_messages m on m.id = r.mid join chat_groups g on g.id = m.gid
  where r.seen_at is null and r.alerted_at is null and m.author_mgmt and not m.hidden and m.created_at < now() - interval '20 minutes' and m.created_at > now() - interval '1 day'
    and (r.name = any(m.mentions) or m.needs_reply);
  update chat_reads r set alerted_at = now() from chat_messages m
  where m.id = r.mid and r.seen_at is null and r.alerted_at is null and m.author_mgmt and not m.hidden and m.created_at < now() - interval '20 minutes' and m.created_at > now() - interval '1 day'
    and (r.name = any(m.mentions) or m.needs_reply);
  -- quiet during class: release only when the teacher has no class running now
  with due as (
    select o.id from chat_outbox o where o.queued_at is null and o.release_at <= now() and o.created_at > now() - interval '1 day'
      and not exists (select 1 from classes c where not coalesce(c.cancelled, false) and c.starts_at <= now() and c.ends_at > now() and c.teachers ? lower(o.to_name))
    for update skip locked),
  q as (update chat_outbox o set queued_at = now() from due where o.id = due.id returning o.*)
  insert into coe_push_queue (to_name, title, body, url, tag) select to_name, title, body, '/#chat', tag from q;
  get diagnostics n = row_count;
  return n;
end $$;
select cron.schedule('coe-chat-out', '* * * * *', 'select public.coe_chat_out()');

-- ROLLBACK (pilot off without removing anything): update docs set data = jsonb_set(data, '{enabled}', 'false') where key = 'sys:chat';
-- full removal (only if Misty asks): select cron.unschedule('coe-chat-out'); drop function public.coe_chat_out(); drop table chat_outbox, chat_reads, chat_messages, chat_groups;
