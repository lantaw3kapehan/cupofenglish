-- 2481 · 19 Nov 2026 · coe_dbf_sync_all: rows changed in the last 20 minutes every 5 minutes; every row once an hour (the run at minute 1).
-- Before: every row of 6 tabs every 5 min (mean 12.1 s per run). Rollback: the same function without the `full`/`updated_at` filter (copy below the line).
create or replace function public.coe_dbf_sync_all()
 returns jsonb language plpgsql security definer set search_path to 'public'
as $function$
declare s record; n int := 0; m int := 0; rf int := 0; v_full boolean := extract(minute from now()) < 5;
begin
  if not coe_dbf_on() then return '{"off":true}'; end if;
  for s in select tab, r, data, updated_at from sheet_rows
            where (tab in ('S-NOTE-COMMENTS', 'T-PEER', 'T-AVAIL', 'S-ENQUIRIES', 'TR-DATA', 'TR-PICK')
               or (tab = 'APP LOG' and data->>3 like '% says they no longer teach %'))
              and (v_full or updated_at > now() - interval '20 minutes') loop
    begin perform coe_dbf_sheet_row(s.tab, s.r, s.data, s.updated_at); n := n + 1;
    exception when others then perform coe_dbf_err(null, s.tab || ':' || s.r, 'coe_dbf_sync_all', sqlerrm, null); end;
  end loop;
  begin rf := coe_dbf_rf_sync(); exception when others then perform coe_dbf_err(null, 'REPORT FILES', 'coe_dbf_rf_sync', sqlerrm, null); end;
  begin
    update coe_msgs a set gone = true, updated_at = now()
      from writes w
     where a.src = 'app' and not a.gone and a.wid = w.id and w.status = 'done'
       and w.fn in ('mgmtTaskStatus', 'mgmtShiftClose', 'mgmtTrialReturn')
       and exists (select 1 from coe_msgs g where g.src = 'sheet' and not g.gone and g.from_name = a.from_name and g.to_name = a.to_name and g.parent = a.parent and g.role = a.role
                     and g.at between a.at - interval '15 minutes' and a.at + interval '6 hours'
                     and (g.body = a.body or (a.body like 'End of shift %' and g.body like 'End of shift %'
                          and regexp_replace(g.body, '^End of shift \d\d:\d\d', '') = regexp_replace(a.body, '^End of shift \d\d:\d\d', ''))));
    get diagnostics m = row_count;
  exception when others then perform coe_dbf_err(null, 'coe_msgs', 'coe_dbf_sync_all msgs', sqlerrm, null); end;
  return jsonb_build_object('rows', n, 'reports', rf, 'msgs_hidden', m, 'full', v_full);
end $function$;
