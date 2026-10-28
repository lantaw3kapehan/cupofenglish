# QA · Trials and Enquiries · 29 Oct 2026 (releases 1560–1565)

Method: management preview (`tools/preview-build.js`) on synthetic data (`tools/trials-fixture.js` on top of `audit/fx/synth.json`: made-up
names, codes ST-2099-…, clock 24 Oct 2027 13:50 Manila). Saving is off in the preview (every save answers "Not saved"), messages are
copied to a stubbed clipboard, e-mail and Payment Confirmation calls are stubbed in-page. No real account, message or record was used.
Production: read-only SQL on the database copy for the investigation; coe-trials v11 probed with a fake token only.
Laptop 1440 × 900 and phone 390 × 844. Scripted evidence: `tools/regress-trials.js` (20 checks) and two button sweeps (below).

Result key: **Pass** · **Fail** (→ fixed in release N, or open) · **Blocked** (preview cannot do it) · **Not tested**.

## 1 · Trials screen

| Area | Item | Result | Evidence |
|---|---|---|---|
| Header | Trials / Enquiries tabs | Pass | both switch views |
| Search | name / Chinese / code / teacher | Pass (not changed) | list filters; older trials need `mgmtTrialSearch` → Blocked in preview |
| Booked trial classes | list, "moved from", Enrolled chip, tap → student | Pass | Maithiad opens the student card; phone chip wrapped off the edge → **Fixed 1561** |
| Status row | To send · No report yet · Follow up · Being made · Enrolled · Not enrolling · All · Results | Pass | 8 buttons, counts unchanged; one row (was status + source rows) **1561** |
| Status row | Source menu | Pass | Partners / Referrals / CupOfEnglish / Not set filter the list; "Source · all" clears |
| No report yet | Will pattern (moved, reported) | Fail → **Fixed 1560** | sample "Chenia 23→24 Oct" no longer listed; report row "rescheduled from Sat 23 Oct" |
| No report yet | moved ahead (Haochen pattern) | Fail → **Fixed 1560** | "Toma 25→30 Oct" no longer listed |
| No report yet | repeat entries after a report (Eric pattern) | Fail → **Fixed 1560** (kept, flagged) | "Ricco 17 / 18 Oct" amber Check, "another booking has the report (Mon 11 Oct)" |
| No report yet | real missing report | Pass | "Lumi 22 Oct" stays, first in the list |
| Rows | next step line on every open trial | Pass (new 1561) | "Next · Send the report · Operations · 1 day late" etc.; none for enrolled / not now |
| Rows | Next step sheet | Pass (save Blocked) | What / Who / When chips, date, Save; save answers "Not saved" in preview |
| Results | analytics only here | Pass | 45 days / year / all time, tiles, by teacher, CEFR; tiles open their list |
| Phone | rows, chips, no sideways scroll | Pass | 390 px: page width 380, no overflow |
| Stability | open / refresh, laptop + phone | Pass | ≤ 0.02 base vs new (release notes) |

## 2 · Trial sheet (tap a report) · four learners swept button by button

Chenia (adult business, sent), Alin (young learner, ready), Bao (being made), Jeff (not now): 26–30 buttons each, all pressed.

