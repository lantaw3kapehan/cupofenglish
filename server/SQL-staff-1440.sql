-- 1440 · 28 Oct 2026 · one place to add / edit / deactivate teachers and staff (Misty 11:31 "in Management there should be Add,
-- so when we add, everything reflects"; 11:32 "and that they get access to the app with the info we add").
-- The database keeps the record first; Google (MASTERLIST, PAYROLL name dropdowns, sign-in) follows via the STAFF28 paste.
-- Service role only (RLS on, no policies). Rollback: SQL-staff-1440-ROLLBACK.sql
create table if not exists public.staff (
  id bigserial primary key,
  name text not null,                       -- the app name (MASTERLIST "TEACHER'S NAME"), e.g. Rose
  first_name text, last_name text, cn_name text,
  role text not null default 'teacher' check (role in ('teacher','ops','admin','staff')),
  position text, employment text,
  start_date date,
  status text not null default 'active' check (status in ('active','inactive')),
  email text,
  contact text, sss text, philhealth text, pagibig text, tin text,
  pay_type text not null default 'lesson' check (pay_type in ('lesson','monthly','none')),
  pay_hist jsonb not null default '[]'::jsonb,   -- [{from:'2026-10-01', rate:180}] or [{from:'2026-10-01', monthly:5000}]
  books text, avail text,
  chat boolean not null default true,
  pw_salt text, pw_hash text, pw_set_at timestamptz,   -- a new password for Google to copy; cleared once copied
  sync_pending boolean not null default false,
  google_synced_at timestamptz, google_note text, masterlist_row int,
  src text not null default 'app',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(), updated_by text
);
create unique index if not exists staff_name_uq on public.staff (lower(name));
create unique index if not exists staff_email_uq on public.staff (lower(email)) where email is not null and email <> '';
alter table public.staff enable row level security;
create table if not exists public.staff_log (
  id bigserial primary key, at timestamptz not null default now(), by text, name text, what text, detail jsonb
);
alter table public.staff_log enable row level security;
-- 28 Oct (applied as staff_1440_ml): the person's MASTERLIST row, by column index (same order as the sheet)
alter table public.staff add column if not exists ml jsonb not null default '{}'::jsonb;
-- 1441 (applied as staff_1441_onboarding + staff_1441_grants): checklist ticks, class figures for onboarding / offboarding
alter table public.staff add column if not exists ob jsonb not null default '{}'::jsonb;
create or replace function public.staff_class_stats()
returns table(t text, first_day date, future int, future_students int)
language sql stable security definer set search_path = public as $$
  select lower(teachers->>0), min(day) filter (where starts_at < now()), count(*) filter (where starts_at >= now())::int,
         count(distinct code) filter (where starts_at >= now())::int
  from classes where not cancelled and teachers->>0 is not null group by 1
$$;
revoke all on function public.staff_class_stats() from public, anon, authenticated;
grant select, insert, update, delete on public.staff, public.staff_log to service_role;
grant usage, select on sequence public.staff_id_seq, public.staff_log_id_seq to service_role;
grant execute on function public.staff_class_stats() to service_role;
