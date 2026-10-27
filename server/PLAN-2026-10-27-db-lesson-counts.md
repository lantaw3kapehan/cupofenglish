# Plan · 27 Oct 2026 · the database counts lessons itself (shadow first)

Misty, 17:11: "it should be like this, since we are now sharing information with parents and partners."

## Where it stands (17:2x)
- All additive, applied in small migrations, nothing user-facing reads them:
  - `coe_lc_days`
  - `coe_lc_mon`: from October, calendar only
  - `coe_lc_calc3`: the corrected count, with no sheet calibration
  - `coe_lc_check_run()`, which writes `docs sys:lessoncheck`
  - cron `coe-lc-check` at 04:20 Manila
- The first draft `coe_lc_calc` stays in place and is not used.
- Management, student portal and partner portal are unchanged.

## First check (27 Oct, 218 student packages)
- **105 match** management exactly.
- **69 renewal-split:** the sheet counted lessons from before the renewal date, so the database shows more left. Examples:
  - Gaby 28.5→32
  - Penny 57→63
  - Nini 27→32
  - Freya 46.5→51.5
  - Anna ST-2025-034 and others
- **2 sheet too low** (the database shows fewer left):
  - Amy ST-2024-130: −0.5, October month override
  - Leo ST-2026-101: −6.5. His package starts today (27 Oct), but the October lessons sit on another row. Needs a look.
- **37 unverifiable** (核对中). Renewal months whose DAILY tab is missing or disagrees, or rows that are duplicates or have no start date.
- **29 with calibrations still unexplained** (24 of them change the lessons-left number):
  - 12 packages were bought before 2025. Their pre-2025 lessons exist only as the sheet calibration (`fin_adj`), so that part is real history and must be kept as an opening balance.
  - Duplicate rows: Nico ST-2025-127, Merlin ST-2021-006 and Damon ST-2025-078.
  - Candy ST-2025-097: September from the 10th has 4.5 lessons the sheet doesn't count.
  - Small leftovers: Thea, Vincent, Grace ST-2024-171, Ian, Anna ST-2025-052, Mia ST-2024-148 and Lucian, each −1.5 to −8.

## Design
1. **Taught lessons per day** (`coe_lc_days`)
   - From 1 Oct 2026: the calendar copy (`classes`), with the same rule management already uses (class ended, not cancelled, not -TC/-SC, 25 min = 0.5).
   - Before October: the sheet's DAILY tabs.
2. **Month value per package** (`coe_lc_mon`). Each package covers its start (renewal or enrol) date up to the next package of the same student and teacher.
   - Months entirely inside the package: the sheet's month value (closed months), or the calendar (from October).
   - The renewal month counts only lessons on or after the start date. Lessons before it belong to the previous package; the carry-over is what was left on the renewal day.
   - Before October, the split is trusted only when the DAILY tab agrees with S-MONTHLY, or the sheet already equals the from-start count. Otherwise the month is marked unverified (核对中).
3. **Package totals** (`coe_lc_calc`): months + substitute lessons (TC&SUB) for lessons used. Left = enrolled + carry + gift + returned + incentive + shared rows − used, with the same shared-package and avail_off rules as management.
   - v3 deliberately leaves out `fin_adj` / `avail_adj`. These are "sheet fix kept" calibrations (`coe_pkg_sync`) that make the database equal the sheet.
   - v3 also flags packages with duplicate rows or no start date.

## Findings so far (219 student packages)
- **Gaby:** 5.5 used, 32 left (Sep from 22nd = 2.0, Oct 3.5), as Misty confirmed.
- **The sheet counted lessons before the renewal date** in the renewal month: 71 package rows before October and 7 in October. Examples:
  - Mia ST-2024-148: −2
  - Anna ST-2025-034: −6
  - Gina ST-2025-047: −2.5
  - Lucian ST-2026-072: −2
  - Andrew ST-2026-059: −1
- **The sheet counted too few:**
  - Candy ST-2025-097: September from the 10th has 4.5 lessons, the sheet has 0.
  - April ST-2026-100: September has 3, the sheet has 0.
  - Daisy ST-2021-002 (Virgo): August from the 22nd has 1, the sheet has 0.
- **31 renewal months can't be verified** (DAILY missing or disagreeing); they should show 核对中.
- **Data problems:**
  - Nico ST-2025-127 has duplicate Julia package rows (enrolled 33 and 35, same date).
  - Merlin ST-2021-006 has two Virgo rows, and his June–October lessons (13) are not counted on the 33-lesson row.
  - Amy ST-2024-130 (Julia, October) differs by 0.5 because of a sheet month override.
- **33 package rows carry sheet calibrations** (`fin_adj`, total 480 lessons). The first draft `coe_lc_calc` still adds them; v3 does not. Each one needs explaining before switching.
  - Most are months from the previous package that the sheet still lists on the renewed row (Mia, Anna, Gina, Lucian). Those cancel out once lessons are counted from the start date.

## To switch (after v3 is applied, the check shows 0 unexplained differences, and Misty agrees)
1. Keep `fin_adj` as an opening balance for packages bought before 2025. Resolve the duplicate rows (Nico, Merlin, Damon).
2. Misty runs the sheet correction paste (the student-portal fork); then re-check.
3. Point `coe_pkg_calc` / `coe_pkg_mon` consumers (management ACTIVE rows via `coe_pkg_rows`, student portal, `coe_portal_pkgs` for the partner portal) at `coe_lc_calc` / `coe_lc_mon`. Do it as one migration with a rollback that restores the current definitions.
4. Stop `coe_pkg_sync` writing `fin_adj` / `avail_adj` from the sheet, so the sheet is no longer the source.
5. Run the stability check (management and teacher), then release.

Rollback of the shadow objects: `server/SQL-db-lesson-calc-shadow-ROLLBACK-20261027.sql`.
