# QA 28 Oct 2026 · Management app as Operations (Celine, "Management · Operations")

Scope: everything Operations can open in the management app, compared with the President. Done in parallel with the President QA (patches 1460–1469) and the Teacher QA (1480–1489). Operations patches: **1470–1474**.

## How this was tested (and what was not)

- **Build:** live `app.html` on main (COE_V 1374) plus 1470–1474. Previews built with `tools/preview-build.js` with `?role=ops` (the bootstrap is rewritten to `pres:false`, role "Operations Coordinator").
- **Data:** only the synthetic fixture (`audit/fx/synth.json`: made-up names, codes and amounts, dates shifted by 52 weeks, so the preview clock reads Sun 24 Oct 2027 13:50). The saved copies in the fixture were recorded for the President, so for Operations they were mirrored to the management scope (`synth-ops.json`). Two **zztest** rows were added for workflow tests: one pending sick leave (`LV-ZZTEST-0001`, Teacher Gaimu) and one late time-in to decide. Team Chat ran on a mock of `coe-chat` (me = Celine), not on the database.
- **Saves:** only in the preview, with saving switched off or faked (`?writes=fake`); the request each save would send was checked in the preview's log. Nothing reached Google or Supabase. No real accounts, chats, notices or records were touched.
- **Important limit:** mirroring the President's saved copies means the preview shows Operations everything the *server* would give the President. Server-side filtering for Operations (Apps Script `mgr_` / `pres_`, edge functions) was checked by reading the code (`Code.gs` live copy of 28 Oct), not by signing in as Operations. "Pass" for a privacy row means: the screen code hides it for Operations, and the server code does not hand it to her (or the row says otherwise).
- **Widths:** every screen and every tab at 1440, 1366, 1024 and 390 (sideways scroll, script errors, failed/loading text). Dialogs at 1440. Keyboard: Tab order and visible focus on 8 key screens, Enter/Escape on a dialog.
- **Stability:** `tools/stability-check.js` with an extra Operations set (19 screens × laptop and phone), plus the President and teacher sets. `tools/regress-saves.js`: 17 of 17 passed.
- Scripts and raw results (scratch, not in the repo): `crawl2.js` (screen × tab × width), `dlg.js` (clicks every non-destructive button on each screen; 418 clicks), `wf.js` / `wf2.js` / `stu.js` / `dbl.js` (workflows), `kb.js` (keyboard), `verify.js` (before/after for 1470–1472).

## 1. Inventory: what Operations can open

**Side menu (laptop, 1024 and up):** Overview · Monitor · To do · Schedule · Notices & requests · Team Chat (once switched on) · Students · Trials · Teachers · Contracts · Notices of breach · Finance.
**Phone bottom bar (390):** Overview · Monitor · Schedule · Students · Finance · More. **More** lists: To do, Notices & requests, Team Chat, Trials, Teachers, Contracts, Notices of breach.
**Not shown to Operations:** Finance › Forecast, Finance › Wallets (direct opening shows a "not for this account" note), Mark paid / Undo paid, refunds, the President's password panel. My pay appears only when there is pay data for her.

