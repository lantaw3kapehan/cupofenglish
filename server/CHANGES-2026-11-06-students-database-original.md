# 6 Nov · Students: the database is now the original (switch `sys:live.stuOriginal` = ON, 11:33 Manila)

## What changed
- **Student rows are built from the database records only** (`coe_stu_rows_db`), in the sheet's order; app students not yet in
  the sheet come first. Before: Google's DATABASE copy joined to the records. Check at the switch: 691 of 691 rows identical,
  and the app's copy (DATABASE) changed in 0 rows.
- **The sheet's 5 formula columns are worked out by the database** (`coe_stu_calc`), with the sheet's own formulas:
  - D STUDENT TYPE: ENDED → Unenrolled · FIRST CLASS ≥ 365 days ago → Long-term · ≤ 30 days → New · else Regular · trial date only → Trial
  - E BIRTHDAY STATUS: 🎂 Birthday Today · 🎉 This Week (≤ 7 days) · 🎈 Coming Soon (≤ 30 days)
  - G AGE (as since 5 Nov)
  - P LENGTH: DATEDIF from FIRST CLASS to ENDED (or today) · "#NUM!" when ENDED is before FIRST CLASS (as the sheet)
  - S TOTAL = LESSON + renewals × 15 / 33 / 68
  - 57 rows whose sheet cell has no formula (mostly the newest rows added by the app at the top) keep the value they show
    (`coe_students.keep_cols`), so nothing visible changed.
- **The sheet copy no longer replaces a student record.** Google still sends its DATABASE copy, but `coe_stu_sync` now only
  takes **cells that changed in the sheet** since it was last seen (`coe_students.sheet_seen`), never the formula columns, and
  an app change that is still waiting always wins. Each taken change is logged in `coe_stu_log` ("sheet change taken").
- A student missing from the sheet copy is **kept** (no longer removed); new rows typed in the sheet are still added.
- ST-2025-048 Cindy: the city saved in the app on 25 Oct ("Xilinhot, Inner Mongolia, China") is kept in the database. Google
  could never show it: J270:J271 is a merged cell in the sheet, so the backup writer rewrote it every 2 minutes since 25 Oct.

## Why the sheet copy still runs (and what is left to stop it)
Google's own saves still write some student cells **only into the sheet**, and the copy is how they reach the database:
- Enrolled · paid → FIRST CLASS (Q) and LESSON (R) · Renewed · paid / renewSync24_ → RENEWAL DATE (Y) · source fix (refSave_) → SOURCE (W)
- the Chinese name / birthdate fix (mgmtFix → already also saved in the database) · anything typed by hand in the sheet
Next step: make those saves write the student record in the database first (like packages), then stop dbSnap16_.

## Test (rolled back) before the switch
First run changed 0 records · a changed renewal date in the sheet was taken · a changed LENGTH (formula column) was ignored ·
a city the app was still waiting on stayed the app's value · rows through the switch: 691 identical.

## Undo
`update docs set data = data || '{"stuOriginal": false}' where key = 'sys:live';` → the old way (sheet copy joined to the
records; the next copy overwrites records from the sheet as before). New functions: coe_stu_calc, coe_stu_rows_db,
coe_stu_rows_sheet, coe_stu_live, coe_stu_take_sheet, coe_datedif_txt, coe_ymd, coe_jdate, coe_jnum0.
Migrations: stu_db_original_1106_calc(_types/_fix), stu_db_original_1106_rows, stu_db_original_1106_sync.
