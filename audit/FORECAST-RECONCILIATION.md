# Finance › Forecast: reconciliation of the October figures

Prepared 25 Oct 2026 (afternoon) for Misty, task FC. Read-only SELECT queries on the COE DATABASE mirror (Supabase
`rlxkiahqjsabopmuhern`). Aggregates only: no student, parent or teacher names, no per-person amounts.
This checks two figures in `FORECAST-PROPOSAL.md`:

1. the **remaining payroll for October** ("143 lesson units … about ₱20k–₱23k", "Oct payroll ≈ ₱132k–₱135k"), and
2. the **recurring-business result range** ("without the one-off … between −₱6,000 and +₱16,000").

**Short answer.** The proposal's unit count (143) is right, but its payroll remainder is too low and its result range
cannot be reproduced. Corrected figures (MONEY as of 15:20H):

| Figure | Proposal | Corrected (conservative / expected / optimistic) |
|---|---|---|
| October salaries still to come | ₱20k–₱23k | **₱39,322 / ₱35,176 / ₱24,882** |
| October salaries, whole month (net) | ₱132k–₱135k | **₱151,149 / ₱147,004 / ₱136,710** |
| October recurring result, before any more sales | −₱6k to +₱16k | **−₱17,740 / −₱4,234 / +₱8,672** |
| Same, with the usual late-month sales (estimated, not guaranteed) | not given | **+₱1,029 / +₱26,741 / +₱48,336** |
| October net including the one-off university payment | ≈ ₱225k (existing tile, unchanged) | ₱196,613 / ₱222,325 / ₱243,920 |

The existing "expected net" tile (Home and Sales & costs) is **not changed**. Today it reads ₱231,632 − ₱6,271 ≈
₱225,361 (see section 6).

---

## 1. Sources and update times (PH time, UTC+8)

