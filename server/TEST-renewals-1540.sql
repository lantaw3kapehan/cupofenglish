-- Renewal rule · database cases (1540). Run in the Supabase SQL editor (or execute_sql): everything is inside one transaction that
-- always ends in an exception, so nothing is kept. The last line says "RENEWAL DB CASES · PASS n/n" or lists what failed.
-- Rules: server/RULES-renewals.md. App-side cases: tools/renewal-suite.js (every release).
begin;
do $t$
declare d date := ((now() at time zone 'Asia/Manila')::date - 1); ra timestamptz; res text := ''; n int := 0; f int := 0; r record;
begin
  ra := (d::text || ' 22:17:00+08')::timestamptz;   -- the renewal was recorded at 22:17 the day before today (Manila)
  -- packages: S1 Lucy (two teachers, carry recorded 3, 20:30 class ended before the renewal) · S2 class after the renewal ·
  -- S3 sheet renewal (date only: start-day class counts in the new package) · S4 half + full lesson around the renewal ·
  -- S5 carry already corrected in the sheet (nothing taken twice) · S6 60+8 free lessons → 12 months
  insert into coe_packages (code, name, teacher, carry, enrolled, active, buy, sheet_r) values
    ('ST-9999-901', 'T1', 'tA', 3, 33, true, d, 9001), ('ST-9999-901', 'T1', 'tB', null, null, true, d, 9002),
    ('ST-9999-902', 'T2', 'tA', 2.5, 33, true, d, 9003), ('ST-9999-903', 'T3', 'tA', 2, 33, true, d, 9004),
    ('ST-9999-904', 'T4', 'tA', 3, 33, true, d, 9005), ('ST-9999-905', 'T5', 'tA', 2.5, 33, true, d, 9006),
    ('ST-9999-906', 'T6', 'tA', 2, 68, true, d, 9007);
  insert into sheet_rows (tab, r, data, updated_at) values ('ACTIVE~', 9001, '["ST-9999-901", "T1", "", "tA", "", 3]'::jsonb, now());
  insert into coe_renew_at (code, buy, at, paid, left_rec, early, row_r) values
    ('ST-9999-901', d, ra, d, 3, 0.5, 9001), ('ST-9999-902', d, ra, d, 2.5, 0, 9003), ('ST-9999-904', d, ra, d, 3, 0, 9005), ('ST-9999-905', d, ra, d, 3, 0.5, 9006);
  insert into classes (id, day, starts_at, ends_at, code, student, teachers, cancelled, data) select x.id, d, (d::text || ' ' || x.s || '+08')::timestamptz, (d::text || ' ' || x.e || '+08')::timestamptz,
      x.code, 'T', jsonb_build_array(x.t), false, jsonb_build_object('title', x.code || '-T-OD1-' || x.t)
    from (values ('t901', 'ST-9999-901', 'tb', '20:30', '20:55'), ('t902', 'ST-9999-902', 'ta', '23:00', '23:25'), ('t903', 'ST-9999-903', 'ta', '10:00', '10:25'),
                 ('t904a', 'ST-9999-904', 'ta', '09:00', '09:50'), ('t904b', 'ST-9999-904', 'ta', '23:00', '23:25'), ('t905', 'ST-9999-905', 'ta', '20:30', '20:55')) x(id, code, t, s, e);
  for r in select * from (values
      ('S1 Lucy · carry 3 → 2.5', 'ST-9999-901', 'tA', 'carry', 2.5), ('S1 Lucy · new package used 0', 'ST-9999-901', 'tA', 'fin', 0), ('S1 Lucy · Dezza row used 0', 'ST-9999-901', 'tB', 'fin', 0), ('S1 Lucy · now 35.5', 'ST-9999-901', 'tA', 'avail', 35.5),
      ('S2 after the renewal · used 0.5', 'ST-9999-902', 'tA', 'fin', 0.5), ('S2 after · now 35', 'ST-9999-902', 'tA', 'avail', 35),
      ('S3 sheet renewal (date only) · start-day class in the new package', 'ST-9999-903', 'tA', 'fin', 0.5), ('S3 · now 34.5', 'ST-9999-903', 'tA', 'avail', 34.5),
      ('S4 half + full · only the 0.5 after counts', 'ST-9999-904', 'tA', 'fin', 0.5), ('S4 · now 35.5', 'ST-9999-904', 'tA', 'avail', 35.5),
      ('S5 carry corrected in the sheet · not taken twice', 'ST-9999-905', 'tA', 'carry', 2.5), ('S5 · now 35.5', 'ST-9999-905', 'tA', 'avail', 35.5),
      ('S6 60+8 · now 70', 'ST-9999-906', 'tA', 'avail', 70)) c(name, code, t, k, want) loop
    n := n + 1;
    if not exists (select 1 from coe_pkg_calc x where x.code = r.code and x.teacher = r.t and abs(coalesce(case r.k when 'carry' then x.carry_eff when 'fin' then x.fin else x.avail end, -999) - r.want) < 0.001) then
      f := f + 1; res := res || ' | FAIL ' || r.name || ' got ' || coalesce((select (case r.k when 'carry' then x.carry_eff when 'fin' then x.fin else x.avail end)::text from coe_pkg_calc x where x.code = r.code and x.teacher = r.t), 'null'); end if;
  end loop;
  n := n + 1; if not exists (select 1 from coe_pkg_calc x where x.code = 'ST-9999-906' and x.deadline = (d + interval '1 year')::date) then f := f + 1; res := res || ' | FAIL S6 valid until = start + 12 months'; end if;
  n := n + 1; if not exists (select 1 from coe_pkg_rows() x where x.r = 9001 and (x.data->>5)::numeric = 2.5) then f := f + 1; res := res || ' | FAIL S1 the ACTIVE copy shows CARRY OVER 2.5'; end if;
  raise exception 'RENEWAL DB CASES · % %/% %', case when f = 0 then 'PASS' else 'FAILED' end, n - f, n, res;
end $t$;
