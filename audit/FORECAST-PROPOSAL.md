# Finance › Forecast: proposal for review

Prepared 25 Oct 2026 for Misty. This is a proposal only. Nothing has been built, changed, saved or deployed.
All figures below come from read-only checks of the COE DATABASE mirror (Supabase `sheet_rows`, `classes`,
`coe_wallet`, `coe_packages`, `coe_invoices`, `coe_refunds`), synced between 10:36 and 14:32 PH time today.
They are totals and counts only. No student, parent or teacher details are included.

---

## Plain-English summary (read this first)

**What you have today.** The "expected net" tile on Sales & costs and on Home takes this month's net so far
from the MONEY tab and subtracts one thing: the 11-month average salary bill minus the salaries counted so
far. For October that gives about **₱225,000**. It is a useful first answer, but it is not a forecast.

- It does not count the lessons still on the calendar this month. About 143 lesson units are scheduled from
  26 to 31 Oct, roughly ₱20,000–₱23,000 of extra salary. The tile allows only ₱6,281.
- It assumes no more expenses this month.
- It includes the one-off ₱195,585 university payment. Without it, October's usual business is close to
  break-even: somewhere between −₱6,000 and +₱16,000 once the remaining salaries and usual bills are counted.
- It says nothing about cash. Salaries are paid 5–12 days after month end. Government dues are paid weeks
  later. Money sits in Alipay, WeChat and CCB in yuan before it is remitted to pesos.

**What the data can support.**

| Can be forecast with confidence | Can be estimated, shown as a range | Needs you to enter it |
|---|---|---|
| Rent and other future-dated expenses | Renewals: who runs out of lessons and when, from lessons left and the calendar | Your peso bank balance (it is not recorded anywhere) |
| Salaries already earned (October so far) | New students from trials (about 64% of trials enrol) | Real exchange rate when you remit (SALES always uses ×7) |
| Government dues already entered for Nov and Dec | Next months' salaries, from scheduled lessons | Planned remittances (when and how much) |
| Wallet balances recorded since 21 Oct | Usual monthly bills by category | One-off income or big purchases (bootcamps, university programmes, travel) |
| | | BIR quarterly amounts (the BIR tab stops at Jan 2026) |

**What the data cannot support yet.** It cannot reliably measure how many days after a package runs out the
parent pays. SALES lines carry an invoice number and a first name, not a student code. Only 42% of 2025–26
payments match exactly one student by name. The renewal statuses in the app started this month. So the
first version uses a stated assumption for that timing, labelled as an assumption, and learns from the
renewal statuses from now on.

**Recommendation.** Build in three steps.
1. **Step 1 (about 1 week): a planning worksheet plus the 13-week cash view.** Use only actual and committed
   lines, plus the figures you enter, with no statistical estimate. This alone answers "will we have enough
   pesos for payroll on the 9th?"
2. **Step 2: renewal and new-student estimates.** Show three scenarios (careful, expected, hopeful), each
   labelled with where it comes from.
3. **Step 3: the 6-month business forecast** (sales, costs and net, with the same rules as the MONEY tab).
   Add a weekly snapshot so the screen can explain what changed since last week.

The forecast keeps its own assumptions in a separate store that only you can edit. It never changes balances,
packages, the calendar, payroll or any sheet.

---

## (a) How today's "expected net" works, and its weaknesses

### Where it lives

| Place | Code | What it shows |
|---|---|---|
| Sales & costs › Overview, "The picture" tile | `app.html` `window.renderMoney` (line 18632). The calculation is at lines 18656–18661. The tile is at line 18696, relabelled by `patches/877-money-detail-merge.js` | "Oct · expected net · estimate ≈ ₱…" with "Net so far … − about ₱… in salaries still to pay" |
| Home overview tile and glance line | `app.html` `month()` inside the block at about lines 18935–18955. The tile is at line 18954 | The same figure ("Same figure as Sales & costs › Overview") |
| Finance › Overview (patch 823) | `patches/823-finance-overview-transactions.js` `paintOv()` (lines 121–143) | No expected net. Sales received, costs, net and margin for the month, with "salaries accrued, paid after month end" |
| Source figures | MONEY tab (COE DATABASE), "LAST 12 MONTHS" block | Sales, expenses, salaries, gov dues, total costs and net per month. Defined in MONEY row 3: *PHP = RMB × 7 (as in SALES); costs = EXPENSES + net salaries (PAYROLL) + government dues (GOV); future-dated rows wait until their date* |

### The formula (renderMoney, line 18656 onwards)

```
full     = the months in LAST 12 MONTHS except the current one (11 full months today: Nov 2025 – Sep 2026)
avgW     = average of full[].sal          (net salaries, PAYROLL)
avgG     = average of full[].gov          (GOV dues)
gPaid    = GOV DUES block has a "PAID ON" date for the current month
stillW   = max(0, round(avgW − cur.sal))
stillG   = gPaid ? 0 : max(0, round(avgG − cur.gov))
estNet   = cur.net − (stillW + stillG)
be       = average of full[].costs        ("Break-even · monthly sales target")
one-off  = a partner with ≤ 2 payments whose this-month sales ≥ 25% of the month and equal its year total
```

The home tile's `month()` (line 18936) repeats the same rule in a separate copy.

### Today's values (MONEY updated 25 Oct, 12:05H)

| Item | Value | Status |
|---|---|---|
| Oct sales so far | ₱463,859.50 (23 payments), including a one-off ₱195,584.50 bank transfer | Actual |
| Oct costs so far | ₱232,217.45 = expenses ₱114,049.70 + salaries ₱111,817.75 + gov ₱6,350 | Actual (expenses, gov); salaries accrued to 25 Oct |
| Oct net so far | ₱231,642.05 | Actual / accrued |
| avgW (11 months) | ₱118,099 | Average |
| stillW | ₱6,281. stillG = 0, because Oct GOV is marked paid 15 Oct | Estimate |
| **Expected net** | **≈ ₱225,361** | Estimate |
| Break-even (average costs, 11 months) | ₱257,528 per month | Average |

### Weaknesses

1. **Remaining salaries come from an average, not from the calendar.** The Oct PAYROLL rows ("Pending")
   already hold the PAY tab's "this month so far" estimate, which covers lessons up to today. Subtracting
   that from the 11-month average leaves ₱6,281. But 143 lesson units are still scheduled for 26–31 Oct.
   At September's ₱177 per unit and the usual 80–90% of scheduled lessons actually held, that is about
   ₱20k–₱23k. If an unusually busy month runs above the average, the tile shows ₱0 still to pay even with
   lessons left in the month.
2. **It expects no more expenses this month.** Utilities, IT and food usually keep arriving until month end.
   Oct expenses so far (₱114.0k) equal the 11-month median (₱113.9k) but are below the mean (₱129.1k).
3. **The one-off is included in the headline.** The text flags it, but the ≈ ₱225k figure includes ₱195.6k
   that will not repeat. The "usual" view is near break-even.
