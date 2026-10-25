-- R1 · 25 Oct · NOT APPLIED — for review. Run in the Supabase SQL editor only after Misty approves (step 2 of the order
-- in SERVER-BIRTHDATE-paste.md).
-- Trigger writes_stuedit (AFTER INSERT ON writes) copies an Edit-student save into the DATABASE copy (sheet_rows) and
-- coe_students.app straight away. Today an empty "birth" writes "" into BIRTHDATE (col F) of the copy.
-- Change: ONE line (marked R1) — the birthdate is skipped when the save says birthKeep, or when it is empty without
-- birthClear. Everything else is exactly the current definition (pg_get_functiondef, 25 Oct).
CREATE OR REPLACE FUNCTION public.writes_stuedit()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
declare f jsonb := new.args->1; rw int; d jsonb; k text; col int; x text; v jsonb; appj jsonb := '{}'::jsonb;
  cols jsonb := '{"cn":2,"en":3,"birth":6,"gender":8,"grade":9,"city":10,"trialDate":11,"trialTime":12,"trialBook":13,"trialCefr":14,"trialTeacher":15,"firstClass":17,"lessons":18,"cefrBooks":20,"ended":21,"recommended":22,"source":23,"free":24}';
begin
  if new.fn <> 'saveStudent' or new.mode <> 'mgmt' or jsonb_typeof(f) <> 'object' then return new; end if;
  rw := coalesce(nullif(new.args->>2, '')::int, 0); if rw < 4 or f ? 'linkTrial' then return new; end if;
  select data into d from sheet_rows where tab = 'DATABASE' and r = rw;
  if d is null or d->>0 is distinct from trim(coalesce(f->>'code', '')) then return new; end if;
  for k, col in select key, value::int from jsonb_each_text(cols) loop
    if not f ? k then continue; end if;
    if k = 'birth' and (coalesce(f->>'birthKeep', '') in ('1', 'true') or (trim(coalesce(f->>'birth', '')) = '' and coalesce(f->>'birthClear', '') not in ('1', 'true'))) then continue; end if;   -- R1 25 Oct: keep the stored birthdate unless explicitly removed
    x := trim(coalesce(f->>k, ''));
    if k = 'gender' and x = 'Male' then x := ' Male'; end if;
    v := case when x = '' then '""'::jsonb
              when k in ('lessons', 'free') and x ~ '^\d+(\.\d+)?$' then to_jsonb(x::numeric)
              when k in ('birth', 'trialDate', 'firstClass', 'ended', 'recommended') and x ~ '^\d{4}-\d{2}-\d{2}$' then to_jsonb(x || 'T00:00:00')
              when k = 'trialTime' and x ~ '^\d{1,2}:\d{2}$' then to_jsonb('1899-12-30T' || lpad(split_part(x, ':', 1), 2, '0') || ':' || split_part(x, ':', 2) || ':00')
              else to_jsonb(x) end;
    while jsonb_array_length(d) < col loop d := d || '[""]'::jsonb; end loop;
    if d->(col - 1) is distinct from v then appj := appj || jsonb_build_object((col - 1)::text, v); end if;
    d := jsonb_set(d, array[(col - 1)::text], v);
  end loop;
  while jsonb_array_length(d) > 0 and d->(jsonb_array_length(d) - 1) = '""'::jsonb loop d := d - (jsonb_array_length(d) - 1); end loop;
  update sheet_rows set data = d where tab = 'DATABASE' and r = rw;
  update sheet_tabs set synced_at = now() where tab = 'DATABASE';
  if appj <> '{}'::jsonb then
    update coe_students set app = app || appj, app_at = now(), app_wid = new.id, updated_at = now() where removed_at is null and sheet_r = rw and code = d->>0;
  end if;
  return new;
exception when others then return new;
end $function$;
