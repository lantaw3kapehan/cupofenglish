# QA · 28 Oct 2026 · Management app, signed in as President (CupOfEnglish account)

Scope: the President's management view, screen → tab → subtab → dialog. Operations and Teacher have their own audits; shared-code defects found here are marked **shared**.
Method: preview builds of `main` (COE_V 1374) on the synthetic fixture `audit/fx/synth.json` (made-up names, clock 24 Oct 2027 13:50, saving off;
`?writes=fake` only where a save had to be exercised). Playwright on Chromium at 1440, 1366, 1024 and 390 px. Nothing touched production data;
no real messages, notices, accounts or passwords. Data-sync note: zzResync28 has not run, so live ACTIVE / DATABASE / SALES / OCTOBER-DAILY / TC&SUB copies
may be from 11:24. This audit used the fixture only, so no stale-number findings are reported.

Misty's five priorities are columns in the coverage table: **P1** repeated buttons/info · **P2** status consistent across screens · **P3** next action obvious ·
**P4** context, filters and drafts kept · **P5** role sees only what it may. `ok` = checked, no issue · `D#`/`S#` = defect / suggestion below · `–` = not assessed.

## 1 · Inventory (President)

**Shell** — header (account, Live chip, Online now, Time in/out chip, Refresh, Sign out) · laptop sidebar (Today: Overview, Monitor, To do, Schedule,
Notices & requests, Team Chat* · Students: Students, Trials · Teachers: Teachers, Contracts (panel), Notices of breach (panel) · Finance: Finance) ·
phone bottom bar (Overview, Monitor, Students, Finance, More) · More (phone): To do, Notices & requests, Team Chat, Trials, Teachers, Contracts, Notices of breach.
\*Team Chat shows in the sidebar only when the chat server answers (`chatOn1400`); in the preview it does not, so it is hidden there.

| # | Screen | Tabs / subtabs | Dialogs, panels, forms |
|---|---|---|---|
| 1 | Overview | status tiles (Classes, On time, Next) · "needs you" banner · Teachers today · Business (KPIs, Profit each month) · Packages · Performance · Parent reports · Where students come from · Levels · Students per teacher · Phone alerts · App check | — |
| 2 | Monitor | Today / Yesterday · All · Time-ins · Classes · Videos · Homework & notes · Reports · Schedule · teacher chips · Everything done in the app (activity) | — |
| 3 | Monitor › Time-ins | October / September / August · Needs a look · Office · Checks (System health) · Full details: Teachers' time-ins, Each teacher's details, Management hours, Class records by teacher, System health | Time out · Ask to redo check · Device |
| 4 | To do | Do next · tiles (Trial reports, Renewals, Trial follow-ups, Data to fix) · sections · Celebrate | Copy message / Mark as sent / Copy reminder / Open times / Add student / How to fix / Mark checked |
| 5 | Schedule | day strip · Day at a glance · By time / By teacher · teacher filter · Reminders | + Class · class panel (move / cancel / proof) · Remind · copy message · Proof for the parent · Book this time |
| 6 | Notices & requests | Unread · Needs you · Waiting on teacher · Progress checks · Class QA · Notices & memos · From teachers · All · App health | + New notice · thread panel · Remind |
| 7 | Team Chat | groups · direct · search · history · members | composer, Manage members — **Blocked** |
| 8 | Students | Students · Parent reports · Database sheet; filters Active / 5 or fewer left / Renewed 30 days / More filters; source chips; sort Student / Lessons left / A week / Valid until | Partner access · Student access · Package check · student panel (Overview / Progress / Notes / Profile; Lessons left, Class notice, Lesson summary, Edit details, More actions, Update · add a note, Record renewal, + Class, Weekly picture) |
| 9 | Students › Parent reports | month tabs · To check / Sent / Returned / Just in / No feedback yet / All reports / Chinese not reviewed | report panel |
| 10 | Students › Database sheet | All · Trial · to enrol | + Student |
| 11 | Trials | Trials / Enquiries · To send / Follow up / Enrolled / Not enrolling / Being made / No report yet / All · Booked trial classes | — |
| 12 | Trials › Enquiries | To follow up / New / Trial booked / Enrolled / Not now / Open / Results | + Log enquiry · Price picture · CEFR picture · Roadmap · Copy message · Copy form · Agreement |
| 13 | Teachers | Teachers / Performance / Trainings / Leave / Cases · rank groups · sort | All teachers · open times · Management passwords · Add teacher / staff (Team & access) · teacher panel · Contracts panel · Notices of breach panel |
| 14 | Teachers › Performance | All / Needs focus / Improved / Dropped / Not evaluated / Not complying · Teacher Excellence · QA read receipts | + QA evaluation · Ask for a fix |
| 15 | Teachers › Trainings | path · Books · Specializations & trials | + Schedule · + Coaching · Videos & quizzes · Edit records |
| 16 | Teachers › Leave | waiting · on leave · history | + Lodge leave · View leave · Picture for parents |
| 17 | Teachers › Cases | All / Not completed / Deductions / Bonuses | + New case · + Wi-Fi case · case panel |
| 18 | Finance › Overview | months list · Previous / Next | + Sale · + Expense |
| 19 | Finance › Payroll | All / To pay / Paid · Payroll insights · Payroll history | PAY tab · Payslip · teacher pay panel (Mark paid) |
| 20 | Finance › Transactions | All / Sales / Expenses · months · Export CSV | — |
| 21 | Finance › Sales & costs | Overview / Months & years / Income & spending / Dues & checks | Record a transfer / remittance / balance check / other |
| 22 | Finance › Forecast | Monthly / 13-week cash · Conservative / Expected / Optimistic | Assumptions |
| 23 | Finance › Wallets | balances · Wallet activity | Record a transfer / remittance / balance check / other in / out |
| 24 | Books | series cards | — |
| 25 | Activity log | Previous / Next | — |
| 26 | Online now (header) | now · in class · earlier today | panel |
| 27 | Time in / out chip (header) | — | — |