4. **It is an accounting figure, not cash.** Salaries are counted in the month they are earned and paid
   5–12 days later. GOV dues are counted by their month and paid 0–60 days later. Sales are counted in PHP
   at ×7, while the yuan may still be in Alipay, WeChat or CCB. "Set that aside" is the only cash hint.
5. **It stops at month end.** There is no view of next month or of the next payroll date.
6. **No CNY view.** Everything is converted at the book rate ×7. The real remittance rate is never used.
7. **BIR quarterly dues are not modelled.** stillG uses the average and is 0 once the month's GOV row has a
   paid date.
8. **There are two copies of the rule** (renderMoney and the home `month()`). Any change must be made in
   both, or the two tiles will disagree. A forecast should be one shared function.
9. **Break-even mixes very different months.** For example, March 2026 had ₱215.6k of expenses. Using the
   median as well would be steadier.

None of these are bugs to fix now. The tile is labelled "estimate" and does what it says. The forecast should
improve on it, and the tile could later read its figure from the forecast (see Step 3).

---

## (b) Data inventory

Reliability: **reliable** = complete and current for this purpose. **partial** = usable with gaps or
caveats. **missing** = not recorded. **manual** = you must enter it.

| # | Input | Source (tab / table) | Freshness | Reliability | Evidence |
|---|---|---|---|---|---|
| 1 | Payments received (sales) | SALES (`sheet_rows` tab SALES, 850 rows); ledger copy `coe_ledger` kind=sale (837 rows) | Synced 25 Oct 14:16; last payment 24 Oct | **reliable** for totals and dates | Jan 2023 – Oct 2026, 16–35 payments per month, none missing by month. MONEY checks list invoice gaps 1683–1688 and 1711, and invoice 1246 used twice |
| 2 | Payment amount in CNY | SALES col G (RMB) | same | **reliable** | Numeric on every row since 2023 except 2 PHP-only bank payments (Jan 2025, Oct 2026) and 1 cash row |
| 3 | PHP amount and the ×7 rule | SALES col H (PHP); MONEY row 3 | same | **reliable as a book rate**; **not** a real exchange rate | Verified: every RMB row equals PHP = RMB × 7 exactly, except 3 rows (2 in Jul–Aug 2024 and 1 cash ₱4,000 with ¥0 in Jun 2026) |
| 4 | Payer channel (partner vs direct) | SALES col E (PARTNERSHIP) | same | **reliable** | Filled on every row. 2025–26: direct ₱3.40M (54%), partner agencies ₱2.47M (39%), one university programme ₱0.42M (7%, 2 payments) |
| 5 | Which wallet received it | SALES col F (PAYMENT METHOD) | same | **partial** | Blank on every row before late May 2026. Since then: Alipay 104, WeChat 21, bank transfer 1, cash 1 |
| 6 | Which student paid (link to student code) | SALES col B "Invoice…_FirstName" only; ACTIVE "ENROLLED LESSONS" formula points at SALES rows | — | **partial / weak** | By English name, only 190 of 457 payments (2025–26) match exactly one student; 219 match several, 48 match none. The ACTIVE formula link exists in the sheet but is not in the mirror |
| 7 | Package size per payment | SALES col C + D (lessons + free) | same | **reliable** | 2025–26: 30-lesson 196, 15-lesson 176, 60-lesson 63, other sizes 23 |
| 8 | Lessons left per package | ACTIVE col AU "TOTAL AVAILABLE"; `coe_packages` | Synced 14:30 | **partial** | 318 ACTIVE rows, 237 student codes. 210 package pools have a number (4,594 lessons left in total). 81 rows are blank (26 of them are shared-package members whose balance is on the shared row) |
| 9 | Shared packages | ACTIVE "Shared Package Code" / "Resolved Package Code"; SHR-PKG | same | **reliable** | 37 shared rows. Grouping by the resolved code avoids counting a shared balance twice |
| 10 | Lesson schedule | `classes` (29,057 rows, 14 Dec 2024 – 26 Dec 2027) | Live | **reliable for the next 13 weeks**; **partial** for history | Future: 178–181 units a week, flat, because recurring series run past package ends. History is complete only from Sep 2026 (Jul 698 rows, Aug 420, Sep 1,298). Oct: 17% of rows cancelled; future months show only about 3% cancelled so far |
| 11 | Lesson unit | `app.html` 14006 "Each lesson 50 min, or two 25-min lessons"; PAYROLL units | — | **reliable** | Check: Sep non-cancelled classes = 624 units; Sep PAYROLL = 630 units; ACTIVE Sep column = 577 |
| 12 | Renewal statuses | `coe_packages.renewal_status` (from the To do flow) | Live | **partial** (new) | Started Oct 2026. Values: Renewed · paid, Renewing, Reminder sent, Not renewing |
| 13 | Trials and enrolments | DATABASE cols K (trial date), Q (first class) | Synced 14:21 | **reliable** | 2026: 146 trials, 93 enrolled (64%), median 4 days from trial to first class. 5 trials booked after today |
| 14 | Enquiries | S-ENQUIRIES (3 rows) | — | **missing** for forecasting | Too few rows |
| 15 | Invoices issued, not yet paid | `coe_invoices` (2 rows) | Live | **reliable** but tiny | Both issued 24 Oct, both paid, both already in SALES |
| 16 | Expenses | EXPENSES (1,044 rows, Dec 2023 – Dec 2026) | Synced 14:32 | **reliable** | MONEY note: costs before Dec 2023 not recorded. Future-dated: rent ₱35,500 + ₱25 charge on 15 Nov and on 15 Dec |
| 17 | Expense category | EXPENSES col C | same | **reliable**; "Miscellaneous" is large | Last 12 months: Rent ₱431k, **Miscellaneous ₱347k** (₱45k in Oct), IT ₱137k, Utilities ₱123k, Food ₱94k |
| 18 | Government dues | GOV (38 rows) | Synced 12:41 | **reliable** for SSS, Pag-IBIG and PhilHealth; **partial** for BIR | Month, components, total and paid date. Nov ₱6,350 and Dec ₱9,870 already entered, not paid |
| 19 | BIR filing calendar | BIR (105 rows) | — | **partial / stale** | Due dates only up to Jan 2026. 14 of 32 rows for 2025–26 have no filed date |
| 20 | Salaries, accrued (by work month) | PAYROLL col Q NET, col C MONTH | Synced 12:36 | **reliable** for past months. The current month is a to-date estimate | Sep 2025 – Sep 2026: ₱80k–₱133k a month. Oct: 17 "Pending" rows, ₱111,818 (lessons to 25 Oct). Nov rows hold −₱3,540 and Dec rows are blank. **Do not read future rows as payroll** |
| 21 | Salaries, cash paid | PAYROLL col A DATE OF PAYMENT; PAY "✔ PAID" | Synced 14:04 | **reliable** | Paid 1st–23rd of the next month, usually 5th–12th. Two older rows still unpaid (Oct 2025, Apr 2026) |
| 22 | 13th-month pay | 13TH MONTH tab (2025 only); EXPENSES "Mandatory Benefit" (Dec 2025, Jan 2026) | — | **partial** | 2025 total about ₱15,881. Not yet set up for 2026 |
| 23 | Wallet balances (CNY) | `coe_wallet` via `coe_wallet_state` (server/coe-wallet.ts) | Live | **partial** (new) | 5 entries, all on 21 Oct: opening checks, one ¥7,200 Alipay→CCB transfer (fee ¥7.19), one voided. The balance also adds Alipay/WeChat sales since the check |
| 24 | Remittances CNY→PHP and real exchange rate | `coe_wallet` kind=remit | — | **missing** | None recorded yet |
| 25 | Peso bank balance / cash on hand | none | — | **missing → manual** | Not in any tab or table |
| 26 | Fees | coe-wallet: ¥50 per remittance (default); transfer fee entered later; EXPENSES "Banking & Payment Charges" | — | **partial** | One transfer fee observed (0.1%) |
| 27 | Refunds | `coe_refunds` (1 row, ¥525); SALES negative row −₱3,675 (Oct 2026) | Live | **reliable** | The same refund appears in both places. Count it once, from SALES |
| 28 | MONEY summary (accounting definitions) | MONEY (89 rows) and `docs` key `pres:mgmtTab|["MONEY"]` | Updated 25 Oct 14:30H | **reliable** | Used as the "actual" source for the monthly forecast, so the figures match Finance › Overview |

