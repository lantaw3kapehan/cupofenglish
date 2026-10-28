# Renewal rules (every change that touches packages, lessons left, carry-over, renewal pictures or the Lesson Summary follows these)

Written 28 Oct 2026 after Lucy (ST-2024-139). Misty: "We always go back to this same concern every time our students renew."
Release 1540. Tests: `tools/renewal-suite.js` (runs inside `tools/check.js`, so it runs on every release in CI) and `server/TEST-renewals-1540.sql` (database cases, run in a transaction that is always rolled back).

## The rules

1. **A class that ended before the renewal belongs to the old package, even on the same day.** The boundary is the **payment time** (Misty, 29 Oct 03:21), not midnight:
   - **Payment time = the Payment Confirmation's generated time** (`coe_invoices.created_at`, this student, the paid day, not void), kept automatically in `coe_renew_at.at` (`at_src` = 'payment confirmation', `conf_no`). A confirmation issued or voided after the renewal moves it too (trigger on `coe_invoices`).
   - **No confirmation:** the moment the renewal was saved (`writes.created_at` of `mgmtRenewPaid`, also kept as `saved_at`). App health lists these ("Payment time: no Payment Confirmation …"). If only a date is known (a renewal entered by hand in the sheet), that day's classes count by date as before. These renewals are listed in App health when their numbers don't reconcile.
2. **Carry over = what was really left at the renewal**, including lessons already held but not yet counted by the sheet (the S-MONTHLY lag). The database takes those off the recorded carry (`coe_renew_at.early`) while the sheet still holds the recorded value. Once the sheet is corrected, nothing is taken twice.
3. **Lessons now = carried + new (paid + free) + other − used, exactly.**
   - "Other" covers transfer, incentive, birthday gift, returned lessons and adjustments.
   - "Used" means lessons used in the new package, across every teacher's row.
   - A picture or summary that doesn't add up is never drawn.
4. **Free lessons count as lessons:** 30+3 = 33, 60+8 = 68. ENROLLED must equal paid + free.
5. **Shared / sibling and two-teacher packages:** the package is the owner row plus every row without ENROLLED in the same package (same code, or the same SHARED code). Carry on any row counts.
6. **Validity runs from the first class after the renewal:**
   - under 30 lessons → 4 months;
   - 30–59 → 8 months;
   - 60 or more → 12 months.

   The month end is kept: 31 Oct + 8 months = 30 Jun. The app never shows a valid-until it can't back up. If ACTIVE disagrees with the first-class rule, the picture waits and App health says what to change.
7. **Paid date = the day they paid** (the SALES row linked from ACTIVE column J). It is not the package start.
8. **Never guess.** Lessons left / now show 核对中 (checking) when:
   - the inputs are stale (ACTIVE copy older than 20 minutes in the day, or the renewal check older than 25 minutes);
   - a renewal save is still waiting for Google;
   - the numbers don't agree.
9. **Teachers on a renewal picture:** the current teacher(s) only. A teacher with no upcoming class with the student (or a deactivated one) doesn't teach the new package. On the Lesson Summary and student card a previous teacher stays, tagged "(previous)".

## Where each rule lives (one calculation)

| Piece | Where |
|---|---|
| Rules 1–2, 5 (the counting) | Database: `coe_cls_days.hb`, `coe_pkg_calc` (`carry_eff`, pre-renewal lessons), `coe_pkg_mon`, `coe_lc_*`, `coe_pkg_rows()` → the ACTIVE copy every screen and both portals read. `coe_renew_at` + trigger `coe_renew_at_trg` on `writes`. |
| Rules 3, 4, 6, 8, 9 (putting it together, the guard) | App: `window.coeRenew` in `<script id="coe-renew">` (`fromRows`, `split`, `guard`, `validFrom`, `formHold`, `teachers`, `line`). Used by the renewal form, the renewal picture, the lesson-balance picture and the Lesson Summary. Nothing else may compute carry / used / lessons now / valid-until for these screens. |
| Payment time | `coe_renew_payat()` / `coe_renew_payat_apply()`, triggers `coe_renew_at_trg` (renewal saved) and `coe_invoice_payat_trg` (confirmation issued / voided). Release 1542. |
| The daily check | `coe_renew_check()` (cron `coe-renew-check`, every 10 minutes) → `docs 'sys:renewcheck'` → App health and the Overview "App check", plus the app's guard. |
| Google (sheet) | `mgmtRenewPaid` + `renewStart_` (SERVER-RENEWRULE28 paste): records the real leftover, starts the new package with the first class after the renewal, and returns `early`. |
| Student portal | `coe-student` `renew.ts`: the renewal-month guard uses the same boundary (`coe_cls_days.hb`) and ignores future (planned) DAILY days. The partner portal reads `coe_pkg_calc` directly. |

## Before shipping any change in this area

1. `node tools/check.js app.html` must pass: it runs the renewal suite.
2. If the change touches the database counter or the payment time, run `server/TEST-renewals-1540.sql`. It must say `PASS` (19 cases, incl. S7/S8: payment time from the Payment Confirmation, and a void one).
3. Add a case to both suites for any new kind of renewal.
4. Check App health: the renewal check lists every renewed package that doesn't reconcile.