Teacher-only views present in the page (Growth, QA feedback, My pay, My Contract) are not part of the President's navigation and were not assessed.
**Total inventoried: 27 screens · about 150 tabs, subtabs and filters · about 70 dialogs, panels, forms and in-place actions** (counted from the table above).

## 2 · Coverage (President)

Result = state found on `main` before this release. Where it was a Fail and is now fixed, the fix is named.

| Screen | Tab / subtab / dialog | Result | Evidence | P1 | P2 | P3 | P4 | P5 |
|---|---|---|---|---|---|---|---|---|
| Shell | sidebar, header, More (phone) | Pass | all views open at 1440/1366/1024/390, no sideways scroll, no page errors | ok | ok | ok | – | S5 |
| Shell | keyboard | Fail (open) | Tab walks header → main; sidebar after main, no skip link; Home re-render drops focus to body | – | – | – | D12 | – |
| Overview | needs-you banner, badge | Fail → fixed 1463 | badge 20, banner "1 thing needs you · 2 waiting", To do "10 things" → now "20 items need you now" + group counts | ok | D6 | ok | – | ok |
| Overview | Notices without "Got it" | Fail → fixed 1466 | 24 (7 days) vs Notices › Waiting on teacher 25 (all) → "(last 7 days)" | – | D17 | – | – | – |
| Overview | other cards | Pass | each card opens its screen; numbers match fixture | ok | ok | ok | – | ok |
| Monitor | Today / Yesterday / All / teacher chips | Pass | tabs switch, table + activity render, 1440 & 390 | ok | ok | ok | – | ok |
| Monitor | Classes / Videos / Homework & notes / Reports / Schedule | Pass | open from the tab row | ok | ok | ok | – | ok |
| Monitor | activity log labels | Fail (open, low) | raw codes "ADDCLASS", "VIDEO UPLOAD" shown as labels | – | D16 | – | – | – |
| Monitor › Time-ins | month tabs, Needs a look, Office | Pass | Oct/Sep/Aug switch | ok | ok | ok | – | ok |
| Monitor › Time-ins | place chip icon | Fail → fixed 1465 | "📍" emoji → line pin icon (9 chips) | – | – | – | – | – |
| Monitor › Time-ins | Full details › System health | Fail → fixed 1460 | Team Chat CSS leak: 730 px empty bordered box | S1 | – | – | – | – |
| Monitor › Time-ins | Full details › Teachers' time-ins etc. | Blocked | `coe-wct day` / month detail not in fixture (skeleton only) | – | – | – | – | – |
| To do | Do next, tiles, sections | Pass (label fixed 1463) | buttons act in place; "✓ Message sent" → "Mark as sent"; "10 to act on now · the full lists are below" | ok | D7 | ok | – | ok |
| To do | Celebrate | Pass (icon 1465) | "Celebrate 🎉" → "Celebrate" | – | – | – | – | – |
| Schedule | day strip, By time / By teacher, filter | Pass | switch; 50 classes listed | ok | ok | ok | – | ok |
| Schedule | reminders chips/buttons | Fail → fixed 1465 | 🔔 emoji ×36 → line bell | – | – | – | – | – |
| Schedule | class panel | Pass (focus fixed 1466) | opens, Escape closes; focus was left behind the panel | – | – | ok | – | – |
| Schedule | + Class | Blocked | "Could not load the student list" (fixture) | – | – | – | – | – |
| Notices & requests | 9 filters | Pass | each filter lists rows, counts shown | S3 | D17 | ok | – | ok |
| Notices & requests | "To the President only" chip, sender name | Fail → fixed 1461 | now "Private · management only", sender "Management" | – | – | – | – | D2 |
| Notices & requests | + New notice | Fail → fixed 1464 | 3 quick taps → mgmtMsgSend ×6; Escape lost text → now 1 send, draft returns | – | – | ok | D4 | ok |
| Notices & requests | thread panel | Pass | opens with read/replied counts | ok | ok | ok | – | ok |
| Team Chat | all | Blocked | `coe-chat init` not in fixture; no real messages allowed | – | – | – | – | – |
| Students | filters, source chips, sort | Pass | 11 filters/sorts switch, lists repaint, no errors | ok | ok | ok | – | ok |
| Students | student panel (ST-2099-588) | Pass | header, lessons left 11.5 = package 15 − 3.5, CEFR, calendar, notes | S4 | S10 | ok | ok | ok |
| Students | Update · add a note | Fail → fixed 1464 | draft lost on Escape → now kept per student (key includes header) | – | – | – | D4 | – |
| Students | other students' panels | Blocked | most codes "Could not load" in fixture (3 of 25 open) | – | – | – | – | – |
| Students | Partner access · Student access · Package check | Pass (focus 1466) | panels open; focus now moves in | – | – | – | – | ok |
| Parent reports | October tabs (7 filters) | Pass | counts 0/0/122 consistent with header tiles | ok | ok | ok | – | ok |
| Parent reports | September (failed load) | Fail → fixed 1462 | error named "October 2027", "Back to November 2027" → now "September 2027 classes" / "Back to October 2027 classes" | – | D5 | ok | ok | – |
| Database sheet | All / Trial · to enrol | Pass | lists render | ok | ok | ok | – | ok |
| Database sheet | + Student | Blocked | "Could not open the form" (fixture) | – | – | – | – | – |
| Trials | 7 status tabs | Blocked | `mgmtTrials` not in fixture; error state with Try again shown correctly | – | – | ok | – | – |
| Trials | Booked trial classes | Pass | 2 bookings with status chips | ok | ok | ok | – | ok |
| Trials | Enrolled chip | Pass (icon 1465) | "Enrolled 🎉" → "Enrolled" | – | – | – | – | – |
| Enquiries | 7 tabs, Results | Pass | switch, empty states worded | ok | ok | ok | – | ok |
| Enquiries | + Log enquiry | Fail → fixed 1464 | 3 taps → mgmtEnqSave ×3; draft lost → fixed | – | – | – | D3/D4 | – |
| Enquiries | Price / CEFR picture, Roadmap | Pass | panels open | – | – | – | – | ok |
| Teachers | list, rank groups, sort | Pass (open D13) | 4 sorts; 31 text elements < 12 px | ok | ok | ok | – | ok |
| Teachers | teacher panel | Blocked | `teacherCard` not in fixture | – | – | – | – | – |
| Teachers | Add teacher / staff (Team & access) | Blocked | `coe-staff list` not in fixture; role chip code fixed (1461: "Management", not "President") | – | – | – | – | D2 |
| Teachers | Management passwords | Blocked | "Could not load the list" (fixture) | – | – | – | – | – |
| Teachers | Contracts / Notices of breach panels | Pass | open, list, close; contract status text fixed 1461 | – | – | ok | – | D2 |
| Performance | 6 filters | Pass | lists change; ranking notes "not the President" → "not management" (1461) | ok | ok | ok | – | D2 |
| Performance | + QA evaluation | Blocked | "Could not load the form" (fixture) | – | – | – | – | – |
| Trainings | path, + Schedule, + Coaching, Videos & quizzes | Pass | panels open; Coaching draft kept (1464) | – | – | ok | D4 | ok |
| Leave | list, View leave, Picture for parents | Pass | panels open; flow text "management approves" (1461) | – | – | ok | – | D2 |
| Leave | + Lodge leave | Pass (draft 1464) | form opens; save not exercised (type pill + teacher needed) | – | – | – | D4 | ok |
| Cases | 4 filters, case list | Pass | filters switch | ok | ok | ok | – | ok |
| Cases | + New case / + Wi-Fi case | Fail → fixed 1464/1461 | addCase ×3 from 3 taps; Source option "President" → shows "Management" (value unchanged) | – | – | – | D3/D4 | D2 |
| Finance › Overview | months, Previous / Next | Pass | months list; sales per month | ok | ok | ok | – | ok |
| Finance › Overview | + Sale / + Expense | Pass (draft 1464) · save Blocked | validation message "Description, category and amount are needed." frees the button; categories not in fixture | – | – | ok | D4 | ok |
| Finance › Payroll | All / To pay / Paid | Pass (empty text 1465) | "Nobody here" → "Everyone is paid for September 2027" | – | ok | ok | – | ok |
| Finance › Payroll | Payroll insights | Fail → fixed 1460 | 754 px empty box (Team Chat CSS leak) → 48 px row | – | – | – | – | – |
| Finance › Payroll | teacher pay panel, Payslip | Pass | breakdown units × rate, bonus, deductions | ok | ok | ok | – | ok |
| Finance › Payroll | Ready to release, history | Blocked | `mgmtPayReady`, `mgmtPayroll` not in fixture ("checking…") | – | – | – | – | – |
| Finance › Transactions | All / Sales / Expenses / months / Export CSV | Pass | lists render | ok | ok | ok | – | ok |
| Finance › Sales & costs | 4 tabs | Pass | KPIs say estimate vs actual ("expected net · estimate", "actual") | S6 | ok | ok | – | ok |
| Finance › Forecast | Monthly / 13-week / scenarios | Pass | switch | ok | ok | ok | – | ok |
| Finance › Wallets | Record … dialogs | Pass (Escape fixed 1464) | Escape did nothing → closes an untouched dialog | – | – | ok | ok | ok |
| Books | series | Pass | 50+ cards | – | – | – | – | ok |
| Activity log | Previous / Next | Pass | renders | – | D16 | – | – | ok |
| Online now | panel | Pass | now / earlier today, device and version | ok | ok | – | – | ok |
| Forms (all) | duplicate submit | Fail → fixed 1464 | see D3 | – | – | – | – | – |
| Forms (all) | draft on close | Fail → fixed 1464 | 7/7 forms lost text → 7/7 kept; none after a successful send; no cross-student restore | – | – | – | D4 | – |
| Forms (all) | save reaching the real server | Not tested | rule: no production writes; no writable zztest environment | – | – | – | – | – |
| Team Chat | posting, reactions, receipts | Not tested | rule: no real chat messages; chat not in fixture | – | – | – | – | – |