---

## (c) Measured behaviour: what supports an estimate and what does not

All figures are aggregates. "Full months" are Nov 2025 – Sep 2026 unless stated.

### Sales level and spread
- Monthly sales over the last 12 full months (Oct 2025 – Sep 2026): **median ₱255k, mean ₱278k,
  lowest ₱178k (Dec 2025), highest ₱392k (Mar 2026)**. Standard deviation ₱65k, or 23% of the mean.
  → The spread is wide enough that scenarios must be ranges, not one line.
- Losing months: **6 of the last 11 full months** (Nov, Dec, Feb, Apr, Jun, Jul) had net below zero. Every
  one had sales under the ₱257.5k break-even. → The forecast's most useful job is "which coming month falls
  under break-even, and by how much".
- One-off payments: 2 PHP-only bank payments (Jan 2025 ₱224.8k; Oct 2026 ₱195.6k). → Keep them out of all
  run-rates. Plan one-offs only as manual lines.

### Package mix and value (2025–26 payments)
| Package | Payments | Share | Average value (book PHP) | Median days to the next payment (same name) |
|---|---|---|---|---|
| 15 lessons | 176 | 40% | ₱6,931 | 105 |
| 30 lessons | 196 | 45% | ₱14,048 | 149 |
| 60 lessons | 63 | 14% | ₱28,633 | 215 |
| Mix-weighted | 435 | — | **≈ ₱13,300** per package | 128 overall (middle half 69–223 days) |

### Repeat purchases (renewal proxy)
These are matched by first name, so they are an **upper bound**: two students with the same name look
like one student renewing.

| Base: purchases in… | Bought again within 180 days | Within 365 days |
|---|---|---|
| Jan 2025 – Mar 2026, direct | 42% | — |
| Jan 2025 – Mar 2026, partner | 55% | — |
| Jan–Sep 2025, direct | — | 69% (15-lesson 76%, 30-lesson 64%, 60-lesson 63%) |
| Jan–Sep 2025, partner | — | 78% (15-lesson 85%, 30-lesson 74%, 60-lesson 57%) |

→ The data **supports** a renewal probability range of roughly 45–75% (direct) and 55–85% (partner),
which is enough for scenarios. October's renewal statuses so far (9 renewed, 3 not renewing) fall inside
this range, but the sample is too small to tighten it.

### Days between running out and paying: **not measurable yet**
- It needs, for each past package, the date its last lesson was taught and the date the next payment arrived
  for the same student code. SALES has no student code (only 42% unique name matches). The class history
  mirror is complete only from Sep 2026.
- → **Unsupported.** Use a stated assumption: careful = 14 days after run-out, expected = in the run-out
  week, hopeful = 7 days before. Mark it "assumption, not measured". From now on, record the run-out date
  next to each "Renewed · paid" status (read-only, from data the app already has) so this can be measured
  after about 8–12 weeks.

### Who runs out in the next 13 weeks (26 Oct 2026 – 24 Jan 2027)
Method: for each package pool (grouped by resolved shared code), take lessons left from ACTIVE and add up
scheduled, non-cancelled class units (minutes ÷ 50) from 26 Oct. The run-out date is the day the running
total reaches lessons left.

| Group | Package pools | Lessons left |
|---|---|---|
| Run out by 22 Nov | 8 | — |
| Run out 23 Nov – 20 Dec | 21 | — |
| Run out 21 Dec – 24 Jan | 26 | — |
| **Run out within 13 weeks (total)** | **55** | **478** |
| Run out in weeks 14–26 | 52 | 1,162 |
| Later | 44 | 1,529 |
| Lessons left but **no class in the next 4 weeks** (paused or dormant) | 46 | 941 |
| More lessons than the calendar holds | 10 | 483 |
| Already used up | 3 | 0 |

Caveat: the calendar is a recurring series. Over the next 13 weeks it shows 178–181 units a week, while
September–October actually held 136–166 a week after cancellations. Cancellations push run-out dates
later. The proposal applies a "lessons actually held" factor (80/85/90%).

→ The data **supports**: about 55 renewal opportunities in 13 weeks. At 55–75% renewal and about ₱13.3k
each, that is roughly **₱0.40M–₱0.55M of renewal collections (estimate)**, in the weeks shown above.

### New students (trial conversion), kept separate
- 2026: 7–25 trials a month (average 14.6), **64% enrol**, median 4 days from trial to first class.
- SALES shows only about 3–8 first-time payers a month (₱21k–₱113k, median about ₱63k). That is fewer than
  DATABASE enrolments (5–17 a month). Likely reasons: partner-paid students, siblings, and name collisions.
  This is an **open question**. Until it is settled, the forecast uses the SALES first-payer value (about
  ₱63k a month expected, ₱35k–₱95k range) and shows the DATABASE-based figure next to it.

### Cross-check: renewals + new against history
Expected collections over 13 weeks (renewals ₱0.40M–₱0.55M + new ₱0.10M–₱0.29M) come to **₱0.50M–₱0.84M**.
The historical 3-month median is about **₱0.77M**. History runs higher because some families renew early,
before running out (for example 60-lesson top-ups), and dormant pools come back. The proposal shows this gap
openly as a line: "Unexplained gap vs. history (not forecast)". It is never added silently.

### Payroll
- Sep 2026 is a worked example. 630 units; lesson pay ₱111,615 (₱177 per unit); base ₱18,650;
  bonuses ₱6,600; deductions −₱7,488; gov −₱5,950; net ₱125,837.
- Oct accrued to 25 Oct: ₱111,818. Remaining scheduled 26–31 Oct: 143 units, or about ₱20k–₱23k.
  → **Oct payroll ≈ ₱132k–₱135k**, to be paid about 5–12 Nov.