| Screen | Tabs / filters | Dialogs and forms reached |
|---|---|---|
| Overview | (one page) Live classes, On time, Next; "needs you" line; Lates to decide card; Teachers today; Packages; Quality; Parent reports; Trends; Phone alerts; App check | Phone alerts; decide late (Excused / Unexcused / Waive); links into Schedule, Monitor, To do, Students, Performance, Parent reports |
| Monitor | Today / Yesterday; All · Time-ins · Classes · Videos · Homework & notes · Reports · Schedule; teacher chips | Time-ins: timeline, "Ask to redo check" dialog, Time out; class line → class card |
| To do | Do next (10); Trial reports to send; Renewals due; Trial follow-ups; Data to fix; Package deadlines; Celebrate | Copy message / reminder; Mark as sent; Message sent; Open times; Renewed · paid; Parent replied |
| Schedule | By time / By teacher; day strip; previous / next week | + Class; class card (Class details picture, Move · reschedule, Cancel · under 2 h, Student page, Edit details, + Add a class); Proof for the parent; Book this time |
| Notices & requests | Unread · Needs you · Waiting on teacher · Progress checks · Class QA · Notices & memos · From teachers · All · App health | + New notice (with Official memorandum); "Sent to N people" status; thread with Reply |
| Team Chat | Groups (All Teachers, Time-in, Substitutes), Direct; History; Search all my chats; Members | Composer (Requires reply, Requires acknowledgement, Pin message, Templates, Create formal notice, emoji, picture, voice); participant panel with Online / In class / Away; Manage members; Online now |
| Students | Students · Parent reports · Database sheet; filters Active, 5 or fewer left, Renewed · 30 days, New · 30 days, No agreement, No check-in 30+ days, Finished / not active, Shared packages; source chips; sort headers | Student page (Overview, Progress, Notes, Profile; Lessons left, Class notice, Lesson summary, Course Books, Edit details, + Record renewal, Weekly picture, + Class, Lessons left picture); Partner access (Partner prices, Conflicts, + New partner login); Student access; Package check |
| Parent reports | Month tabs; To check · Sent · Returned · Just in · No feedback yet · All reports · Chinese not reviewed | Report picture, Mark as sent, Copy message, Return to teacher |
| Database sheet | All · Trial · to enrol | + Student; row dialog |
| Trials | To send · Follow up · Enrolled · Not enrolling · Being made · No report yet · All | Booked trial → student |
| Enquiries | To follow up · New · Trial booked · Enrolled · Not now · Open · Results | + Log enquiry; Price picture; CEFR picture; Roadmap; Agreement; Payment |
| Teachers | Teachers · Performance · Trainings · Leave · Cases · Contracts · Notices of breach; sort | Teacher page; All teachers · open times; Add teacher / staff; Performance filters; Trainings (Schedule, Coaching, Videos & quizzes, Needs you, Blocked from next rank, Coming up, Coaching record, Self-study, matrix cells); Leave (+ File leave, leave record, check · raise); Cases (+ New case, + Wi-Fi case, case view); Contracts panel; Notices of breach |
| Finance | Overview · Payroll · Transactions · Sales & costs (Overview, Months & years, Income & spending, Dues & checks) | + Sale; + Expense; Payroll card (breakdown, Payslip); PAY tab; Export CSV |

## 2. Coverage table

Columns: **Opens** = opens without script errors and without sideways scrolling at 1440 / 1366 / 1024 / 390. **Workflow** = the action ran end to end in the preview with saving faked and the request checked (not the real server). **Role / privacy**, **Status sync**, **Next action**, **Duplicates**, **Context & drafts** are Misty's five priorities. P = Pass, F = Fail (defect below), B = Blocked, NT = Not tested, n/a.

