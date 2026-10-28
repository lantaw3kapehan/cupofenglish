-- rollback for 1364d: the class card reads coe_class_videos only (definition as of 28 Oct before 1364)
create or replace function public.coe_class_info(p_ev jsonb)
 returns jsonb language sql stable security definer set search_path to 'public' as $function$
with e as (select coalesce(p_ev->>'id','') id, lower(trim(coalesce(p_ev->>'teacher',''))) t,
                  to_char((nullif(p_ev->>'start','')::timestamptz) at time zone 'Asia/Manila', 'YYYY-MM-DD') dy),
lg as (select l.data d, l.ord o from log_rows l, e where l.tab = 'T-TIMEIN' and left(l.data->>0, 10) = e.dy and lower(trim(coalesce(l.data->>1,''))) = e.t),
sh as (select s.data d, s.r from sheet_rows s, e where s.tab = 'T-TIMEIN' and s.r > 1 and left(s.data->>0, 10) = e.dy and lower(trim(coalesce(s.data->>1,''))) = e.t),
ti as (select coalesce(s.d, l.d) d, coalesce(l.o, s.r::bigint) o from lg l full join sh s
    on s.d->>3 = l.d->>3 and coalesce(s.d->>13,'') = coalesce(l.d->>13,'') and coalesce(s.d->>14,'') = coalesce(l.d->>14,'')),
ci as (select d from ti, e where coalesce(d->>13,'') = 'Class' and e.id <> '' and (d->>14) like '% · ' || e.id order by o limit 1),
dy as (select d from ti where coalesce(d->>13,'') = 'Day' order by o limit 1),
v as (select c.url, c.via, c.uploaded_at, c.name from coe_class_videos c, e where c.event_id = e.id and c.day::text = e.dy and c.url is not null order by c.uploaded_at desc nulls last limit 1)
select jsonb_build_object('ok', true, 'ci', (select coe_ti_rec(d) from ci), 'day', (select coe_ti_rec(d) from dy),
  'now', to_char(now() at time zone 'Asia/Manila', 'HH24:MI'),
  'vid', (select jsonb_build_object('url', url, 'name', coalesce(name,''), 'app', via = 'app', 'by', coalesce(via,''),
            'ts', uploaded_at, 'at', to_char(uploaded_at at time zone 'Asia/Manila', 'Mon FMDD HH24:MI')) from v), 'db', true)
$function$;