- Scheduled units: Nov 774.5, Dec 781, Jan 816. September's held/scheduled ratio suggests about 80% are
  held, so ≈ 620–650 units a month, or ₱118k–₱127k net.
- 13th month: ₱15,881 for 2025, paid Dec–Jan. → Plan ≈ ₱16k by 24 Dec (estimate; confirm 2026 staff).

### Government dues
- GOV totals over the last 12 months: ₱5.96k–₱19.2k a month. Months with BIR spike: Jul 2026 ₱11.5k BIR;
  Oct 2025 ₱9.2k.
- Paid 0–60 days after the month. Feb 2026 paid three months at once.
- Already entered: Nov ₱6,350 and Dec ₱9,870 (Committed amounts, payment date estimated).
- The BIR schedule after Jan 2026 is not in the data. → **Manual.**

### Expenses
- Steady monthly lines: Rent ₱35,500 (37 months, committed through Dec), Utilities about ₱10k,
  IT about ₱12.5k, Food about ₱8.6k.
- Irregular lines: Travel, Training, Bootcamp, Equipment, Repairs, Marketing. Their 12-month total is about
  ₱237k. They are not estimated week by week; they go in as manual items or as a careful-case reserve.
- **Miscellaneous** is ₱347k over 12 months (average ₱26k, Oct ₱45k). It is too large and irregular to
  estimate without knowing what it contains. → Question for you.
- **Double counting:** ₱87k of "Government Contributions" rows in EXPENSES are the same payments as GOV.
  MONEY already excludes them (MONEY row 62). The forecast must do the same.

### Wallets and exchange rate
- Wallet history starts 21 Oct (opening checks: Alipay ¥7,200, later transferred to CCB; WeChat ¥0; CCB ¥0).
  No remittance has been recorded yet, so the **real yuan-to-peso rate is unknown**. SALES's ×7 is a book
  rate. Market rates in 2025–26 have generally been above 7 pesos per yuan, but the data cannot confirm what
  you actually received.
- Prepaid lessons not yet taught: 4,594 lessons, worth about ₱2.1M at the average 30-lesson price
  (estimate, for information). Relevant to refund risk, not part of the cash forecast.

---

## (d) Calculation specification

### Common rules

**Status tags.** Every line and every cell carries exactly one tag.

| Tag | Meaning | Examples |
|---|---|---|
| **Actual** | Already happened and recorded in an operational record | SALES rows dated ≤ today; EXPENSES rows ≤ today; PAYROLL rows with DATE OF PAYMENT; GOV rows with paid date; `coe_wallet` entries (not voided) |
| **Committed** | Recorded in an operational record with a fixed amount, but not yet paid | Future-dated EXPENSES rows (rent 15 Nov / 15 Dec); GOV rows entered but unpaid (Nov ₱6,350, Dec ₱9,870); PAYROLL net for a *finished* month not yet paid; `coe_invoices` issued with no SALES match; a renewal status "Renewing" with a package chosen; `coe_refunds` recorded, not yet paid |
| **Estimated** | Worked out by the forecast from the assumptions | Renewals from run-out dates; new students from trials; remaining salary for the current/future months; usual bills by category; payment-date timing |
| **Manual** | Typed in by you in the forecast store | Peso bank balance, planned remittances and their rate, one-off income, big planned purchases, BIR quarterly, Miscellaneous plan |