| Screen › tab › dialog | Opens | Workflow | Role / privacy | Status sync | Next action | Duplicates | Context & drafts | Evidence / notes |
|---|---|---|---|---|---|---|---|---|
| Overview | P | n/a | P (no business card; 1461 removes "President" wording) | F→1463 ("1 thing needs you" vs 10 in To do vs badge) | P | Suggestion S1 (late shown 3×) | P | crawl2 4 widths; wf2 |
| Overview › Lates to decide › Excused / Unexcused / Waive | P | P (decideLate payload; server says "Already decided" on a repeat) | P | P (row leaves the list at once) | P | covered by 1464 (2nd tap on Confirm) | n/a | wf2: double tap on Confirm sent 2 requests before 1464; server is idempotent |
| Overview › Phone alerts | P | NT | P | n/a | P | P | n/a | dlg |
| Monitor › All / Classes / Videos / Homework & notes / Reports | P | n/a | P | P | P | P | P (teacher chip filter kept per tab) | crawl2, mon.js |
| Monitor › Schedule | P | n/a | P | P | Suggestion S8 ("Nothing yet." only) | P | P | mon.js |
| Monitor › Yesterday | B | n/a | P | F (D9: tap does nothing when yesterday's load fails, no message) | – | – | – | no yesterday sample; yd.js |
| Monitor › Time-ins (+ Ask to redo check, Time out) | P | NT (redo request not sent) | P (place and device are management-only) | P | P | P | P | dlg; kb |
| To do (Do next and sections) | P | P | P | F→1463 (count wording) | P | F→1474 (D1) | P | dbl.js, single.js |
| To do › Mark as sent (renewal) | P | **F→fixed 1474** | P | P | P | **F (D1)** | n/a | double-click marked 2 students |
| To do › Message sent (trial follow-up) | P | P | P | P | P | F→1474 (same pattern) | n/a | |
| To do › Open times | P | B (no availability sample) | P | – | P | – | – | dlg |
| Schedule › By time / By teacher / day strip | P | n/a | P | P | P | P | P | crawl2 |
| Schedule › class card (Move, Cancel under 2 h, picture) | P | NT (saves not run in this pass; covered 25 Oct D1) | P | P | P | P | P | dlg |
| Schedule › + Class / Book this time | B | B (student list sample missing for Operations) | – | – | – | – | – | dlg: "Could not load the student list. Try again." (error state correct) |
| Notices & requests › all 9 filters | P | n/a | F→1461 ("To the President only" chip) | F→1471 (D5 month/day dates) | Suggestion S4 | P | P | crawl2, verify.js |
| Notices › + New notice | P | covered by 1464 (triple send) | P | P | P | P | covered by 1464 (draft on close) | wf |
| Notices › thread / Sent to N people | P | NT | P | P | P | P | P | dlg |
| Team Chat (groups, direct, history, search, members) | P (mock) | P (mock: 3 quick taps → 1 send; failed send shows "Not sent · Retry") | P (Online / In class / Away only for management; chips "Management · Operations Coordinator", no "President") | P | P | P | P (typed draft kept after leaving and returning) | wf with chatfake.js; kb |
| Team Chat › Online now | P (mock) | n/a | P | P | P | P | n/a | wf |
| Students › all filters, sort, source chips | P | n/a | P | P (list "11.5 left" = student page "11.5 lessons left") | P | P | P | crawl2, stu.js |
| Students › student page › Overview / Progress / Notes / Profile | P | n/a | P | P | P | P | P | stu.js 1440 + 390 (no sideways) |
| Students › + Record renewal | P | **F→fixed 1473** (D4) | P | P | P | P | n/a | stu.js, ren2.js (normal answer still shows 11.5 + 33 = 44.5, Save enabled) |
| Students › Partner access (+ New partner login) | P | B (no partner logins sample) | P (partners see no money, no other families — text and portal unchanged) | n/a | P | P | n/a | partner.js |
| Students › Partner prices / Conflicts | B | B | – | – | – | – | – | no sample data |
| Students › Student access | P | B | P | n/a | P | P | n/a | Suggestion S5 (Chinese in a staff label) |
| Parent reports › queues | P | B (0 reports to check in sample) | P | P | P | P | P | crawl2 |
| Parent reports › other month (failed load) | P | n/a | P | F→1462 (month one off) | P | P | P | crawl2 |
| Database sheet › All / Trial · to enrol / + Student / row | P | NT | P | P | P | P | P | dlg |
| Trials › all queues | B | B (mgmtTrials sample missing) | – | – | – | – | – | error state with Try again shown |
| Enquiries › all tabs, + Log enquiry, pictures, Agreement, Payment | P | covered by 1464 | P | P | P | P | covered by 1464 | dlg |
| Teachers list, sort, map, open times | P | n/a | **Decision needed** (D12: per-lesson rates shown to Operations) | P | P | P | P | tchk.js |
| Teachers › teacher page | B | B (mgmtTeacher sample missing) | – | – | – | – | – | error state shown |
| Teachers › Add teacher / staff | P | NT | P (management roles disabled for Operations) | – | P | – | – | |
| Performance (all filters) | P | n/a | P (Teacher Excellence limited view) | P | P | P | P | crawl2 |
| Trainings (+ Schedule, + Coaching, Videos & quizzes, panels, matrix) | P | NT | P | P | P | P | P | dlg |
| Leave › page, + File leave, leave record | P | P (zztest: check → "Mark checked · raise" sent one mgmtLeaveSave with endorse:true; 2nd tap ignored) | F→1461 ("President approves", "File & send to President", "Only the President approves or declines.") | P | Suggestion S6 ("Waiting for Operations" when Operations is the viewer) | P | covered by 1464 | wf, wf2 |
| Cases › filters, + New case, + Wi-Fi case, case view | P | covered by 1464 | Suggestion S9 ("Assigned to: President" shown from the record) | P | P | P | P | dlg |
| Contracts / Notices of breach panels | P | NT | F→1461 (status pills) | P | P | P | P | dlg |
| Finance › Overview | P | n/a | P for this tab | P | P | P (+ Sale / + Expense are useful shortcuts) | P | crawl2 |
| Finance › Payroll (filters, card, Payslip, PAY tab) | P | n/a | P (no Mark paid for Operations); F→1472 (hint promised Mark paid) | P | P | P | P | wf, verify.js |
| Finance › Transactions | P | NT | P | P | P | P | P | |
| Finance › Sales & costs (4 tabs) | P | NT | **F · decision needed (D2)** | **F** (Overview says these figures are not for her; this tab shows them) | P | P | P | crawl2 c2-ops vs c2-pres |
| Finance › Wallets / Forecast (direct link) | P | n/a | P (hidden; wording → 1461) | n/a | n/a | n/a | n/a | |
| My pay | B | B | P (own pay only, 1366) | – | – | – | – | no sample |
| More (phone) | P | n/a | P | P | P | P | n/a | crawl2 390 |
| Keyboard (8 screens) | P | n/a | n/a | n/a | n/a | n/a | P (Escape returns focus to the opener) | kb.js: 29–30 stops each, every stop has a visible focus ring |
| Stability (Operations, President, teacher sets) | see §5 | | | | | | | stability-check |

## 3. Confirmed defects

| # | Severity | What happens (steps) | Status |
|---|---|---|---|
| D1 | **High** | To do › Do next › renewal line › double-click **Mark as sent**: the list redraws after the first click, the next line moves up, and the second click marks **the next student** as "Reminder sent" too (preview: ST-…-130 and ST-…-290). Same pattern for trial follow-up "Message sent", Celebrate and parent-report "Mark as sent". | **Fixed · 1474** (a second tap within 0.9 s, or the second click of a double-click, is ignored; a tap 1.5 s later still marks the next line) |
| D2 | **High · needs Misty** | Finance › Sales & costs shows Operations the full net, profit, break-even and "2027 net to date" (Apps Script `mgmtTab` gives the MONEY tab to any management login; the screen does not check the role). Finance › Overview tells her "Sales, costs and net are for the President". | **Not changed** (it would narrow Operations' access). Decide: (a) Operations keeps Sales & costs — then Overview should show the same; or (b) net/profit are President-only — hide the Net cards for Operations and make `mgmtTab('MONEY')` President-only (Code.gs paste). |
| D3 | Medium | Overview › last week's summary: when `mgmtWeekSum` fails, the fallback (7 schedule + 7 reminder calls) restarted on every Overview repaint — 274 calls in about 27 s in the preview, all queueing on Google. | **Fixed · 1470** (waits 5 min after a failed try: 32 calls; a successful load unchanged) |
| D4 | Medium | Students › + Record renewal: if the package check answers "ok" without a lessons-left number, the form showed "ACTIVE row undefined", "undefined left + 33 new = NaN lessons", a valid-until worked out from 0 carried, and an enabled Save renewal. | **Fixed · 1473** (shows "Lessons left are still being checked (核对中) …" with Try again; real Google answers always carry the number and still work) |
| D5 | Low | Notices & requests dates were month/day with a slash ("10/11 17:18" reads as 10 November in the Philippines); every other screen writes the day first. | **Fixed · 1471** ("11 Oct 17:18"; shared formatter, so teachers' Notices list changes the same way) |
| D6 | Low | Finance › Payroll told Operations "tap a teacher for the breakdown, payslip and Mark paid"; her card has no Mark paid. | **Fixed · 1472** |
| D7 | Medium | "President" title visible to Operations: leave flow and buttons, payroll note, "To the President only" chip, Finance / Wallets / Forecast notes, Performance ranking notes, contract status pills, staff role list. | **Covered by the President QA patch 1461** (not duplicated). Still visible after 1461: the sign-in screen link "President: first time or forgot password" and the server message "Please ask the President for your password." (needs a Code.gs paste); case view "Assigned to: President" (record value); memo "By Authority of the President" (kept on purpose, legal wording). |
| D8 | Low | Parent reports: a failed month says "Could not load … for November 2027" when October classes were picked. | Covered by 1462 |
| D9 | Low | Monitor › Yesterday: when yesterday's data cannot load, the tap does nothing (Today stays selected, no message). Seen only in the preview (no yesterday sample). | Open · check against a real failure before changing |
| D10 | Low | Overview / To do / Notices count "things that need you" differently. | Covered by 1463 (Overview and To do); Notices "Needs you" → suggestion S4 |
| D11 | Low | Overview › decide late: double tap on Confirm sent the decision twice (server answers "Already decided", so no double deduction). | Covered by 1464 |
| D12 | **Question for Misty** | Operations sees every teacher's per-lesson rate (Teachers cards "Senior Teacher · ₱135", Payroll breakdown "79.5 × ₱135", payslips) and all payroll amounts, including other staff rows. This matches "Operations sends payslips", but the QA brief named pay rates as President-only. | **Not changed.** Confirm which is right. |

Harness notes (not app defects): the preview's "fake save" list also matches the read `mgmtLeave`, which made Overview crash only in `?writes=fake` previews; teacher cards in the click-through opened other names only because the crawl had re-sorted the list (verified: each card opens its own teacher).

## 4. Suggestions (not changed)

- **S1 · Overview shows one late time-in three times** (Lates to decide card, "Late time-ins to decide" in the needs-you line, "Late time-in · 1" chip). Keep the decision card as the one place to act; the other two should link to it rather than read as separate tasks.
- **S2 · Dates:** Overview "Sunday 24 October", Time-ins "Sunday, October 24", To do "Oct 24, 2027 · 13:48", Leave "Oct 22 – Oct 24" and "10-22 16:00". One shared day-first format for all management screens.
- **S3 · Finance shortcuts:** + Sale / + Expense on Overview, Transactions and Sales & costs are useful shortcuts to the same form; keep.
- **S4 · Notices "Needs you 14"** counts messages, not tasks; call it "Needs your reply" so it does not compete with To do.
- **S5 · "Student access 学员专区"** on a staff screen: staff labels are English only; use "Student access" (the portal itself keeps its Chinese name).
- **S6 · Leave status for the viewer:** Operations sees "Waiting for Operations" on her own queue; "Waiting for you" is clearer.
- **S7 · Team Chat vs Notices:** ownership is already clear (the chat banner points formal items to Notices & requests; "Create formal notice" hands over). Keep.
- **S8 · Monitor › Schedule:** "Nothing yet." should say what will appear there.
- **S9 · Cases:** show "Assigned to: Management" for records stored as "President" (display only).

## 5. Releases

| Patch | What | Tests |
|---|---|---|
| 1470 | Week summary waits 5 min after a failed load | verify.js: 274 → 32 calls; regress-saves 17/17 |
| 1471 | Notice dates day first | verify.js (President and Operations) |
| 1472 | Payroll hint by role | verify.js: President unchanged |
| 1473 | Renewal form never shows a count it does not have (核对中) | stu.js (failure) + ren2.js (normal answer) |
| 1474 | One-tap list marks ignore a quick second tap | dbl.js (double-click → 1 write); single.js (two taps 1.5 s apart → 2 writes) |

Rollback branch: `rollback-pre-1470` (main exactly before these patches). Stability: see the release commit message for the run on the final build.

## 6. Remaining work

1. **D2 decision** (Sales & costs for Operations) and **D12 decision** (rates for Operations).
2. Sign-in screen "President: first time or forgot password" + Code.gs "Please ask the President for your password." (needs a Code.gs paste; shared with teachers).
3. Blocked rows need data: Team Chat on the real database (zztest group), Trials list, teacher page, + Class / Book this time for Operations, parent report check flow, partner prices / conflicts / logins, My pay, Monitor › Yesterday. A writable test environment (or recorded Operations samples) would unblock them.
4. Suggestions S1–S9 when Misty agrees.
5. Data-sync note: the database copies of ACTIVE, DATABASE, SALES, OCTOBER-DAILY and TC&SUB may be from 11:24 today until zzResync28 runs; numbers that disagree with the sheet are a sync issue, not a screen defect.
