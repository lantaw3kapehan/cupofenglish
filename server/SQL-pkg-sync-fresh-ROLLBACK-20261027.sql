-- Rollback: undo steps 3, 2 and 1 – back to the original freshness guard.
do $m$ declare d text;
  orig text := 'fresh := coalesce((select max(updated_at) from sheet_rows where tab = ''S-MONTHLY'') >= (select max(updated_at) from sheet_rows where tab = ''ACTIVE~''), false);';
  v2 text := 'fresh := coalesce((select synced_at from sheet_tabs where tab = ''S-MONTHLY'') >= (select max(updated_at) from sheet_rows where tab = ''ACTIVE~''), false);   -- 27 Oct: S-MONTHLY copied after ACTIVE~ last CHANGED';
  v1 text := 'fresh := coalesce((select synced_at from sheet_tabs where tab = ''S-MONTHLY'') >= (select synced_at from sheet_tabs where tab = ''ACTIVE~''), false);';
  a1 text := E'p.code) pkg\n    from coe_packages p join cc c on c.id = p.id join (';
  b1 text := E'p.code) pkg, (select x.updated_at from sheet_rows x where x.tab = ''ACTIVE~'' and x.r = p.sheet_r) s_at\n    from coe_packages p join cc c on c.id = p.id join (';
  a2 text := E'    sf := rec.s_fin';
  b2 text := E'    fresh := coalesce((select synced_at from sheet_tabs where tab = ''S-MONTHLY'') >= rec.s_at, false);   -- 27 Oct: per row – S-MONTHLY copied after this ACTIVE~ row last changed\n    sf := rec.s_fin';
begin
  d := pg_get_functiondef('public.coe_pkg_sync'::regproc);
  d := replace(replace(d, b1, a1), b2, a2);
  if position(v2 in d) > 0 then d := replace(d, v2, orig); elsif position(v1 in d) > 0 then d := replace(d, v1, orig); end if;
  if position(orig in d) = 0 then raise exception 'rollback anchor'; end if;
  execute d;
end $m$;