**Source and date.** Every Actual or Committed figure shows its source and sync time (e.g. "SALES, synced
25 Oct 14:16"). Every Estimated figure shows its assumption set version (e.g. "Assumptions v3, 25 Oct,
Misty").

**De-duplication rules (all mandatory).**
1. **Sales are counted once, from SALES.** `coe_ledger` kind=sale and `coe_invoices` are used only to find
   *missing* SALES lines. An invoice counts as Committed only if its number does not appear in SALES.
2. **Renewals already paid are excluded from estimates.** A pool with status "Renewed · … paid" or a SALES
   line after its last run-out is Actual, not Estimated. A pool whose student has "Not renewing" gets p = 0.
3. **Shared packages count once.** Group by ACTIVE "Resolved Package Code"
   (`coalesce(resolved, code)`). Lessons left are summed over numeric rows of the pool only. Classes from
   every member code feed the same pool.
4. **Government dues come only from GOV.** Ignore EXPENSES rows with category "Government Contributions"
   (as MONEY does). Ignore the employee shares shown in PAYROLL/PAY "− GOV": they are already inside the GOV
   payment. Salaries are always **net** (PAYROLL col Q), as MONEY does.
5. **EXPENSES "Payroll & Professional Fees"** for months already in PAYROLL are not salaries (MONEY check
   row 86). Keep them as expenses only where MONEY keeps them.
6. **Wallet-to-wallet transfers are internal.** A `transfer` (e.g. Alipay → CCB) moves balance between
   wallets. It is never income or expense. Only its fee is an outflow.
7. **Remittances are conversions, not income.** CNY leaves CCB, and PHP arrives in the peso bank at the
   remittance rate. The ¥50 fee is an outflow. Sales were already counted when received.
8. **Refunds are counted once.** If a `coe_refunds` row has a matching negative SALES row, use SALES only.
9. **Future-dated rows** (EXPENSES, SALES) are Committed until their date, then Actual. This follows the
   MONEY rule "future-dated rows wait until their date".
10. **Accrued vs paid payroll.** The monthly forecast uses accrued salaries by work month (as MONEY does).
    The cash forecast uses the payment date. A month's payroll appears in the cash view only once: Committed
    or Estimated before payment, Actual after.
11. **PAYROLL rows for future months** (Nov −₱3,540, Dec blank) are never read as salary. The forecast
    builds future salaries from the schedule.

**CNY and PHP.**
- Collections are recorded and forecast in **CNY** (SALES RMB). The book PHP (= CNY × 7) is shown beside
  them and used **only** in the monthly accounting forecast, so it matches MONEY and Finance › Overview.
- The cash forecast keeps **two ledgers**: CNY (Alipay, WeChat, CCB) and PHP (peso bank, cash). Pesos come
  into the PHP ledger only through remittance lines, at the **remittance rate assumption** (Manual; default
  7.00 until you enter real remittances). An optional "combined at ₱x per ¥" total is labelled as converted.
- Which wallet a collection lands in: use the PAYMENT METHOD split since 1 Jun 2026 (Alipay about 82%,
  WeChat about 17%, other about 2%). Show this as Estimated.
- PHP-only payments (bank transfer, cash) go straight to the PHP ledger.

**Weeks.** Monday to Sunday, PH time (UTC+8). W1 = 26 Oct – 1 Nov 2026 … W13 = 18 – 24 Jan 2027. The
current week mixes Actual (≤ today) and forecast (> today).

### Scenario parameters (starting values, all editable, all versioned)

| Parameter | Careful | Expected | Hopeful | Basis |
|---|---|---|---|---|
| Renewal probability, direct | 45% | 60% | 70% | 180-day repeat 42%; 365-day 69% (upper bound) |
| Renewal probability, partner | 55% | 70% | 80% | 180-day 55%; 365-day 78% (upper bound) |
| Status "Reminder sent" | as above | as above | as above | — |
| Status "Renewing" (promised) | 80% | 90% | 100% | Assumption |
| Payment timing vs run-out week | +2 weeks | same week | −1 week | **Assumption, not measured** |
| Lessons actually held (of scheduled) | 80% | 85% | 90% | Oct 2026: 17% of calendar rows cancelled; Sep held ≈ payroll units |
| Value per renewal | pool's last package price if linked, else ₱6.9k (15-lesson) | else mix average ₱13.3k | else ₱14.0k (30-lesson) | 2025–26 SALES averages |
| Dormant pools (no class 4 weeks) renewing | 0% | 0% | 10% | Assumption |
| Trials per month | 10 | 14.6 | 20 | 2026 range 7–25 |
| Trial → paid | 50% | 64% | 70% | DATABASE 2026 |
| First package value | ₱7.0k | ₱12.6k | ₱14.0k | SALES first payments |
| Usual bills per category | 75th percentile of 12 months | median | median | EXPENSES |
| Irregular-spend reserve | 12-month average of irregular categories (about ₱20k/month) | 0 (manual items only) | 0 | EXPENSES |
| Payroll pay day | 5th of next month | 9th | 12th | PAYROLL dates of payment (careful = cash leaves earlier) |
| GOV pay day | 10th of next month | 15th | 22nd | GOV paid dates |
| Remittance rate (₱ per ¥) | Manual − 2% | Manual | Manual + 1% | No remittance recorded yet; default 7.00 |
| One-off income | only Committed | only Committed | Committed + Manual "likely" | Never extrapolated |

The careful case moves money out earlier and in later, so it is the one to plan cash against.

### 13-week cash flow: line by line

For each week w, and for each currency ledger:

| # | Line | Formula | Source | Tag |
|---|---|---|---|---|
| C0 | **Opening balance, CNY** per wallet (Alipay, WeChat, CCB) | W1 = `coe_wallet_state` balance (last check + sales since + in − out − remittances − fees). Later weeks = previous closing | `coe_wallet` / coe-wallet `get` | Actual (shows "last checked 21 Oct") |
| C0p | **Opening balance, PHP** (peso bank + cash) | W1 = manual entry with its date. Later weeks = previous closing | forecast store | **Manual** (missing in data) |
| **Inflows (CNY unless marked)** |||||
| I1 | Payments received | Σ SALES.RMB where date ∈ w and ≤ today (PHP-only rows go to the PHP ledger) | SALES | Actual |
| I2 | Committed payments | Σ `coe_invoices.total` (status issued, no SALES match, CNY) + Σ "Renewing" pools × package price × p_promised | `coe_invoices`, `coe_packages` | Committed |
| I3 | **Renewals (estimate)** | For each pool P with numeric lessons left L>0, not renewed, not "Not renewing": run-out date r_P = first day the running total of scheduled units ÷ held-factor ≥ L. Payment week = week(r_P + timing). Amount = p(channel, status) × value(P). Σ over pools whose payment week = w | ACTIVE, `classes`, `coe_packages.renewal_status`, SALES (value) | Estimated |
| I3d | Dormant pools returning | Hopeful only: 10% × value, spread evenly over W1–W13 | ACTIVE + `classes` | Estimated |
| I4 | **New students (estimate)**, separate line | trials_per_week(w) × conversion × first-package value. For weeks with booked trials, use the booked count (DATABASE trial date > today) instead of the average | DATABASE, SALES | Estimated |
| I5 | One-off income | Manual lines only (date, amount, currency, "confirmed / likely") | forecast store | Manual (or Committed if invoiced) |
| I6 | Gap vs history (information only) | (3-month historical median ÷ 13 × weeks) − (I1+I2+I3+I4), shown greyed, **not added** | SALES | — |
| **Conversions** |||||
| X1 | Transfers between wallets | −from / +to, net 0 | `coe_wallet` transfer + Manual planned | Actual / Manual |
| X2 | Remittance out of CCB | −¥ amount | Manual plan or rule "remit when CCB ≥ ¥X on Friday" | Actual / Manual |
| X3 | Remittance into peso bank (PHP) | ¥ amount × remittance rate | same | Actual (with real rate) / Estimated |
| **Outflows (PHP unless marked)** |||||
| O1 | Payroll, month M paid | Finished, unpaid month: Σ PAYROLL net where MONTH = M and no payment date (**Committed**). Current month: accrued to date + remaining scheduled units × held-factor × rate(teacher) + prorated base − usual deductions (**Estimated**). Future month: scheduled units × held-factor × rate + base + usual bonus − usual deductions/gov (**Estimated**). Placed in the week of pay day (scenario) of month M+1 | PAYROLL, PAY, `classes`, T-LOOKUP/TEACHERS rates | Committed / Estimated |
| O1a | Older unpaid payroll rows | Σ PAYROLL net with no payment date, MONTH < last month (today: Oct 2025 and Apr 2026). Shown as a separate line "check: paid or not?" | PAYROLL / PAY checks | Committed (to verify) |
| O2 | 13th-month pay | 2026 amount from the 13TH MONTH method (Manual confirm), in the week of 24 Dec | 13TH MONTH | Estimated → Manual |
| O3 | Government dues | GOV rows with total and no paid date (**Committed** amount), date = scenario GOV pay day. Months not entered: median of the last 3 months (**Estimated**) | GOV | Committed / Estimated |
| O3b | BIR quarterly / annual | Manual (form, period, amount, due date) | forecast store (BIR tab is stale) | Manual |
| O4 | Committed expenses | Future-dated EXPENSES rows in w (excluding "Government Contributions") | EXPENSES | Committed |
| O5 | Usual bills (estimate) | For each steady category (paid in ≥ 9 of the last 12 months: Utilities, IT & Software, Food & Meals, Supplies, Fare, Banking): scenario monthly level, placed on the category's usual day of the month. Rent is never estimated because it is committed | EXPENSES | Estimated |
| O5m | Miscellaneous | Manual monthly plan (default: 0 and flagged "not planned") | forecast store | Manual |
| O6 | Irregular spend | Manual items, plus the careful-case reserve | forecast store | Manual / Estimated |
| O7 | Fees, CNY | ¥50 × remittances planned in w + transfer fee assumption (0.1%) | coe-wallet defaults | Estimated |
| O8 | Refunds | `coe_refunds` recorded, not paid, in their currency | `coe_refunds` | Committed |
| **Closing** |||||
| B1 | Closing balance, CNY, per wallet | C0 + I1..I5 (by wallet split) ± X1 − X2 − O7 − O8(CNY) | — | inherits the weakest tag of its inputs |
| B2 | Closing balance, PHP | C0p + X3 + PHP-only receipts − O1..O6 − O8(PHP) | — | same |
| B3 | Lowest PHP point, and the week it happens | min over w of B2 | — | — |
| B4 | Combined (labelled "converted at ₱x/¥") | B2 + B1 × rate | — | Estimated |

Any closing balance that depends on a Manual opening is shown as "needs your bank balance" until one has been
entered in the last 14 days.

### Monthly business forecast: line by line

Columns: the current month (Oct 2026, part actual), then 5 months ahead (Nov 2026 – Mar 2027). The last 3
full months are shown in grey as actuals for comparison. Definitions are exactly MONEY's.

| # | Line | Formula | Source | Tag |
|---|---|---|---|---|
| M1 | Sales received, book PHP | Σ SALES.PHP for the month (to date = Actual) + (I2 + I3 + I4) × 7 for the rest of the month | MONEY / SALES | Actual + Estimated |
| M1a | of which renewals | I3 × 7 | — | Estimated |
| M1b | of which new students | I4 × 7 | — | Estimated |
| M1c | of which one-off | SALES rows flagged one-off (app rule) + Manual one-offs | — | Actual / Manual |
| M1r | **Usual sales** | M1 − M1c | — | — |
| M2 | Expenses | Actual EXPENSES excluding "Government Contributions" + O4 + O5 + O5m + O6 | MONEY / EXPENSES | mixed |
| M3 | Salaries (net, accrued by work month) | Actual PAYROLL net for past months; current month = accrued + remaining (as O1); future = as O1 | MONEY / PAYROLL | Actual / Estimated |
| M4 | Gov dues | GOV month total (Committed if entered) else 3-month median; + Manual BIR | MONEY / GOV | Committed / Estimated / Manual |
| M5 | Total costs | M2 + M3 + M4 | — | — |
| M6 | **Net** | M1 − M5 | — | — |
| M6r | **Net without one-offs** | M1r − M5 | — | — |
| M7 | Margin | M6 ÷ M1 | — | — |
| M8 | vs break-even | M1r − (median costs of last 12 full months) | MONEY | — |
| M9 | Difference from book rate (information only) | (CNY collections × remittance rate) − (CNY × 7) | — | Estimated |

Reconciliation check, run on every rebuild: for every month that is fully past, M1–M6 must equal MONEY's
LAST 12 MONTHS row to the centavo. If they differ, the screen shows "Forecast does not match MONEY for Sep
2026" and does not show estimates for that column.

### Ranges and explanations

- Every Estimated figure is shown as **expected, with the careful–hopeful range** underneath
  (e.g. "₱512k, range ₱330k–₱616k").
- If an estimate rests on an unmeasured assumption (payment timing, dormant pools, Miscellaneous), it carries
  the label **"assumption, not measured"**. It does not get a range that looks more precise than it is.
- **Explanations of changes:** each rebuild (nightly, plus on demand) stores a snapshot (see g). The screen
  compares it with the snapshot from 7 days earlier and lists the 3–5 biggest differences in plain words:
  - "Week of 9 Nov: payroll is ₱4,200 higher. 23 more lessons were held than expected."
  - "Renewals in December are ₱28,000 lower. 2 families marked 'Not renewing'."
  - "Opening peso balance updated by Misty on 2 Nov."
  - "Rent for 15 Jan added (new future-dated expense)."

  Each difference is split into: actuals arrived, records changed (status, schedule, lessons left),
  assumptions changed, and the calendar moved forward.

---

## (e) Proposed screen: Finance › Forecast

This is a fifth tab after Overview · Payroll · Transactions · Sales & costs. President only (same `isPres()`
gate as Overview and Wallets). It uses the patch 823 / 900 look: `.fx` container, 26px page title, `.fx-k`
KPI strip (11.5px uppercase labels, 22px values), `.fx-card` (14px radius, 15px titles), `.fx-seg`
segmented control, `.fx-tag` pills, tabular numbers. Green is for money in, muted red for money out, amber
for waiting or estimates, grey for manual. The word "Money" is avoided. Tags are always shown in text
(Actual / Committed / Estimate / You entered), never by colour alone.

### Laptop (1280 px)

```
┌──────────────────────────────────────────────────────────────────────────────────────────────┐
│ Finance                                                                    [ Edit plan ]     │
│ Overview   Payroll   Transactions   Sales & costs   Forecast   Wallets                       │
├──────────────────────────────────────────────────────────────────────────────────────────────┤
│ [ 13 weeks cash | 6 months business ]   [ Careful | Expected | Hopeful ]   Built 25 Oct 14:40│
│ Assumptions v3, set 25 Oct by Misty.  Data: SALES 14:16, EXPENSES 14:32, PAYROLL 12:36,      │
│ classes live, wallets checked 21 Oct.  Peso bank balance: entered 25 Oct.                    │
├───────────────────┬───────────────────┬───────────────────┬──────────────────────────────────┤
│ LOWEST PESO POINT │ COMING IN · 13 WK │ GOING OUT · 13 WK │ YUAN WAITING IN WALLETS          │
│ ₱48,200           │ ¥92,400           │ ₱512,900          │ ¥7,193                           │
│ week of 7 Dec,    │ ¥31k actual+commit│ ₱223k committed   │ CCB ¥7,193 · Alipay ¥0 · WeChat ¥0│
│ after Nov payroll │ ¥61k estimate     │ ₱290k estimate    │ last checked 21 Oct              │
│ range ₱12k–₱81k   │ range ¥64k–¥109k  │ range ₱489k–₱540k │                                  │
└───────────────────┴───────────────────┴───────────────────┴──────────────────────────────────┘
┌──────────────────────────────────────────────── 13-week cash ────────────────────────────────┐
│ Peso balance by week (line), yuan received (bars), careful–hopeful band shaded               │
│  ₱│     ●───●                                                                                │
│   │ ●──┘     └──●───●        ●───●───●                                                       │
│   │               └──●──●───┘         └──●──●                                                │
│   └──W1──W2──W3──W4──W5──W6──W7──W8──W9──W10─W11─W12─W13                                     │
│        ▲ payroll 9 Nov       ▲ payroll 9 Dec  ▲ 13th month   ▲ payroll 9 Jan                 │
└──────────────────────────────────────────────────────────────────────────────────────────────┘
┌───────────────────────────────── Week by week ─────────────────────────────── [Export CSV] ──┐
│                        W1 26 Oct  W2 2 Nov  W3 9 Nov  W4 16 Nov  …  W13 18 Jan              │
│ YUAN (CNY)                                                                                   │
│  Opening, all wallets     ¥7,193     ¥…        ¥…        ¥…                                  │
│  Payments received        ¥4,500 A                                                           │
│  Promised / invoiced         —   C                                                           │
│  Renewals (estimate)      ¥1,900 E  ¥3,800 E  ¥5,600 E  …        [8 families ›]              │
│  New students (estimate)  ¥2,100 E  ¥2,100 E  ¥2,100 E  …                                    │
│  One-off (you entered)       —   M                                                           │
│  Remitted to pesos           —   M  −¥20,000 M                                               │
│  Fees                        —      −¥50 E                                                   │
│  Closing                  ¥15,693   ¥…                                                       │
│ PESOS (PHP)                                                                                  │
│  Opening (you entered)    ₱180,000 M                                                         │
│  From remittance @ ₱7.00     —      ₱140,000 M                                               │
│  Payroll · Oct work          —      —        −₱133,500 C+E   (accrued ₱111.8k + ₱21.7k est.) │
│  Government dues             —      —        —        −₱6,350 C                              │
│  Rent (future-dated)         —      —        —        −₱35,525 C                             │
│  Usual bills (estimate)   −₱7,900 E  …                                                       │
│  Miscellaneous (not planned)  ⚠ add a plan                                                   │
│  Closing                  ₱172,100   …                                                       │
│ Each cell: A = Actual  C = Committed  E = Estimate  M = You entered. Tap a cell for its       │
│ source rows and assumption.                                                                  │
└──────────────────────────────────────────────────────────────────────────────────────────────┘
┌──────────────── What changed since 18 Oct ────────────────┐ ┌──────── Assumptions (v3) ───────┐
│ ▲ ₱9,800 more expected in Dec: 3 renewals marked "Renewing"│ │ Renewal, direct      60% (45–70)│
│ ▼ ₱4,200 more payroll in W3: 23 more lessons held          │ │ Renewal, partner     70% (55–80)│
│ ● Peso balance updated by you on 25 Oct                    │ │ Pay timing vs run-out  same week│
│ ● Rent for 15 Dec added (future-dated expense)             │ │   assumption, not measured      │
│ Split: actuals +₱12k · records +₱5k · assumptions 0 ·      │ │ Lessons actually held       85% │
│ week rolled forward −₱3k                                   │ │ Trials/month 14.6 · 64% enrol   │
└────────────────────────────────────────────────────────────┘ │ Remittance rate ₱7.00/¥  ⚠ set  │
                                                               │ Payroll pay day 9th             │
                                                               │ [ Edit plan ]  Version history ›│
                                                               └─────────────────────────────────┘
Sources: SALES, EXPENSES, PAYROLL, GOV, ACTIVE (COE DATABASE) · calendar · wallets · your plan.
The forecast never changes these records.
```
(The figures in the wireframe illustrate layout only. They are not results.)

### "6 months business" view

```
┌──────────────────────────────────────────────────────────────────────────────────────────────┐
│ [ 13 weeks cash | 6 months business ]   [ Careful | Expected | Hopeful ]                     │
├───────────────────┬───────────────────┬───────────────────┬──────────────────────────────────┤
│ OCT · NET (to end)│ NOV · NET         │ MONTHS UNDER      │ BREAK-EVEN                        │
│ ≈ ₱200k estimate  │ ≈ ₱8k estimate    │ BREAK-EVEN        │ ₱257.5k average costs            │
│ without one-off   │ range −₱60k–₱55k  │ 3 of next 6       │ median ₱249.9k                   │
│ ≈ ₱4k             │                   │ (careful case)    │                                  │
└───────────────────┴───────────────────┴───────────────────┴──────────────────────────────────┘
┌───────────── Sales and costs: 3 months actual, current month, 5 months ahead ────────────────┐
│ bars = sales (solid = actual, hatched = estimate), line = total costs, dashed = break-even   │
└──────────────────────────────────────────────────────────────────────────────────────────────┘
┌───────────────────────────────────────── Month by month ─────────────────────────────────────┐
│                 Aug A    Sep A    Oct A+E    Nov E     Dec E     Jan E     Feb E    Mar E    │
│ Sales           267.2k   357.6k   463.9k…    …                                               │
│  renewals                                                                                    │
│  new students                                                                                │
│  one-off                          195.6k A                                                   │
│ Usual sales                                                                                  │
│ Expenses                                                                                     │
│ Salaries (net, earned in month)                                                              │
│ Gov dues                                                                                     │
│ Total costs                                                                                  │
│ Net                                                                                          │
│ Net without one-offs                                                                         │
│ Margin                                                                                       │
│ Past months match the MONEY tab ✓                                                            │
└──────────────────────────────────────────────────────────────────────────────────────────────┘
```
(The Aug, Sep and Oct-to-date figures and the break-even values are real MONEY figures. The Oct and Nov
estimates are rough figures from section (a) and illustrate layout only.)

### Drill-downs (dialogs, same `.fx` style)
- **Renewals in week w:** a table of package codes (student code, never names, on this screen), lessons
  left, run-out date, channel (partner/direct), status, probability and value. It links to the existing
  To do › Renewals due. The renewal list is not repeated on this screen.
- **Payroll estimate:** units held so far, units scheduled, held factor, rate per unit, base, usual bonus
  and deductions. It links to Finance › Payroll.
- **Cell source:** the Actual/Committed rows behind a cell (date, tab, row number, amount), or the
  assumption behind an estimate.

### Phone (390 px)
The KPI strip becomes 2 × 2. The chart stays. The week table becomes one card per week (Opening, In, Out,
Closing, with the biggest line named) and a tap opens the full week. The assumptions panel and "What changed"
are folded sections under the table.

### Edit plan (dialog, President only)
Sections: Opening peso balance (amount + date) · Remittance rate and planned remittances (date, wallet, ¥) ·
One-off income (date, amount, currency, confirmed/likely) · Planned big spends · Miscellaneous monthly plan ·
BIR dues · Scenario parameters (the table in d, with "reset to measured values") · a note "why I changed this".
Every input offers choices where possible (dates from a picker, wallets from a list). The note is required
when a scenario parameter changes. Saving creates a new version. Nothing else is changed.

---

## (f) Manual planning worksheet (Step 1 fallback)

Use this until Steps 2–3 are trusted, or whenever history is not enough. One row per expected movement, in
a forecast-only store (not a sheet tab used by operations). The app pre-fills the Actual and Committed rows,
read-only, and you add the rest.

| Column | Meaning | Example |
|---|---|---|
| Week (Mon) | Week start, PH time | 2026-11-09 |
| Date (if known) | Exact date | 2026-11-09 |
| Direction | In / Out / Transfer / Remittance | Out |
| Line | Payments · Renewal · New student · One-off · Payroll · Gov dues · BIR · Rent · Bills · Misc · Fee · Refund · Other | Payroll |
| Description | Short words, no personal data | October payroll |
| Currency | CNY / PHP | PHP |
| Amount | Positive number. Direction gives the sign | 133,500 |
| From / to account | Alipay, WeChat, CCB, peso bank, cash | Peso bank |
| Rate (₱ per ¥) | Remittance rows only | 7.95 |
| Status | Actual / Committed / Estimate / Manual (pre-filled rows are locked) | Committed |
| Confidence | Sure / Likely / Maybe (Manual and Estimate rows) | Sure |
| Low · High | Optional range | 130,000 · 137,000 |
| Source / reason | Tab and row, or your reason | PAYROLL Oct, accrued to 25 Oct + 26–31 Oct lessons |
| Entered by · on | Who and when | Misty · 25 Oct |

Totals per week: opening, in, out and closing, for CNY and PHP separately, plus "lowest peso week".
An "Export CSV" button gives the same columns.

---

## (g) Where assumptions are stored, and who can edit

**Never in the operational sheets or tables.** The forecast reads SALES, EXPENSES, PAYROLL, PAY, GOV, ACTIVE,
DATABASE, `classes`, `coe_wallet`, `coe_packages`, `coe_invoices` and `coe_refunds`. It writes to none of
them, and it never calls the coe-wallet `add` action or any Apps Script.

Proposed (to be approved before any schema work):

| Store | Purpose | Key columns |
|---|---|---|
| `coe_fc_assump` (new table) | Versioned scenario parameters | `ver` (serial), `set` jsonb (all parameters for 3 scenarios), `note` (required), `by_name`, `created_at`. The newest version is used, and older ones stay for history and "what changed" |
| `coe_fc_items` (new table) | Manual worksheet rows and planned items | `id`, `week`, `day`, `dir`, `line`, `descr`, `currency`, `amount`, `low`, `high`, `account`, `rate`, `confidence`, `scenario` (all / careful / …), `by_name`, `created_at`, `void_at`, `void_by` (undo by voiding, as in `coe_wallet`) |
| `coe_fc_snap` (new table) | Nightly and on-demand result snapshot, for "what changed" and audit | `at`, `ver_assump`, `inputs` jsonb (sync times, counts), `weeks` jsonb, `months` jsonb |
| Edge function `coe-forecast` (new) | `get` (build and return the forecast), `plan` (add/void an item, save a new assumption version). It writes only to the three tables above | Same session check as coe-wallet: `mode = mgmt` and `role = President` |

**Who can edit.** President only. Operations and teachers cannot see the Forecast tab: it shows wallet
balances, which are President-only, and company-wide money figures, like Finance › Overview. If you later
want Operations to enter planned expenses, `plan` could accept `line = Bills/Other` from Operations while
the tab stays hidden, but that is not proposed now.

Row-level security on the new tables: no direct client access, same as `coe_wallet`. Only the edge function
(service role) reads and writes them.

---

## (h) Phased build plan, risks and open questions

### Phase 1: worksheet + 13-week cash with Actual / Committed / Manual only (about 1 week)
- `coe-forecast` `get`: wallets (existing state), future-dated EXPENSES, GOV unpaid rows, PAYROLL unpaid
  finished months, current-month accrued payroll + a simple remainder (scheduled units × 85% × ₱/unit),
  Manual items.
- Forecast tab: 13-week table + KPI strip + Edit plan (opening peso balance, remittances, one-offs, BIR,
  Misc).
- Test: past weeks reproduce SALES/EXPENSES/PAYROLL totals exactly. Preview harness with `?writes=fake`.
- **Value:** "Do we have enough pesos for the next payroll, rent and dues?", with no statistical guesswork.

### Phase 2: estimates and scenarios (about 1–2 weeks)
- Run-out engine (pool by resolved code, scheduled units, held factor), renewal probabilities by channel
  and status, new-student line, usual bills by category, three scenarios, drill-downs.
- Start a read-only "renewal timing" log: for each "Renewed · paid" status, store the pool's computed
  run-out date and the payment date in `coe_fc_snap`. After 8–12 weeks, replace the timing assumption with
  a measured one.
- Per-teacher payroll rates from the teacher rate table instead of the ₱177 average.

### Phase 3: 6-month business forecast + change explanations (about 1 week)
- Monthly lines with the MONEY definitions, the reconciliation check against MONEY, and the nightly
  snapshot with "What changed".
- Optional, with your approval: the existing "expected net" tiles (renderMoney and the Home `month()`) read
  Oct/Nov from the forecast, so all screens show one figure. This changes the tile's calculation, so it is
  listed under questions, not done by default.

### Risks
| Risk | Effect | Mitigation |
|---|---|---|
| SALES has no student code | Renewal values and timing can't be measured per student | Use channel/package averages; ask about adding a code (question 1); start the timing log now |
| Calendar series run past package ends | Run-out and payroll overstated | Held factor; stop counting a pool's classes after its run-out unless it renews (renewal-weighted) |
| ACTIVE blank lessons-left rows (81) | Some pools are missed | Show "pools without a lessons-left number: n" on the screen; never treat blank as 0 |
| Miscellaneous ₱26k/month average, irregular | Cash too high | Manual plan required; careful-case reserve |
| No real exchange rate or peso balance | Cash view meaningless without them | Phase 1 makes them the first two inputs; show "needs your bank balance" otherwise |
| BIR schedule stale | Quarterly dues missed | Manual BIR lines; reminder when a quarter has none |
| False confidence | Plans made on soft numbers | Tags on every cell, ranges, "assumption, not measured" labels, the gap-to-history line |
| Two copies of expected net today | Screens disagree if only one changes | One shared forecast function in Phase 3 |
| Performance | Slow screen | Build server-side in `coe-forecast` and cache the snapshot. The client only paints, like Finance › Overview |

### Open questions for Misty
1. **Student code on payments.** Could each SALES line carry the student code (e.g. in the invoice text or a
   new column)? This is a sheet-structure change, so it needs your decision. Without it, renewal history
   stays approximate. Alternatively, can the ACTIVE "ENROLLED LESSONS" formula links (which already point at
   SALES rows) be exported to the database?
2. **Real exchange rate.** What rate do you usually get when remitting from CCB, and how often do you remit
   (weekly, or when the balance reaches an amount)? Should the cash forecast assume a plan
   ("remit every Friday above ¥X")?
3. **Peso accounts.** Which peso account(s) and cash should the opening balance cover? Is payroll paid from
   one account?
4. **Partner payments.** Do partner agencies pay into the same Alipay/WeChat, and on the same day as the
   student's package? Or in batches (which would change timing)?
5. **New students vs SALES.** DATABASE shows about 9 enrolments a month in 2026, but SALES shows only about
   5 first-time payers. Are some new students paid through partners or siblings' packages, or entered
   differently?
6. **Miscellaneous expenses** (₱347k in 12 months, ₱45k in Oct). What usually goes there, and how much
   should be planned each month?
7. **BIR.** Can you confirm the 2026 quarterly/monthly BIR amounts and due dates? The BIR tab stops at
   Jan 2026, and the GOV row for Oct 2026 has no BIR part.
8. **13th month 2026.** Which staff and what amount, and is it paid in December or January (2025 was split
   Dec/Jan)?
9. **Future PAYROLL rows.** The Nov rows show −₱3,540 (pre-entered deductions?) and the Dec rows are blank.
   Is that expected? The forecast will ignore them for salary.
10. **Unpaid old payroll rows** (Oct 2025 and Apr 2026, one each). Paid or still owed? The forecast shows them
    as "to check".
11. **Scenario starting values.** Are the careful/expected/hopeful renewal rates (direct 45/60/70%, partner
    55/70/80%) right in your experience? Should "Renewing" count as 90%?
12. **One figure everywhere.** In Phase 3, should the "expected net" tiles on Home and Sales & costs switch to
    the forecast's figure (which counts the remaining scheduled lessons and usual bills)? That changes a
    displayed calculation, so it needs your yes.
13. **Who sees the Forecast tab.** President only, as proposed? Or should Operations see a version without
    wallets?

---

*Prepared from read-only SELECT queries on 25 Oct 2026. No files other than this one were written. No
patches, commits, deploys or data writes were made.*
