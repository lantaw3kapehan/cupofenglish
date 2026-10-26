-- 26 Oct · progress-check form from the database (read-only), the same shape as Google's tPcForm.
-- p_until: only rows saved up to that moment (used to compare with Google's stored answers); null = now.
create or replace function public.coe_pc_form(p_code text, p_until timestamptz default null)
returns jsonb language sql stable as $$
  with u as (select coalesce(p_until, now()) t, to_char(coalesce(p_until, now()) at time zone 'Asia/Manila', 'YYYY-MM-DD"T"HH24:MI:SS') tl),
  base as (select d.data from public.docs d where d.key ~ ':tPcForm\|' and jsonb_typeof(d.data->'rate') = 'array' order by d.updated_at desc limit 1),
  tr as (select s.r, s.data a from public.sheet_rows s where s.tab = 'TR-DATA' and s.r > 1 and upper(trim(s.data->>33)) = p_code order by s.r limit 1),
  pr as (select s.r, s.data a from public.sheet_rows s, u where s.tab = 'PR-DATA' and s.r > 1 and upper(trim(s.data->>4)) = p_code and coalesce(s.data->>1, '') <= u.tl order by s.data->>1 desc limit 1),
  pw as (select w.created_at, w.who, w.result from public.writes w, u where w.fn = 'tPcSubmit' and w.status not in ('error', 'test') and w.args->>1 = p_code and w.created_at <= u.t
           and w.created_at > coalesce((select max(updated_at) from public.sheet_rows where tab = 'PR-DATA'), '1970-01-01') order by w.created_at desc limit 1),
  nt as (select s.data a, coalesce((select g.data->>5 from public.sheet_rows g where g.tab = 'S-NOTE-TAGS' and g.data->>3 = s.data->>3 and left(g.data->>1, 10) = left(s.data->>1, 10)
             and (coalesce(g.data->>4, '') = '' or coalesce(s.data->>8, '') = '' or g.data->>4 = s.data->>8) order by g.data->>0 desc limit 1), '') kind
         from public.sheet_rows s, u where s.tab = 'S-NOTES' and s.r > 1 and upper(trim(s.data->>3)) = p_code and coalesce(s.data->>0, '') <= u.tl
         order by s.data->>1 desc, s.data->>0 desc limit 12),
  fb as (select e from public.docs d, jsonb_array_elements(coalesce(d.data->p_code, '[]'::jsonb)) with ordinality x(e, i) where d.key = 'sys:fb' order by i limit 2)
  select jsonb_build_object('ok', true, 'db', true,
    'rate', (select data->'rate' from base), 'levels', coalesce((select data->'levels' from base), '["Pre-A1","A1","A2","B1","B2","C1","C2"]'::jsonb),
    'student', jsonb_build_object('code', p_code),
    'trial', (select jsonb_build_object('r', jsonb_build_array(a->6, a->7, a->8, a->9, a->10, a->11, a->12, a->13, a->14), 'spk', a->15, 'lis', a->16, 'rd', a->17, 'total', a->18,
               'cefr', a->>23, 'date', left(a->>2, 10), 'group', coalesce(a->>32, ''), 'label', a->>0, 'teacher', a->>4) from tr),
    'done', coalesce((select jsonb_build_object('at', to_char(created_at at time zone 'Asia/Manila', 'YYYY-MM-DD HH24:MI'), 'cefr', result->>'cefr', 'date', left(result->>'label', 10),
               'label', result->>'label', 'total', (result->>'total')::numeric, 'teacher', who, 'app', true) from pw where result ? 'label'),
             (select jsonb_build_object('at', replace(left(a->>1, 16), 'T', ' '), 'row', r, 'cefr', a->>22, 'date', left(a->>2, 10), 'label', a->>0, 'total', a->19, 'teacher', a->>3) from pr)),
    'notes', coalesce((select jsonb_agg(jsonb_build_object('obs', coalesce(a->>9, ''), 'date', left(a->>1, 10), 'kind', kind, 'ended', coalesce(a->>5, ''), 'skills', coalesce(a->>10, ''), 'teacher', coalesce(a->>2, ''))) from nt), '[]'::jsonb),
    'ended', coalesce((select a->>5 from nt limit 1), ''),
    'fb', coalesce((select jsonb_agg(jsonb_build_object('next', e->>'next', 'areas', e->>'areas', 'month', e->>'month', 'total', case when e->>'total' ~ '^\d+(\.\d+)?$' then (e->>'total')::numeric else null end,
               'teacher', e->>'teacher', 'strengths', e->>'strengths')) from fb), '[]'::jsonb));
$$;
grant execute on function public.coe_pc_form(text, timestamptz) to service_role;