| Source | Where | Rows | Updated | Used for |
|---|---|---|---|---|
| MONEY tab | `sheet_rows` tab MONEY | 89 | Sheet stamp "Updated Oct 25, 2026 · 14:07H"; row copy 14:53 | Oct sales, expenses, salaries, gov, net |
| MONEY, app copy | `docs` key `pres:mgmtTab|["MONEY"]` (what the app shows) | 1 doc | "Updated … 15:20H" (doc written 15:20:00) | Same figures; **this is the version used below** |
| PAYROLL | `sheet_rows` tab PAYROLL | 698 | last row copied **14:41:03** | Oct accrued net, units, rates, base, bonuses, deductions |
| PAY | `sheet_rows` tab PAY | 48 | sheet stamp "Updated Oct 25, 14:44"; copy 15:12 | Confirms "THIS MONTH SO FAR · October 2026 (estimate — lessons up to today)" |
| Calendar | `classes` | 29,057 | last row copied **15:20:52** | Lessons still scheduled; held-vs-scheduled history |
| SALES | `sheet_rows` tab SALES | 850 | last row copied **24 Oct 15:32:45**; last payment dated 24 Oct | Late-month sales history; the one-off |
| EXPENSES | `sheet_rows` tab EXPENSES | 1,044 | 14:33:01 | Late-month bills history |
| GOV | `sheet_rows` tab GOV (and MONEY's GOV block) | 38 | 10:36:49 | October dues paid 15 Oct |
| Wallets | `coe_wallet` | 5 entries (1 voided) | last entry 21 Oct | Not used in the October result |

**Note on the "13:20" time in the brief:** no source carries 13:20. The proposal quoted MONEY at "12:05H" in one place
and "14:30H" in another. The MONEY figures it used (Oct salaries ₱111,817.75, net ₱231,642.05) are from an earlier copy.
At 14:07H / 15:20H the October salaries are **₱111,827.75** (+₱10, one PAYROLL row changed) and the net **₱231,632.05**.
Every number below uses the 15:20H app copy; the sheet's 14:07H stamp holds the same values.

---

## 2. Remaining October payroll, step by step

### 2.1 What is already accrued (not re-estimated)

PAYROLL rows with MONTH = Oct 2026: **17 rows**, all "Pending", none with a payment date.

| Column | Sum |
|---|---|
| Base salary | ₱11,397.75 (1 row) |
| Units (regular + substitute + trial) | 531.0 + 1.5 + 7.0 = **539.5** |
| Lesson pay | ₱99,950.00 → ₱185.26 per unit |
| Bonuses (INCENTIVES) | ₱4,220.00 (6 rows) |
| Deductions | ₱200.00 (1 row) |
| Gov columns (SSS + Pag-IBIG + PhilHealth + BIR) | ₱5,950.00 |
| Gross | ₱115,567.75 = base + lesson pay + bonuses |
| **Net** | **₱111,827.75** = gross − deductions − ₱3,540 gov shares withheld from teachers |

Net equals MONEY's October "SALARIES" exactly (₱111,827.75), so the accrued part is **already inside MONEY's net so far**.
It is never added again. Only what comes after the PAYROLL copy is estimated.

Where the accrued figure stops: October calendar lessons that are not cancelled and start before the PAYROLL copy
(14:41:03 on 25 Oct) add up to **532.5 units**; PAYROLL has **539.5** (+7.0). In September the same check gives 624
(calendar) vs 630 (PAYROLL). So PAYROLL's "so far" follows the calendar up to the copy time, within about 1%. The cut-off
for "still to come" is therefore **lessons starting after 14:41:03 on 25 Oct**. (The prototype cannot see the PAYROLL copy
time, so it uses the moment the page is opened. Lessons between the copy and that moment are then missed until the next
PAYROLL copy. This gap is listed as a risk.)

### 2.2 Lessons still on the calendar

`classes`, unit = minutes ÷ 50 (one 50-minute lesson or two 25-minute lessons; same unit as PAYROLL):

| Window | Rows | Cancelled rows | Scheduled units | of which cancelled | Not cancelled |
|---|---|---|---|---|---|
| 25 Oct, after 14:41 | 33 | 6 | 19.5 | 3.0 | 16.5 |
| 26–31 Oct | 273 | 17 | 153.0 | 10.0 | **143.0** (= the proposal's 143) |
| **Total** | 306 | 23 | **172.5** | 13.0 | **159.5** |

Checks: no class has two teachers; no duplicate class (same teacher, same start) in 25–31 Oct.

### 2.3 Rate per unit (each teacher's own rate)

Each scheduled class is priced at its teacher's RATE PER LESSON in the October PAYROLL rows (15 rows with a rate):

| Rate | Teachers | Units (not cancelled) | Pay |
|---|---|---|---|
| ₱150 | 1 | 6.5 | ₱975 |
| ₱155 | 1 | 18.0 | ₱2,790 |
| ₱160 | 3 | 22.5 | ₱3,600 |
| ₱180 | 3 | 74.5 | ₱13,410 |
| ₱200 | 3 | 33.5 | ₱6,700 |
| ₱500 | 2 | 4.0 | ₱2,000 |
| no October rate | 1 | 0.5 | — |
| **Total** | | **159.5** (159.0 priced) | **₱29,475** |

Weighted rate = ₱29,475 ÷ 159.0 = **₱185.38 per unit** (the October-to-date average is ₱185.26). The 0.5 unpriced unit
is priced at this average. One ₱500 teacher also has a lower rate for some lessons; using ₱500 for all 4 units could
overstate by at most ₱600.

The proposal used **₱177** (September's average). October's mix is higher.

### 2.4 How many of the scheduled units will be held (cancellation assumption, measured)

Held share = units not cancelled ÷ all scheduled units, per week, from the calendar copy (2,546 rows):

| Week (Mon) | Scheduled | Cancelled | Held | Held share |
|---|---|---|---|---|
| 31 Aug | 162.5 | 21.0 | 141.5 | 87.1% |
| 7 Sep | 182.0 | 28.5 | 153.5 | 84.3% |
| 14 Sep | 177.5 | 36.5 | 141.0 | 79.4% |
| 21 Sep | 179.0 | 29.0 | 150.0 | 83.8% |
| 28 Sep | 187.5 | 44.5 | 143.0 | 76.3% |
| 5 Oct | 187.5 | 51.0 | 136.5 | **72.8%** (lowest) |
| 12 Oct | 188.5 | 22.5 | 166.0 | **88.1%** (highest) |
| 19 Oct | 197.5 | 36.0 | 161.5 | 81.8% |
| **8 weeks** | **1,462.0** | 269.0 | **1,193.0** | **81.6%** |

Whole months: September 624 ÷ 743 = 84.0%; October to the PAYROLL copy 532.5 ÷ 675 = 78.9%.
Future weeks show only 4–5% cancelled so far (26 Oct: 10 of 188 units), because cancellations are recorded close to
the day. So the share is applied to **all** scheduled units (172.5), and capped at the units not yet cancelled (159.5).

Scenario values (salary is a cost, so the **conservative** case assumes **more** lessons are held):

| | Conservative | Expected | Optimistic |
|---|---|---|---|
| Held share | 88.1% (best week) | 81.6% (8-week total) | 72.8% (worst week) |
| Held units = 172.5 × share (≤ 159.5) | 151.91 | 140.76 | 125.58 |
| Lesson pay = units × ₱185.38 | ₱28,160.64 | ₱26,093.89 | ₱23,279.69 |

### 2.5 Base salary and bonuses still to come; deductions

Rule (the prototype uses the same rule): what recent full months reached, minus what October already shows, never below 0.

- **Base.** Monthly base totals, May–Sep: ₱14,040 · ₱13,000 · ₱19,170 · ₱20,178.80 · ₱18,650 (Jul–Sep include a second
  ₱5,000 base row that is not in October yet). October so far: ₱11,397.75.
  Conservative = max − so far = **₱8,781.05**; expected = median (₱18,650) − so far = **₱7,252.25**;
  optimistic = min (₱13,000) − so far = **₱1,602.25**.
  *Check for Misty:* if the ₱5,000 base row does not apply in October, subtract ₱5,000 from the conservative and expected
  figures.
- **Bonuses.** Last two months: ₱6,600 (Sep), ₱5,500 (Aug); October so far ₱4,220.
  Conservative = ₱6,600 − ₱4,220 = **₱2,380**; expected = ₱6,050 − ₱4,220 = **₱1,830**; optimistic = **₱0**.
- **Deductions** are decided case by case (penalties, leave). None are forecast for the rest of the month. September had
  ₱7,488.49, mostly one staff deduction, so the real figure can be lower than shown.
- **Gov shares withheld** (₱3,540 a month) are already in the October rows. They are part of the GOV payment and are not
  counted again.

### 2.6 Result

| | Conservative | Expected | Optimistic |
|---|---|---|---|
| Lesson pay still to come | ₱28,160.64 | ₱26,093.89 | ₱23,279.69 |
| Base still to come | ₱8,781.05 | ₱7,252.25 | ₱1,602.25 |
| Bonuses still to come | ₱2,380.00 | ₱1,830.00 | ₱0.00 |
| **Salaries still to come** | **₱39,321.69** | **₱35,176.14** | **₱24,881.94** |
| + accrued (PAYROLL, = MONEY salaries) | ₱111,827.75 | ₱111,827.75 | ₱111,827.75 |
| **October salaries (net, earned in October)** | **₱151,149.44** | **₱147,003.89** | **₱136,709.69** |
| Paid in cash on | 5 Nov | 9 Nov | 12 Nov |

Cross-check: expected October units = 539.5 + 140.8 = 680 (September 630, August 654.5). October's calendar ran
188–198 units a week against 163–188 in September, so a higher month is plausible.

### 2.7 Why the proposal's ₱20k–₱23k does not reconcile

The proposal computed 143 × ₱177 × 80% = ₱20,249 and 143 × ₱177 × 90% = ₱22,780. Four things are wrong or missing:

| Difference | Effect on the expected case (approximate; the steps interact) |
|---|---|
| Lessons later on 25 Oct after the PAYROLL copy (19.5 scheduled units) left out | about +₱2,900 |
| ₱177 (September) instead of each teacher's October rate (₱185.38 weighted) | about +₱1,200 |
| Held share applied to units already net of cancellations (143 × 85% = 121.6 units, against 153 × 81.6% = 124.8 units for 26–31 Oct) | about +₱600 |
| Base and bonuses still to come left out | +₱9,082 |
| Direction: the proposal called 80% "careful". For a cost, careful means more lessons held | the ends of the range are swapped |
| **Proposal ₱21.5k (midpoint) → corrected ₱35.2k** | **+₱13.7k** |

---

## 3. Recurring-business result range for October, step by step

### 3.1 Starting point (MONEY, 15:20H; all are already Actual)

| Line | Amount |
|---|---|
| Sales so far (23 payments, to 24 Oct) | ₱463,859.50 |
| Expenses so far (EXPENSES without "Government Contributions") | ₱114,049.70 |
| Salaries so far (accrued, §2.1) | ₱111,827.75 |
| Gov dues (GOV, Oct, paid 15 Oct) | ₱6,350.00 |
| Total costs | ₱232,227.45 |
| **Net so far** | **₱231,632.05** |
| − one-off university payment (one bank transfer in pesos, no RMB; the only peso-only payment ≥ ₱50k this year) | −₱195,584.50 |
| **Recurring net so far** | **₱36,047.55** |

The one-off is excluded from the recurring result and from every run-rate. Its partner has 1 payment in 2026.
Possible related costs (for example October's ₱45,000 Miscellaneous) are not taken out, because the data does not link them
→ question for Misty.

### 3.2 What is added, and why nothing is counted twice

| Step | Conservative | Expected | Optimistic | Rule |
|---|---|---|---|---|
| Salaries still to come (§2.6) | −₱39,321.69 | −₱35,176.14 | −₱24,881.94 | Only lessons after the PAYROLL copy; accrued salaries are already in MONEY |
| Bills still to come, 26–31 Oct | −₱14,466.00 | −₱5,105.50 | −₱2,493.50 | See 3.3 |
| Gov dues still to come | ₱0 | ₱0 | ₱0 | October GOV paid 15 Oct (counted once, from GOV; EXPENSES "Government Contributions" ignored, as MONEY does). BIR is not modelled → listed as missing |
| **Result before any more sales** | **−₱17,740.14** | **−₱4,234.09** | **+₱8,672.11** | |
| Sales usually received 26–31 (estimate) | +₱18,768.75 | +₱30,975.00 | +₱39,663.75 | See 3.4. Not guaranteed |
| **Result with usual late-month sales** | **+₱1,028.61** | **+₱26,740.91** | **+₱48,335.86** | |
| + the one-off (back in) | +₱195,584.50 | +₱195,584.50 | +₱195,584.50 | |
| **October net including the one-off** | **₱196,613.11** | **₱222,325.41** | **₱243,920.36** | |

Not counted (on purpose):
- **Payments already received** are inside MONEY's ₱463,859.50. The late-month estimate covers only days after the last
  SALES copy (no SALES rows dated 25 Oct or later exist yet). If a 25 Oct payment arrives in the next copy, the estimate
  should shrink by it.
- **Wallet transfers** (the ¥7,200 Alipay → CCB on 21 Oct) are internal. Only the ¥7.19 charge is a cost, and it is not
  in EXPENSES (it lives in the wallet record). It is too small to matter here.
- **Refunds:** the October refund (−₱3,675) is already a negative SALES row inside the ₱463,859.50. The `coe_refunds` row
  for the same refund is not added again.
- **Shared packages** do not affect this month's result (they matter for renewals, not for October's accounting).
- **Remittance rate:** MONEY counts yuan at ×7. The October result stays at that book rate, so it matches MONEY.

### 3.3 Bills still to come (EXPENSES dated 26th–31st, last 12 full months, Oct 2025 – Sep 2026)

Without "Government Contributions" (as MONEY) and without Rent (rent is paid on the 15th and is entered ahead as a
future-dated row). The 12 values, sorted: ₱1,515 · 1,550 · 2,405 · 2,523 · 3,750 · 4,755 · 5,456 · 9,918.97 · 12,395 ·
20,679.12 · 37,096 · 71,806.46.
- Optimistic = 25th percentile = 2,405 + 0.75 × 118 = **₱2,493.50**
- Expected = median = (4,755 + 5,456) ÷ 2 = **₱5,105.50**
- Conservative = 75th percentile = 12,395 + 0.25 × 8,284.12 = **₱14,466.03**
(Percentiles: linear between the two nearest values, position (n − 1) × p.) The data does not show how many entries are
typed in late with an earlier date. Those would also raise October and are not covered.

### 3.4 Sales usually received 26th–31st (SALES, last 12 full months, without one-offs)

Sorted: ₱0 (Oct 2025) · 15,750 · 16,800 · 19,425 · 23,100 · 27,300 · 34,650 · 36,750 · 38,850 · 42,105 · 55,125 · 55,650.
- Conservative = P25 = 16,800 + 0.75 × 2,625 = **₱18,768.75**
- Expected = median = (27,300 + 34,650) ÷ 2 = **₱30,975.00**
- Optimistic = P75 = 38,850 + 0.25 × 3,255 = **₱39,663.75**

This is "estimated, not guaranteed". It is not a renewal list. Per-family renewal timing still needs the server-side
engine in the proposal.

### 3.5 Why the proposal's −₱6,000 to +₱16,000 does not reconcile

- **+₱16k** can be rebuilt: ₱36,058 − 143 × ₱177 × 80% (₱20,249) = ₱15,809, with no more bills and no more sales. It
  leaves out base, bonuses and the late-25-Oct lessons (§2.7), and it calls the low-salary case "careful".
- **−₱6k** cannot be rebuilt from any combination in the proposal (₱22,780 of salaries plus the 12-month mean of
  late-month bills, ₱14,487, gives −₱1.2k, not −₱6k). It is withdrawn.
- **Corrected:** before more sales, **−₱17.7k to +₱8.7k (expected −₱4.2k)**. With the usual late-month sales,
  **+₱1.0k to +₱48.3k (expected +₱26.7k)**. October's usual business is still "around break-even". It is a small loss
  unless the usual late-month payments arrive.

---

### 3.6 Same numbers from the prototype's engine

`window.fc980.build()` (patch 980) was run in Node with these aggregates as input (test script:
/tmp/claude-0/fc/nt/engine.js). It returns salaries still to come ₱39,333 / ₱35,176 / ₱24,882, late-month sales
₱18,768.75 / ₱30,975 / ₱39,663.75, late-month bills ₱14,466 / ₱5,105.50 / ₱2,493.50 and a recurring result of
+₱1,017 / +₱26,741 / +₱48,336. These match the tables above within ₱12. The difference comes from the prototype's default
held shares, which are rounded to 0.1% (88.1 / 81.6 / 72.8%).

## 4. Other proposal figures checked on the way

| Proposal says | Check | Status |
|---|---|---|
| Nov 774.5, Dec 781, Jan 816 scheduled units | Not-cancelled units; with cancelled: 805.5 / 811.5 / 852.5 | Correct, but the held share must be applied to the totals (805.5 × 81.6% ≈ 657 units for November, range 586–709), not to 774.5 |
| "September's held/scheduled ratio ≈ 80%" | 624 ÷ 743 = 84.0% | Corrected (8-week figure 81.6%) |
| Sep 630 units, lesson pay ₱111,615, ₱177/unit, net ₱125,837 | 615.5 + 1 + 13.5 = 630; ₱111,615; ₱177.17; ₱125,836.51 | Correct |
| avgW ₱118,099; stillW ₱6,281 | avgW = ₱1,299,087 ÷ 11 = ₱118,098.8; stillW now ₱6,271 (salaries +₱10) | Correct at the earlier copy time |
| Expected net ≈ ₱225,361 | ₱231,632.05 − ₱6,271 = ₱225,361 (both moved by ₱10) | Unchanged tile; not touched |
| Nov PAYROLL rows −₱3,540 | They are the ₱3,540 gov shares pre-entered as deductions with no pay yet | Explained; never read as salary |
| One older unpaid PAYROLL row (Oct 2025, Apr 2026) | Shown as "check", not deducted | Unchanged |

## 5. Missing inputs (forecast marked "incomplete" until entered)

Peso bank balance and cash · real remittance rate (no remittance recorded; ×7 is a book rate) · planned remittances ·
BIR quarterly/annual dues for 2026 (BIR tab stops at Jan 2026; Oct GOV has no BIR part) · 13th-month 2026 ·
Miscellaneous plan (₱45k in Oct; 12-month median ₱27k) · whether the ₱5,000 second base row applies in October ·
GOV rows already entered for Nov (₱6,350) and Dec (₱9,870). The server has these, but the app does not load them, so the
prototype estimates them.

## 6. What was not changed

No accounting calculation, sheet, table, formula or record was changed. The "expected net" tiles (renderMoney and the Home
`month()`) still show the 11-month-average rule. The prototype (patch 980) only reads.
