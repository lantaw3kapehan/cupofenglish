# QA · 29 Oct 2026 · Students and the shared student dialogs (management, President)

Method: preview builds (`tools/preview-build.js`) on the synthetic fixture `audit/fx/synth.json` (made-up names, clock 24 Oct 2027,
saving off; renewal save stubbed in-page to stop before Google). Playwright Chromium at 1440 and 390 px, every button clicked, Escape
pressed after each. Real data only read (Supabase, read-only SQL) for counts. No saves, sends, refunds or cancellations reached a server;
no messages, accounts or passwords. Base = main before 1580 (`rollback-pre-1580`).

## 1 · Inventory

| Screen / card | Tabs, parts | Buttons and dialogs |
|---|---|---|
| Students list | Students · Parent reports · Database sheet tabs; Package check link; Access menu (1584); search; filters Active / 5 or fewer left / Renewed 30 days / More filters (New, No agreement, No check 30+ days, Finished, Shared); source chips; sort Student / Lessons left / A week / Valid until | row → student page; Package check; Partner access; Student access |
| Student page header | name, chips (code, age · grade, city, with us, teacher, book, source), KPIs (lessons left, CEFR, latest), Every week bar | Copy (WeChat group), Shares a group with…, Lessons left, Class notice, Lesson summary, Course Books, Edit details, More actions (Agreement, Copy portal message, Change book, Teacher / schedule, Print / PDF, Refund) |
| Overview tab | Status (Update · add a note, + Record renewal), Changes · step by step (Renewal, Teacher or time, Pause or stop → Note the answer, Renewed · paid, Make the picture, Add classes, Class notice, Agreement), Schedule (Weekly picture, + Class, calendar with class buttons, list view), Package (Edit package, Lesson summary, Lessons left picture) | as listed |
| Progress / Notes / Profile tabs | CEFR journey (Picture to send, Level-up check), teacher feedback (English / 中文), notes, profile | as listed |
| Shared dialogs | Renewed · paid, Enrolled · paid, Class notice, Lessons left · to send, Lesson summary, Service agreement, Course plan, Price picture, Change teacher / schedule, Change book, Refund, Edit details, Package check, Partner access, Student access | Back chip, ✕, Escape |

Total: 1 list screen, 4 profile tabs, 1 header, ~55 buttons on a student page, 15 shared dialogs.

## 2 · Coverage (state after 1586)

| Where | Item | Result | Evidence |
|---|---|---|---|
| List | tabs, filters, source chips, 4 sorts | Pass | repaint, no errors, 1440 / 390, no sideways scroll |
| List | Database link duplicate | Fail → fixed 1584 | link removed, tab kept |
| List | Partner / Student access | Pass (moved 1584) | Access menu opens both dialogs; Escape / outside closes |
| List | Package check | Pass | opens from the link under the title |
| List | A week column | Pass | "N classes a week · 25 min = X lesson units a week", tooltip explains units (history, last months) |
| Page | 4 tabs, English / 中文 | Pass | 1440 / 390 |
| Page | Every week bar | Fail → fixed 1581 | now shows units a week |
| Page | calendar coverage warning | Fail → fixed 1581 | Jeoda: "20 after the 11 left · ends 30 Nov" → "8 classes (4 units) after 11.5 · covered up to 11 Jan (estimate)" |
| Page | renewal steps learner type | Fail → fixed 1580 | base: last trial card's box injected (reproduced with TLD = adult business); new: none |
| Page | stale redraw over a newer card | Fail → fixed 1582 | base: Price picture replaced by the student page on a late redraw; new: Price picture stays |
| Page | header buttons (Copy, Shares a group, Lessons left, Class notice, Lesson summary, Course Books, Edit details) | Pass | each opens its card, no page errors |
| Page | More actions (Agreement, Copy portal message, Change book, Teacher / schedule, Print / PDF, Refund) | Pass (opened only) | Refund not submitted (rule) |
| Page | renewal steps (rnGo ×6) | Pass after 1586 | one Back button (was two: Fail → fixed 1586) |
| Page | Add classes (renewal step) | Blocked | "Could not load the student list" (fixture) |
| Page | + Class, class buttons on calendar | Pass (opened only) | class panel opens; no move / cancel saved |
| Page | Progress: Picture to send, Level-up check | Pass | cards open |
| Dialog | Course plan / Price picture from a trial card | Fail → fixed 1580 | adult business trial: base Kids & teens; new Adults · 18+ / Business English |
| Dialog | Renewed · paid valid until | Fail → fixed 1583 | 15 left + 15 new: base "25 Jun · 8 months (incl. carried)"; new "25 Feb · 4 months (15 new lessons)" |
| Dialog | Renewed · paid review | Pass (new 1583) | save call 0 before Confirm, 1 after; warning for partner vs source |
| Dialog | Renewed · paid 核对中 hold (1540) | Pass | hold still applied (the review runs only when Save is enabled) |
| Dialog | Enrolled · paid valid until / review / course / source | Pass (code + unit check) · save Not tested | fixture has no enrol dry-run answer; review rows verified with a stub |
| Dialog | Payment Confirmation from renewal / enrolment | Blocked (1563 on main) | entry card opens the dialog; `coe-invoice boot` not in the fixture ("Something went wrong"). Entry card still says "…emailed to the parent" and uses a 🧾 emoji: reported to the 1563 owner, not changed here |
| Dialog | Back / ✕ / Escape | Fail → fixed 1585 | Escape closed all while ✕ went back; now both go back; back to a student page re-opens it at the same scroll (600 → 655 px, kept copy) |
| Dialog | Escape on Lesson summary, Edit details, + Class, Refund | Pass (closes) | these are opened without a Back chip (forms / loading), so Escape closes, same as ✕ |
| Phone 390 | page, all opened cards | Pass | no sideways scroll on any of 42 cards |
| Saves | renewal / enrolment / note / class / refund to the server | Not tested | rule: no production writes; no writable test environment |
| Portals | student / partner views | Not tested | no portal code changed |

