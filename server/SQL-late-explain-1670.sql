-- 1670 · System notice for late check-ins · applied 29 Oct 2026 (migration late_explain_1670) on project rlxkiahqjsabopmuhern.
-- A teacher's one reply (reason + optional proof picture) to a recorded late. Server-only: RLS on, no policies, service_role only.
create table if not exists public.late_explain (
  id bigint generated always as identity primary key,
  teacher text not null,
  late_at text not null,               -- T-TIMEIN column D as saved (Manila local, 'YYYY-MM-DDTHH:MM:SS')
  kind text not null default '',       -- 'Late' (time-in) or 'Late to class'
  reason text not null check (char_length(reason) between 1 and 500),
  img_path text,                       -- storage bucket late-proof (private)
  dev text,
  created_at timestamptz not null default now()
);
create unique index if not exists late_explain_one on public.late_explain (lower(teacher), late_at);
alter table public.late_explain enable row level security;
revoke all on public.late_explain from anon, authenticated, public;
grant all on public.late_explain to service_role;
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('late-proof', 'late-proof', false, 600000, array['image/jpeg','image/png','image/webp'])
on conflict (id) do nothing;

-- ROLLBACK (only if the feature is withdrawn; this deletes the teachers' replies — export them first):
--   drop table if exists public.late_explain;
--   delete from storage.objects where bucket_id = 'late-proof';  delete from storage.buckets where id = 'late-proof';
