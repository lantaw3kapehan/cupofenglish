-- Rollback: put the original freshness guard back (from either applied version).
do $m$ declare d text; n int;
  orig text := 'fresh := coalesce((select max(updated_at) from sheet_rows where tab = ''S-MONTHLY'') >= (select max(updated_at) from sheet_rows where tab = ''ACTIVE~''), false);';
  v2 text := 'fresh := coalesce((select synced_at from sheet_tabs where tab = ''S-MONTHLY'') >= (select max(updated_at) from sheet_rows where tab = ''ACTIVE~''), false);   -- 27 Oct: S-MONTHLY copied after ACTIVE~ last CHANGED';
  v1 text := 'fresh := coalesce((select synced_at from sheet_tabs where tab = ''S-MONTHLY'') >= (select synced_at from sheet_tabs where tab = ''ACTIVE~''), false);';
begin
  d := pg_get_functiondef('public.coe_pkg_sync'::regproc);
  if position(v2 in d) > 0 then d := replace(d, v2, orig); elsif position(v1 in d) > 0 then d := replace(d, v1, orig); else raise exception 'no anchor'; end if;
  execute d;
end $m$;