**Counts (67 rows):** Pass 38 · Fail 16 (14 fixed in 1460–1466, 2 open: D12, D16) · Blocked 11 · Not tested 2. Pass rows can still carry an open item (D13) or a suggestion.
Not tested at all: anything that reaches the real server (saves, uploads, Mark paid, refunds, countersign, Export CSV file contents), printing/PDF, WeChat copy-paste.

## 3 · Confirmed defects

| # | Sev | Where | Steps / what happened | Status |
|---|---|---|---|---|
| D1 | High · shared | Payroll › Payroll insights; Monitor › Time-ins › System health | Open Finance › Payroll: a 754 px empty white box with "Payroll insights" floating in it. Cause: Team Chat (1400) styled the bare class `.ch`; every other `.ch` got min-height 520 px, border, panel. | **Fixed 1460** (rules scoped with `:where(#v-chat)`, same specificity; leak scan 0 hits) |
| D2 | High · privacy rule · shared | Leave flow, teacher message form, contracts, Notices list, Team & access, case Source, Wallets/Forecast/Sales notes for Operations, Performance notes | "President" visible to Operations and teachers in 37 strings. | **Fixed 1461** (display only; stored values unchanged). Left: contract document, opt-in memo line "By Authority of the President", login button "President: first time or forgot password" (S7) |
| D3 | High · shared | + New notice, + New case, + Log enquiry (all sheet forms) | With a 2.5 s slow answer, 3 taps on Send / Add case / Save enquiry sent 3 requests (mgmtMsgSend ×6, addCase ×3, mgmtEnqSave ×3). | **Fixed 1464** (one tap per request; re-tests: 1 request each) |
| D4 | High · shared | every sheet form | Type, press Escape (or ✕ / outside): text gone on reopen (7/7 forms). | **Fixed 1464** (kept in memory per form + header; dropped after a successful send; cleared on sign-out) |
| D5 | Medium | Students › Parent reports | Tap "September 2027" when it fails: "Could not load the parent reports for October 2027" + "Back to November 2027". | **Fixed 1462** |
| D6 | Medium · status | Overview vs To do | Badge 20, banner "1 thing needs you · 2 waiting on teachers", To do "10 things". | **Fixed 1463** |
| D7 | Low · actions | To do › trial follow-ups | "✓ Message sent" (looks like a status) vs "Mark as sent" elsewhere for the same action. | **Fixed 1463** |
| D8 | Low · design rule | Time-ins, Schedule, To do, Trials | Emojis used as UI icons (📍, 🔔, 🎉). | **Fixed 1465** for these. Open: ⚠ (≈50 warning strings), ✎, ★ glyphs; teacher screens (13478, 13529, 1741, 23185) → teacher QA |
| D9 | Low | Payroll filters | "Nobody here" for an empty To pay list. | **Fixed 1465** |
| D10 | Low · keyboard | Wallets › Record … | Escape did not close the dialog. | **Fixed 1464** (closes when untouched) |
| D11 | Medium · keyboard · shared | Partner access, Package check, class panel, Price picture, + New case | Focus stayed on the page behind the panel. | **Fixed 1466** |
| D12 | Medium · keyboard · shared | Shell / Overview | Sidebar comes after main content in Tab order, no skip link; Overview re-renders drop focus to the page body. | Open |
| D13 | Low · a11y | Teachers | 31 visible text elements below 12 px (rank-group lines). | Open |
| D14 | Medium · Operations lane | Finance › Sales & costs as Operations | "Sales & costs could not load … not part of this account" — an error and a permission note in one message. | Open → Operations QA |
| D16 | Low · labels | Monitor › Everything done in the app | Raw action codes (ADDCLASS, VIDEO UPLOAD) as labels. | Open |
| D18 | Low · stability · pre-existing | Monitor › Time-ins | Intermittent shift when the screen is opened (CLS 0.043–0.079, `card | lead` ~14 s after open); seen on main and on the release. | Open |
| D17 | Low · status scope | Overview vs Notices | "Notices without Got it" 24 (last 7 days) vs "Waiting on teacher" 25 (all), scope not stated. | **Fixed 1466** (label says "(last 7 days)") |

