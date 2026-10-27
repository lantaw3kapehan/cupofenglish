-- Rollback: put the old freshness guard back (same anchored replace, reversed).
do $m$ declare d text; n int;
  b text := 'fresh := coalesce((select max(updated_at) from sheet_rows where tab = ''S-MONTHLY'') >= (select max(updated_at) from sheet_rows where tab = ''ACTIVE~''), false);';
  a text := 'fresh := coalesce((select synced_at from sheet_tabs where tab = ''S-MONTHLY'') >= (select synced_at from sheet_tabs where tab = ''ACTIVE~''), false);';
begin
  d := pg_get_functiondef('public.coe_pkg_sync'::regproc);
  select (length(d) - length(replace(d, a, ''))) / length(a) into n; if n <> 1 then raise exception 'fresh anchor %', n; end if;
  execute replace(d, a, b);
end $m$;
