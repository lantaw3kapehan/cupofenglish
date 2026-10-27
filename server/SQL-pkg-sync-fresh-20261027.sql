-- 27 Oct 2026 · coe_pkg_sync freshness guard: compare when the two tabs were last COPIED (sheet_tabs.synced_at), not when a row last
-- changed (sheet_rows.updated_at only moves when a row's content changes, so after any ACTIVE~ edit "fresh" stayed false and no sheet fix
-- was ever applied – Misty's renew27 fix for 36 rows was stuck). One line changed.
do $m$ declare d text; n int;
  a text := 'fresh := coalesce((select max(updated_at) from sheet_rows where tab = ''S-MONTHLY'') >= (select max(updated_at) from sheet_rows where tab = ''ACTIVE~''), false);';
  b text := 'fresh := coalesce((select synced_at from sheet_tabs where tab = ''S-MONTHLY'') >= (select synced_at from sheet_tabs where tab = ''ACTIVE~''), false);';
begin
  d := pg_get_functiondef('public.coe_pkg_sync'::regproc);
  select (length(d) - length(replace(d, a, ''))) / length(a) into n; if n <> 1 then raise exception 'fresh anchor %', n; end if;
  execute replace(d, a, b);
end $m$;