## 4 · Suggestions (not defects; each keeps all functions)

- **S1** System health appears three times (Overview › App check, Time-ins › Checks card, Time-ins › Full details › System health). Keep the Checks card as primary; make Full details › System health its "more" view, and the Overview line a link to it.
- **S3** Notices & requests: every teacher message carries a red "! From the teacher" chip. Keep red only for "Needs you"; use a neutral chip for "From the teacher" (less alarm fatigue).
- **S4** Student panel: three filled teal buttons at once (Lessons left, Update · add a note, + Class). Keep one primary per card; the others ghost.
- **S5** Header on Misty's own screen reads "President" under the account name. For screen-sharing, consider "Management" (low-key).
- **S6** Finance tab bar splits Overview / Payroll / Transactions (left) from Sales & costs / Forecast / Wallets (right, Sales greyed); one row with the same weight would read as one set.
- **S7** Sign-in button "President: first time or forgot password" — rename to "Management: first time or forgot password" (check when it shows).
- **S8** Phone: the badge sits on Overview while the work is in To do (under More). Consider a small count on More.
- **S10** Student panel: "the package ends on Tue, 30 Nov" (when the lessons run out) next to "Valid 89 more days · deadline 21 Jan 2028". Say "lessons run out on Tue, 30 Nov".

