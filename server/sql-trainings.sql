-- 23 Oct 2026 · Trainings (Addendum No. 1, Clause 3.6): catalogue, parts (video + quiz), sessions, and permanent per-teacher records.
create table if not exists public.coe_trainings (
  id text primary key, title text not null, kind text not null default 'mandatory' check (kind in ('mandatory','selfstudy','unlock')),
  gate text, sort int not null default 100, descr text, units numeric not null default 1, active boolean not null default true,
  updated_at timestamptz not null default now());
create table if not exists public.coe_training_parts (
  id bigserial primary key, training_id text not null references public.coe_trainings(id), sort int not null default 1,
  title text not null, ver int not null default 1, video_path text, dur_sec int not null default 0,
  quiz jsonb not null default '[]', approve boolean not null default false, active boolean not null default true,
  updated_at timestamptz not null default now());
create table if not exists public.coe_training_sessions (
  id bigserial primary key, training_id text not null references public.coe_trainings(id), starts_at timestamptz not null,
  mins int not null default 60, facilitator text, meet_url text, invited text[] not null default '{}', recording_path text,
  note text, status text not null default 'scheduled' check (status in ('scheduled','done','cancelled')),
  created_by text not null, created_at timestamptz not null default now());
create table if not exists public.coe_training_records (
  id bigserial primary key, teacher text not null, training_id text not null references public.coe_trainings(id),
  status text not null check (status in ('done','assigned','excused','pending')), via text not null default 'live'
    check (via in ('live','recording','online','grandfathered','manual','assigned')),
  session_id bigint references public.coe_training_sessions(id), done_at timestamptz, note text,
  by_who text not null, created_at timestamptz not null default now());
create index if not exists coe_training_records_t on public.coe_training_records(teacher, training_id);
create table if not exists public.coe_training_progress (
  teacher text not null, part_id bigint not null references public.coe_training_parts(id), ver int not null,
  seen text not null default '', pct int not null default 0, secs int not null default 0, views int not null default 0,
  first_at timestamptz not null default now(), last_at timestamptz not null default now(), done_at timestamptz,
  reflection text, approved_by text, approved_at timestamptz,
  primary key (teacher, part_id, ver));
create table if not exists public.coe_training_quiz (
  id bigserial primary key, teacher text not null, part_id bigint not null references public.coe_training_parts(id), ver int not null,
  score int not null, total int not null, passed boolean not null, answers jsonb not null default '[]', at timestamptz not null default now());
create index if not exists coe_training_quiz_t on public.coe_training_quiz(teacher, part_id);
alter table public.coe_trainings enable row level security;
alter table public.coe_training_parts enable row level security;
alter table public.coe_training_sessions enable row level security;
alter table public.coe_training_records enable row level security;
alter table public.coe_training_progress enable row level security;
alter table public.coe_training_quiz enable row level security;
grant all on public.coe_trainings, public.coe_training_parts, public.coe_training_sessions, public.coe_training_records,
  public.coe_training_progress, public.coe_training_quiz to service_role;
grant usage, select on all sequences in schema public to service_role;
-- Records are permanent: no deletes; progress only grows; quiz attempts never change.
create or replace function public.coe_train_keep() returns trigger language plpgsql as $$
begin
  if tg_op = 'DELETE' then raise exception 'Training records are permanent.'; end if;
  if tg_table_name = 'coe_training_quiz' then raise exception 'Quiz attempts cannot be changed.'; end if;
  if tg_table_name = 'coe_training_progress' then
    new.pct := greatest(new.pct, old.pct); new.secs := greatest(new.secs, old.secs); new.views := greatest(new.views, old.views);
    new.done_at := coalesce(old.done_at, new.done_at); new.first_at := old.first_at;
  end if;
  return new;
end $$;
drop trigger if exists coe_train_keep_r on public.coe_training_records;
create trigger coe_train_keep_r before delete on public.coe_training_records for each row execute function public.coe_train_keep();
drop trigger if exists coe_train_keep_p on public.coe_training_progress;
create trigger coe_train_keep_p before update or delete on public.coe_training_progress for each row execute function public.coe_train_keep();
drop trigger if exists coe_train_keep_q on public.coe_training_quiz;
create trigger coe_train_keep_q before update or delete on public.coe_training_quiz for each row execute function public.coe_train_keep();

insert into public.coe_trainings(id,title,kind,gate,sort,descr) values
 ('way','CupOfEnglish Way','mandatory','Newly Hired',10,'Your first week: contract, workstation, VooV, the app, homework, courseware, website, CEFR, monthly feedback'),
 ('track','Teacher Essentials (T.R.A.C.K)','mandatory','Starting Teacher',20,null),
 ('ct','Critical Thinking','mandatory','Starting Teacher',21,'4Cs'),
 ('comm','Communication','mandatory','Starting Teacher',22,'4Cs'),
 ('collab','Collaboration','mandatory','Starting Teacher',23,'4Cs'),
 ('creat','Creativity','mandatory','Starting Teacher',24,'4Cs'),
 ('phon','Phonology','mandatory','Newly Qualified',30,null),
 ('gram','Grammar Refresher','mandatory','Newly Qualified',31,null),
 ('prog','Progress checks & parent reports','mandatory','Junior Teacher',40,null),
 ('inq','Inquiry-Based Training','mandatory','Senior Teacher',50,null),
 ('spec','Specialization · IELTS, TOEFL, KET or PET','mandatory','Master Teacher',60,'Practical Macroskills Training'),
 ('facil','Facilitate one training','mandatory','Master Teacher',61,null),
 ('trial','Trial class training','unlock',null,70,'Unlocks trial classes'),
 ('model','Model lessons','selfstudy',null,90,'Free self-study')
on conflict (id) do nothing;
insert into public.coe_training_parts(training_id,sort,title,approve)
select 'way', x.s, x.t, x.a from (values (1,'Your contract',false),(2,'Workstation standard',true),(3,'VooV',false),(4,'The CupOfEnglish app',false),
 (5,'Homework and class notes',false),(6,'Courseware',false),(7,'The website',false),(8,'CEFR, the CupOfEnglish way',true),(9,'Monthly class feedback',true)) x(s,t,a)
where not exists (select 1 from public.coe_training_parts where training_id = 'way');
select 'Trainings ready' as result, (select count(*) from public.coe_trainings) trainings, (select count(*) from public.coe_training_parts) parts;