Counts: 31 rows · Pass 15 · Fail → fixed 10 · Blocked 1 · Not tested 4 (+1 pass with save not tested).

## 3 · Counts on real data (read-only)

- Learner type vs age / course (677 students on DATABASE, latest trial report per student):
  - stored learner type adult but age under 18: **0**; young learner but age 13+: **0**;
  - trial report Young / Teen but DATABASE age 18+: **1** (ST-2025-002, RE-F, 18);
  - kids' course with an adult (age 18+ or adult report): **5** (ST-2024-108, ST-2025-045, ST-2025-002, ST-2023-035, ST-2021-008 — DATABASE ages are entry-time values, likely stale);
  - adult by report / course but the old `isAdult` said child: **7** (Will ST-2026-123, ST-2026-122, ST-2025-076, ST-2025-045, ST-2021-003, ST-2022-061, ST-2022-027) → fixed by 1580;
  - adult by grade / age but a kids' report or course: **1** (ST-2024-108);
  - no age, no report, no telling course: **89** (shown "Not known yet"; dialogs keep their own default).
  Distinct students in any mismatch: **11**. Stored data not changed.
- Learner-type leak (1580): every student page showing Renewal · step by step after a trial card had been opened in the same session.
- Validity ended with lessons left (parent pictures said "extended N days"): **46** active packages today (oldest deadline 10 Oct 2023; Amy: 1 left, ended 7 Jul 2026).
- Calendar coverage (148 active students with booked classes, shared packages included in this count): **13** had a false "booked after the package" warning; **109** had a wrong count or date (sessions vs units). 132 still warn correctly (recurring series run past the package).

## 4 · Defects

| # | Sev | Where | What | Status |
|---|---|---|---|---|
| S1 | High · data safety | renewal steps | last trial card's learner type box (could re-save another student's report) | fixed 1580 |
| S2 | High | trial card → Course plan / Price | adult learners defaulted to Kids & teens | fixed 1580 (+ 1562 Trials) |
| S3 | High | renewal form | valid until counted carried lessons; month end not kept | fixed 1583 |
| S4 | High | student calendar | sessions counted as units; 0 left not warned | fixed 1581 |
| S5 | Medium | parent pictures | "extended N days" with no extension | fixed 1581 |
| S6 | Medium | student page | late redraw over a newer card | fixed 1582 |
| S7 | Medium | Back / Escape | Escape ≠ ✕; Back showed a pre-save copy | fixed 1585 |
| S8 | Low | renewal steps | two Back buttons; a 30-min "Back to X's page" on unrelated cards | fixed 1586 |
| S9 | Low | renewal form | teacher from another student when none passed | fixed 1580 |
| S10 | Low | list header | duplicate Database link | fixed 1584 |
| S11 | Low · open | Lesson summary | `tabSheet('INDPKG')` falls back to the raw sheet when there are no rows (two looks for one action) | open |
| S12 | Low · open | wording | "lessons" vs "lesson units" vs "classes" still mixed in older strings (Lesson summary picture, To do) | open |

## 5 · Suggestions (keep every function)
- One primary button per card on the student page (Lessons left filled, the rest ghost) — S4 of the 28 Oct audit, not done to avoid moving the header.
- Learner type chip in the student header from `coeLearner` ("Adult · business", "Young learner", "Not known yet"), editable through the trial report only.
- App health line for the 11 learner-type mismatches.
- Partner names: SALES uses "Jinan - Ms. Spring", DATABASE SOURCE "Jinan – Dr. Spring" (see decisions).

## 6 · Releases

| Release | Patch | Checks | Rollback |
|---|---|---|---|
| 1580 learner profile | 1580-learner-profile-one-source.js | check.js OK (renewal suite) · base/new repro | rollback-pre-1580 |
| 1581 units + validity words | 1581-units-coverage-validity-words.js | check.js · panel text 1440/390 | rollback-pre-1581 |
| 1582 stale redraw | 1582-student-page-no-stale-redraw.js | base/new repro | rollback-pre-1582 |
| 1583 enrol / renew review | 1583-enrol-renew-review-step.js | stubbed save count 0 → 1 | rollback-pre-1583 |
| 1584 header | 1584-students-header-access-menu.js | astudents stability laptop + phone | rollback-pre-1584 |
| 1585 Back / Escape | 1585-back-close-escape-same.js | base/new repro | rollback-pre-1585 |
| 1586 one Back | 1586-one-back-button.js | base/new repro | rollback-pre-1586 |

All: regress-saves 17/17 on 1580–1585 build and again after 1586; renewal suite 44/44 (check.js). Stability (limit 0.02), management
mtoday, schedule, reports, students, astudents, trials + teacher students, laptop + phone: base all ok; release ok except two single
spikes under load (mtoday laptop refresh 0.179, astudents phone 0.041) that did not repeat in two re-runs (final 0.0031 / 0.0065 and 0 / 0).

## 7 · Not tested
Server saves (renewal, enrolment, note, class, refund, agreement send), Payment Confirmation path (1563 pending), student / partner
portals, printing / PDF output, WeChat paste, Team Chat. Add classes from the renewal steps (fixture).