## 5 · Releases

| Release | Patches | What | Checks | Rollback |
|---|---|---|---|---|
| COE_V 1392 (on top of main 42f1d0d, COE_V 1385, after 1470–1474, 1483, 1490, 1495–1497, 1500) | 1460 · 1461 · 1462 · 1463 · 1464 · 1465 · 1466 | D1–D11, D17 above | `check.js` 445 scripts OK (re-run after each of 3 rebases) · regress-saves 17/17 · stability: 11 management screens × laptop/phone interleaved with main (release all ≤ 0.0107; main itself moved once, Time-ins laptop open 0.043) + Overview (refresh 0.0018 / 0) + teacher set 16/16 stable (limit 0.02) · re-tests: `.ch` leak scan 0, "President" scan 0 (President + Operations), duplicate taps 3→1 (notice, case, enquiry), drafts 7/7 kept, none after send, no cross-header restore, validation frees the button | branch `rollback-pre-1460` = 42f1d0d (main before this release) · release commits 7290bdb + CI 84f3931, Pages deployed |

Stability note: after the last rebase, Time-ins, Payroll, To do (management) and Today, Notices (teacher) were re-run — all ≤ 0.0061 except one intermittent Monitor › Time-ins open shift (0.043, `card | lead` at 14 s) that main shows too (D18). Earlier note: the first full runs (CONC=4, and one at CONC=1) failed from machine load (load average ≈ 15 on 2 CPUs; page.goto timeouts, one browser killed). The release was therefore measured screen by screen, alternating with main under the same load.

## 6 · Remaining work

- D12, D13, D16, D18 (open, low/medium). D14 → Operations QA.
- Team Chat CSS: one bare `.ch{position:relative}` remains inside the ≤900 px media query (harmless today; scope it with the rest when chat CSS is next touched).
- Blocked items need fixture recordings: Team Chat (coe-chat init), Trials lists (mgmtTrials), Payroll ready/history, teacher panel (teacherCard), Team & access (coe-staff list), + Class / + Student / + QA evaluation forms, most student panels, Time-ins month detail.
- Server-side saves were not exercised (rules). A writable zztest environment is needed to verify saves end-to-end.
- Teacher screens still use emojis as icons (see D8) — teacher QA.