| Button group | Result | Evidence |
|---|---|---|
| Make the report now / Make PDF now | Blocked | preview: "Could not make the report / PDF" (needs Google) |
| Learner type chips | Pass (save Blocked) | change asks to remake; preview refuses save |
| Course plan · Open | Fail → **Fixed 1562** | Chenia opened on Kids & teens; now "Adults · 18+", goal Business. Alin / Bao / Jeff: Kids & teens |
| Price picture · Open | Fail → **Fixed 1562** | Chenia now "Adults · 18+"; kids stay "Kids & teens · 4–17" |
| CEFR picture · Open | Pass | sheet opens |
| Follow-up chips (Following up / Thinking it over / Unreachable / Not now) | Pass (save Blocked) | "Not saved · try again" in preview, state restored |
| Emails | Pass | "… · emails" sheet |
| Enrolled · paid / First package / Renewed · paid | Pass | enrolment / renewal sheets open (Students agent's 1583 review inside) |
| Payment Confirmation (from those sheets) | Fail → **Fixed 1563 / 1565** | issue + email were one button; now Review → Issue → Email; entry card wording + line icon |
| Set class schedule / Class notice / Agreement / Open <name>'s page | Pass | each opens; one sweep run left the page on Class notice / Emails (preview hash navigation), re-run passed |
| Level chips Pre-A1 … C1 | Pass | confirm "Change …'s level from A2 to …" (dismissed) |
| Ask teacher to redo | Pass | redo box opens |

## 3 · Enquiries screen

| Area | Item | Result | Evidence |
|---|---|---|---|
| Summary cards | Logged → list | Fail → **Fixed 1564** | counted 10, opened Open (7); now 10/10 |
| Summary cards | Reached trial → list | Fail → **Fixed 1564** | counted 2, opened Trial booked (1); now 2/2 |
| Summary cards | Enrolled, Not now | Pass | 1/1, 2/2; opened card marked |
| Month chart | bars → Results | Pass | not changed |
| Tabs | To follow up · New · Trial booked · Enrolled · Not now · Open · Results | Pass | counts match lists |
| Rows | days since logged | Fail → **Fixed 1564** | enquiry logged 03:00 showed "-1 DAYS"; now 0; "1 day" / "N days" |
| Rows | link as name (Messenger URL) | Fail → **Fixed 1564** | full URL in bold; now "Messenger · …901234" link, opens in a new tab |
| Rows (China) | Price · CEFR · Agreement · Roadmap · Trial invite · Inquiry form · Note · Link trial · Mark … · Back to new | Pass | 11/11 buttons each for Momo's Mum, Leo (Adults price), Chenia (Change trial) |
| Rows (Philippines) | PH price · PH roadmap | Blocked | `sys:pricing_ph` not in the sample data ("still loading") |
| Rows (Philippines) | Trial invite | Fail → **Fixed 1564** | copied the Chinese invitation; now the English PH invitation |
| Rows (Philippines) | Inquiry form | Fail → **Fixed 1564** | Chinese/English form; now English |
| Rows (Philippines) | CEFR picture | Fixed 1564 | China-only picture hidden on PH rows |
| Rows (Philippines) | Agreement | Pass | English agreement path (1538); title wraps (1564) |
| Market China | 12 card buttons (price, CEFR, roadmap, invite, 2 forms, 2 welcomes, agreement, Alipay, tagged payment, class notice) | Pass | each opens / copies |
| Market Philippines | invite, service agreement | Pass | English invite copied; agreement opens on Philippines |
| Market Philippines | price list, roadmap, UnionBank | Blocked | needs `sys:pricing_ph` |
| + Log enquiry | form, China / PH mode | Not tested (not changed) | covered by 1464 / 1536 QA |
| Phone | rows, buttons | Fail → **Fixed 1564** | 11 full-width buttons per row → compact wrap; no sideways scroll |

## 4 · Payment Confirmation (shared dialog)

| Check | Result | Evidence (regress-trials) |
|---|---|---|
| Button reads "Review Payment Confirmation N" | Pass | 1563 |
| Review shown before anything is issued | Pass | 0 issue calls before Issue |
| Issue writes the confirmation once, sends no e-mail | Pass | issue × 1, mailInvoice × 0 |
| "Email to …" after issuing; sends once, never issues again | Pass | issue still × 1 (offline the PDF library cannot load, so the e-mail stops with "Not emailed: …" there) |
| Void, All payment confirmations, numbering | Not tested (not changed) | |

## 5 · Defects still open / suggestions

1. **Google's "No report yet" looks back only ~2 weeks** (Yona 24 + 27 Sep: two sessions, no report, not listed). The app now has every
   session for 75 days; showing older missing reports is a one-line change — decision for Misty.
2. **TC&SUB holds most trial rows twice** (195 of 426). Harmless now (grouped by event id); worth cleaning in Google later (not done:
   no record changes).
3. Agreement / sheet names come from the enquiry name: an enquiry saved with a link as its name makes an agreement for a link. Suggest
   typing the real name in the enquiry.
4. Phone: the "Booked trial classes" list shrinks when reports load (pre-existing, CLS 0.0195 on refresh, under 0.02).
5. Trial sheet has ~28 buttons; Price / CEFR / Course plan / Agreement are grouped, but the level chips + redo + learner type could fold
   into one "Edit report" section (not done: keep functions as they are).

## 6 · Not tested

- Real saves (follow-up, enquiry status, next step, Payment Confirmation issue / e-mail) against the database — preview only, by rule.
- PH price list / roadmap / UnionBank from Enquiries (no `sys:pricing_ph` in the sample data).
- Teacher screens (unchanged).
- Operations account view of Trials / Enquiries (same code path; not run separately).

## Releases

| Release | Patches | Checks | Rollback |
|---|---|---|---|
| R1 (main 70694e5, COE_V 1437) | 1560 · 1562 · 1563 + coe-trials v11 | check.js OK · regress-saves 17/17 · regress-trials 19/20 (card check belongs to R2) · stability trials / enquiry / astudents ok | `rollback-pre-1560` |
| R2 | 1561 · 1564 · 1565 | check.js OK · regress-saves 17/17 · regress-trials 20/20 · stability trials / enquiry / mtoday / astudents laptop + phone ok | `rollback-pre-1561` |
