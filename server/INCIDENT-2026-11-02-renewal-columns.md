# Jasper's renewal showed 33 + 35 = 68 · and why "fixed" problems kept coming back · 2 Nov 2026

## What Misty saw (18:52–18:57)
Jasper ST-2026-060 renewed 30 + 3 (Payment Confirmation 1757, paid before his 19:00 class). The lessons-left picture first waited
("Numbers don't agree yet"), then showed **33 + 35 carried over = 68 · used 10 · valid until 8 Feb 2027**. Right answer:
**33 + 1 carried = 34 · from 2 Nov · valid until 2 Jul 2027** (34 lessons → 8 months).

## Cause
On 1 Nov the November month column was added to ACTIVE, so every column from SUB CLASS onwards moved one place right.
The main renewal code was made to follow this on 2 Nov morning (ACTK1102, `actK_`), and it wrote Jasper correctly (Google's own
result: "Jasper now has 34 lessons"). But two **older add-ons that run after every renewal** still used the old fixed column numbers:
- `sharedRenew24_` (24 Oct, shared-package renewals) read column 47 as TOTAL AVAILABLE. It is now TOTAL FINISHED (0), so it
  "corrected" carry over to 1 + 34 − 0 = **35**.
- `renewSync24_` (24 Oct, validity date) wrote a deadline formula into column 50, which is now the purchase-date column, so the
  purchase date became 31 Dec 1900 and the old 16 Oct "validity from 8 Jun" formula gave 8 Feb 2027.

A scan of the whole script found **about 15 more places with the same old numbers**: Active tick, auto-untick, Not renewing,
Shares a package with…, Fix this package, refunds, both transfer enrolments, "first class not set yet", the start-date add-on,
two repair tools and the hourly validity tools. That is why problems kept "coming back": each fix covered the one piece that broke
that day, not every piece that used the old layout.

## Fixed (Google script, Version 453, 2 Nov 19:09)
- Jasper's row repaired (`zzFixJasper1102`): carry 1, purchase-date formula restored, standard deadline formula → 34 left,
  from 2 Nov, valid until 2 Jul 2027. App copy checked: 34 / 2 Nov / 2 Jul 2027.
- Every ACTIVE write by number now adds `aK_()` (= how many month columns were added since SUB CLASS was column AS, read from
  the heading once per run): `sharedRenew24_`, `renewSync24_`, `setActiveTick`, `activeTidy_`, `mgmtRenewal`, `setSharedPkg`,
  `mgmtPkgFix`, `mgmtRefund`, transfer from a student, transfer from someone not in DATABASE (names now written as values),
  "first class not set yet", the start-date add-on. 33 edits, each matched exactly once before applying; syntax checked.
- `mgmtFixRenewedRow` / `mgmtUndoRenewalFix` (repair tools) refuse with a clear message until they are updated.
- `zzColTest1102` (read-only): checks that each place lands on the right heading. Result 19:08: K = 1, 8 of 8 OK
  (SUB CLASS AT, TOTAL FINISHED AU, TOTAL AVAILABLE AV, NOTES AW, Purchase AX, Deadline AY, Shared AZ, Resolved BA).
- Damage scan of all ACTIVE rows (Google's copy): no other row with TRUE/FALSE in TOTAL AVAILABLE, 1900 dates, codes in Deadline or
  dates in Shared. (NOTES text on old rows such as "Paused" is Operations' own notes. Evelyn ST-2024-087 shares with herself →
  blank Available, older and unrelated.)

## Same cause, second symptom: partner / parent pages showed 核对中 for almost everyone (21:00)
Portal safety check (sys:portalholds 21:03): 241 held, 1 shown. Two more readers of ACTIVE still used the old positions:
- Google `pkgLink27_` (copies ACTIVE to sys:pkglink every 2 min) read "lessons left" from TOTAL FINISHED → 0 for everyone
  (Jasper 0 instead of 34, Ruyi 0 instead of 68), so the portal's "Google sheet agrees" check failed.
- Database `coe_pkg_check_run` (hourly sys:pkgcheck) matched ACTIVE~ rows by the old purchase-date column → no row matched → "database
  and sheet totals differ" for 201 students.

Fixed:
- Google script Version 454 (21:06): `pkgLink27_` and the other readers (`buildTeacher_`, `mgmtStudents_`, `mgmtActive_`, `slowJobs_`,
  `untickedTaught_`, `mgmtFillCourses`, `mgmtPkgCheck`, `handovers_`: 34 reads on 15 lines) add `aK_()`. zzColTest1102 8/8 OK.
  sys:pkglink 21:07: months 2024-02…2026-11, Jasper 34, Ruyi 68.
- Database `coe_pkg_check_run` now uses `coe_acol()` (header-based, like `coe_pkg_sync`): 324 of 324 rows matched, 250 equal.
- Portal check 21:13: shown 5 → 137 of 207. Ms. Jane 3 of 5 shown; Dr. Spring 59 of 94.
- Still 核对中 (by design): students who had a class today that Google's sheet has not counted yet (S-MONTHLY copy 19:43; differences
  of 0.5–1 lesson, e.g. Jasper 34 vs 33.5 after tonight's class) and 12 older "renewal month" flags. These clear when the sheet catches up.

## Partners (2 Nov 21:15)
- New partner logins get their SALES labels automatically from their sources (trigger `coe_partner_labels_fill` on partner_accounts;
  `coe_partner_labels()` gives Spring 3, Jane 2, Clark "Chengdu - Mr. Clark", Rose "Jinan - Ms. Rose"; labels typed by hand are kept).
- partner_rates added from SALES (confirmed = false, need Misty): Chengdu – Mr. Clark 30 = 1,500 (before 22 Feb 2025), 1,800 (since);
  Jinan – Dr. Rose 15 = 825.
- Instant sales (qa_1102_sales_instant.sql): not applied; the database asked for approval and it was not answered.

## Still to do
- Hourly validity tools (`validFC12_`, `validApply12_`, `validFix12_`, `cl18Kick18`) have done nothing since 1 Nov (they look for
  the formulas one column to the left). Not harmful; to be moved to `aK_()` and re-checked.
- On 1 Dec (next month column) run `zzColTest1102` once; with `aK_()` nothing should move.
- Longer term: ACTIVE month columns should stop pushing the package columns (e.g. keep a fixed number of month columns), so no
  code has to follow them.
