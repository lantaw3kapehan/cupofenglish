-- 2139 (12 Nov 2026, Misty: "yes trim to each student's package"). Weekly series were booked up to 2030 from the old Google Calendar
-- recurrences. Future classes beyond the lessons left in the student's current package (shared packages: one pool) are taken out of
-- `classes` into `coe_classes_trim` (nothing lost). Classes partly covered (0.5 left, 1-lesson class) stay. Students without a known
-- package balance are not touched. When the balance grows again (renewal, incentive, transfer), the job puts the earliest taken-out
-- classes back, as many as the new balance covers, unless that time is now taken (same teacher or same student) or a new weekly schedule
-- (3+ classes booked in the app after it) exists for that student and teacher.
create table if not exists public.coe_classes_trim (
  id text primary key, day date, starts_at timestamptz, ends_at timestamptz, code text, student text, teachers jsonb, cancelled bool,
  data jsonb, updated_at timestamptz, pkg text, t text, trimmed_at timestamptz default now(), restored_at timestamptz, skip text);
alter table public.coe_classes_trim enable row level security;

create or replace function public.coe_cls_groups()
returns table (code text, t text, pkg text, avail numeric)
language sql stable set search_path to 'public' as $f$
  with cur as (
    select distinct on (upper(c.code), lower(trim(c.teacher))) upper(c.code) code, lower(trim(c.teacher)) t, c.avail,
           upper(coalesce(nullif(trim(k.shared),''), k.code)) pkg
    from coe_pkg_calc c join coe_packages k on k.id = c.id where k.removed_at is null
    order by upper(c.code), lower(trim(c.teacher)), c.buy desc nulls last, c.sheet_r desc nulls last)
  select cur.code, cur.t, cur.pkg, g.avail from cur join (select pkg, t, min(avail) avail from cur group by pkg, t) g on g.pkg = cur.pkg and g.t = cur.t
$f$;

-- p_apply false: only counts. true: moves the classes.
create or replace function public.coe_cls_trim(p_apply boolean default false)
returns jsonb language plpgsql security definer set search_path to 'public' as $f$
declare n int := 0; g int := 0;
begin
  create temp table if not exists _trim (id text primary key, pkg text, t text) on commit drop; truncate _trim;
  insert into _trim
  with grp as (select * from coe_cls_groups() where avail is not null),
  fut as (
    select c.id, c.starts_at, upper(c.code) code, lower(trim(c.teachers->>0)) t,
           round(extract(epoch from (c.ends_at - c.starts_at)) / 60.0 / 50.0 * 2) / 2 u
    from classes c
    where c.ends_at > now() and not c.cancelled and c.id not like 'pend-%' and c.code like 'ST-%'
      and regexp_replace(coalesce(c.data->>'title',''), '\s+X$', '', 'i') !~* '-(TC|SC)$'),
  j as (select f.*, g.pkg, g.avail, sum(f.u) over (partition by g.pkg, g.t order by f.starts_at, f.id) cum
        from fut f join grp g on g.code = f.code and g.t = f.t)
  select id, pkg, t from j where cum - u >= greatest(avail, 0);
  select count(*), count(distinct pkg || '|' || t) into n, g from _trim;
  if p_apply then
    insert into coe_classes_trim (id, day, starts_at, ends_at, code, student, teachers, cancelled, data, updated_at, pkg, t)
      select c.id, c.day, c.starts_at, c.ends_at, c.code, c.student, c.teachers, c.cancelled, c.data, c.updated_at, x.pkg, x.t
      from classes c join _trim x on x.id = c.id
    on conflict (id) do update set day = excluded.day, starts_at = excluded.starts_at, ends_at = excluded.ends_at, data = excluded.data,
      pkg = excluded.pkg, t = excluded.t, trimmed_at = now(), restored_at = null, skip = null;
    delete from classes c using _trim x where x.id = c.id;
  end if;
  return jsonb_build_object('classes', n, 'students', g, 'applied', p_apply);
end $f$;

-- puts taken-out classes back when the balance allows (cron every 10 minutes)
create or replace function public.coe_cls_trim_restore()
returns jsonb language plpgsql security definer set search_path to 'public' as $f$
declare r record; room numeric; used numeric; back int := 0; skipped int := 0; why text;
begin
  if not exists (select 1 from coe_classes_trim where restored_at is null and starts_at > now()) then return jsonb_build_object('back', 0); end if;
  for r in
    with grp as (select * from coe_cls_groups() where avail is not null),
    pend as (select distinct x.pkg, x.t from coe_classes_trim x where x.restored_at is null and x.starts_at > now())
    select p.pkg, p.t, max(gg.avail) avail,
      coalesce((select sum(round(extract(epoch from (c.ends_at - c.starts_at)) / 60.0 / 50.0 * 2) / 2) from classes c
         where c.ends_at > now() and not c.cancelled and c.code like 'ST-%' and lower(trim(c.teachers->>0)) = p.t
           and upper(c.code) in (select g2.code from grp g2 where g2.pkg = p.pkg and g2.t = p.t)
           and regexp_replace(coalesce(c.data->>'title',''), '\s+X$', '', 'i') !~* '-(TC|SC)$'), 0) booked
    from pend p join grp gg on gg.pkg = p.pkg and gg.t = p.t group by p.pkg, p.t
  loop
    room := r.avail - r.booked; used := 0;
    if room <= 0 then continue; end if;
    declare x record; u numeric;
    begin
      for x in select * from coe_classes_trim where pkg = r.pkg and t = r.t and restored_at is null and starts_at > now() order by starts_at, id loop
        exit when used >= room;
        u := round(extract(epoch from (x.ends_at - x.starts_at)) / 60.0 / 50.0 * 2) / 2;
        why := null;
        if exists (select 1 from classes c where not c.cancelled and c.starts_at < x.ends_at and c.ends_at > x.starts_at
                     and (lower(trim(c.teachers->>0)) = x.t or upper(c.code) = upper(x.code))) then why := 'time taken';
        elsif (select count(*) from classes c where not c.cancelled and upper(c.code) = upper(x.code) and lower(trim(c.teachers->>0)) = x.t
                     and (c.id like 'app-%' or c.id like 'pend-%') and c.starts_at > x.starts_at
                     and regexp_replace(coalesce(c.data->>'title',''), '\s+X$', '', 'i') !~* '-(TC|SC)$') >= 3 then why := 'new schedule booked';
        end if;
        if why is not null then update coe_classes_trim set skip = why where id = x.id; skipped := skipped + 1; continue; end if;
        insert into classes (id, day, starts_at, ends_at, code, student, teachers, cancelled, data, updated_at)
          values (x.id, x.day, x.starts_at, x.ends_at, x.code, x.student, x.teachers, x.cancelled, x.data, now()) on conflict (id) do nothing;
        update coe_classes_trim set restored_at = now(), skip = null where id = x.id;
        used := used + u; back := back + 1;
      end loop;
    end;
  end loop;
  return jsonb_build_object('back', back, 'skipped', skipped);
end $f$;

revoke execute on function public.coe_cls_groups(), public.coe_cls_trim(boolean), public.coe_cls_trim_restore() from public, anon, authenticated;
