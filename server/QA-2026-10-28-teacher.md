# Teacher app · UI/UX and functional QA · 28 Oct 2026 (releases 1480–1483)

Scope: the **Teacher** role, phone first (390) and laptop (1366, 1440, narrow 1024). Management (President, Operations) is audited by two other agents (1460–1479); shared-code findings are marked **shared**.

**How it was tested.** Preview builds of the live screens (`tools/preview-build.js` + `audit/fx/teacher.json`, the synthetic "Teacher Test" account, clock frozen at Sun 25 Oct 13:50 with Ben's 13:40 class live). Endpoints the 25 Oct fixture does not have (Team Chat `coe-chat`, `coe-done`, `coe-wct`, `coe-fixedpay`, `coe-growth`) were answered by an in-page synthetic mock (made-up messages, nothing leaves the page). Saves only with `?writes=fake` (pretend-saved) or refused (default). No production record, chat message, account or sign-in was used or changed. One read-only SQL (`coe_vid_mine` definition) was run to confirm a field.

Evidence names refer to scripts and screenshots in the QA scratch folder (`inv.js` = inventory and checks per view and width; `q.js` = step runner; `probe.js` = sheets that open by themselves; `emo.json` = emoji scan; `t1480/t1481.json` = fix tests).

Limits, stated plainly: the server was never called, so "Mock-tested" means the screen and the request were checked, not the server's answer. Internet speed test, screen sharing (time-in / Redo picture), camera, microphone, phone notifications and sounds cannot run in the headless preview. Stale database numbers from before zzResync28 would be data-sync, not UI; none were seen in the synthetic data.

---

## 1. Inventory (teacher)

Navigation: laptop side menu (≥ 900 px) Today · Schedule · Students · Books · Notices & requests — Growth · QA feedback · Trainings · Pay · My Contract · Activity log · Team Chat. Phone bottom bar Today · Schedule · Students · Notices · Pay · More (More → Team Chat, Books, Activity log, Growth, QA feedback, Trainings, My Contract). Header: name / rank / own rate, time-in / I'm in chip, Refresh, Sign out.

| Screen | Tabs / sections | Dialogs, sheets, forms reached from it |
|---|---|---|
| Sign-in | Teacher / Management choice | (not run: real sign-in not allowed) |
| **Today** | Greeting · Notice of breach banner · Warning (management's comments) box · Now & next (class card) · Needs your action (queue, Show all) · My class videos · Day strip · Time-in card · Remaining today · Completed today (fold) · Cancelled today · Class sound row | Student page · Book (consent → files) · Copy phone · Meeting ID · I'm in · Homework · Class brief · Class note · Upload video / drag-and-drop · Late details (→ Pay) · Tagged "See why" · Message thread (Got it) · Read and sign (Contract) · Check your pay · Leave answer · Trial report · To fix · WeChat time-in picture · Video check "Explain" · Peer review · Monthly feedback · Redo time-in · Internet check detail · Follow-up plan (warning box) |
| **Team Chat** | Groups: All Teachers · Time-in · Substitutes · Direct: Management | Header: Mute · History (earlier days) · Search all my chats · Members · Chat sounds; composer: emoji · picture (+ mark-up) · voice; per message: react · copy link · reply · quick replies · Acknowledge; picture viewer |
| **Schedule** | This week · Next week · This month · Next month; week strip; Leave card; day lists; Finished fold; My open times | Request leave · Cancel leave · day jump · My open times sheet |
| **Students** | Search; All · October feedback to do · Ending soon; student cards; No longer with you; Tell Ops; Trials & sub classes | Student page (Overview · Progress · Notes · Course book · Schedule · More actions) · Monthly feedback form · Trial report form · Progress check form |
| Books | Book list | Licence consent sheet · book files |
| **Notices & requests** | Tiles: unread · to acknowledge · saved; search; All · Progress checks · Class QA · Notices & memos; Needs you / by day | New message (Operations & management / Management only) · Request leave · thread sheet (Got it + quick replies + reply) |
| Activity log | Day back / forward | Copy as proof |
| Growth | Attendance · class record · To fix · career path · timeline · peer feedback · class visits · recognition | Month detail · peer review form |
| QA feedback | What you do well · focus next · scores · progress | — |
| Trainings | Rank path · next up | Books you can teach |
| **Pay** | Punctuality · last month's pay check · October release checklist · estimate · total earned · pay history · bonuses & deductions | This is correct · Something's wrong (dispute) · payslip |
| My Contract | Documents · notices · memoranda · term | Read / sign (signature pad) · notice of breach explain · print copy |
| More (phone) | list of other screens | — |

## 2. Coverage table

Columns: **Opens** (no script error, no sideways scroll at 390/1024/1366/1440) · **Workflow** (Mock-tested / Partly / Blocked / Not tested) · Misty's priorities **P1** repeated items · **P2** consistent status · **P3** obvious next action · **P4** context/drafts kept · **P5** role-appropriate. ✓ = checked, no problem left · ✗ = defect (fixed or open, see §3) · – = not applicable.

| Role › Screen › Tab / dialog | Opens | Workflow | P1 | P2 | P3 | P4 | P5 | Evidence / note |
|---|---|---|---|---|---|---|---|---|
| Teacher › Today › greeting, Now & next | Pass | Mock-tested | ✓ | ✓ | ✓ | – | ✓ | inv 390/1024/1366/1440; one primary per card; header chip and card button both "I'm in" (kept: header is the shortcut from every screen) |
| Today › class card (phone) | **Fail → fixed** | Mock-tested | ✓ | ✓ | ✓ | – | ✓ | D5: "Edit ID" cut off at 390 (link right 385 > box 359); 1482 wraps it |
| Today › Needs your action | Pass | Mock-tested | ✗ open | **✗ → fixed** | ✓ | ✓ | ✓ | D3 late label; D2 video status; S1 duplicates (open) |
| Today › Show all | Pass | Mock-tested | ✓ | ✓ | ✓ | ✓ | ✓ | 17–22 rows; count grows ~15 s after load as Team Chat / done-lists answer (S4) |
| Today › My class videos | Pass | Mock-tested | ✗ open | **✗ → fixed** | ✓ | – | ✓ | D2 |
| Today › Completed today / Remaining / Cancelled | Pass | Mock-tested | ✓ | **✗ → fixed** | ✓ | ✓ open/closed kept | ✓ | "2 with something to finish" → 1 after D2 |
| Today › Time-in card, internet detail | Pass | Partly | ✓ | ✓ | ✓ | – | ✓ | detail sheet reads "historical, not live"; speed test cannot run in preview |
| Today › Redo time-in (request → sheet) | Pass | Partly | ✓ | ✓ | ✓ | – | ✓ | mock `coe-wct mine` redo: row "Redo now" first with Late row, sheet opens; screen share / speed **Blocked** (headless) |
| Today › WeChat time-in picture | Pass | Blocked | ✓ | ✓ | ✓ | – | ✓ | picture needs the speed result; no pay rate or phone in its fields (code read) |
| Today › Homework sheet · page check (Kat / Phyllis complaint) | **Fail → fixed** | Mock-tested | ✓ | ✓ | ✓ | – | ✓ | D13: new-book page 3 called "going back"; 7 cases before/after, both paths (1483, live) |
| Today › Homework sheet / Given | Pass | Mock-tested | ✓ | ✓ | ✓ | – | ✓ | refused save → "Homework not saved. Tap again." and rollback (code + run); fake save lacks `hw` so row stays (preview limit) |
| Today › Class note | Pass | Mock-tested | – | ✓ | ✓ | **✓ draft kept** after close and after switching screens | ✓ | wf.json |
| Today › Class brief | Pass | Mock-tested | ✓ | ✓ | ✓ | – | ✓ | Esc closes |
| Today › Book (licence consent) | Pass | Not tested (files) | ✓ | ✓ | ✓ | – | ✓ | |
| Today › Meeting ID | Pass | Not tested (save) | ✓ | ✓ | ✓ | – | ✓ | |
| Today › Upload video | Not tested | Blocked | – | – | – | – | – | file picker / Drive upload not in preview |
| Today › Addendum pop-up during a class | **Fail → fixed** | Mock-tested | – | – | ✓ | – | ✓ | D1: probe showed it open at 6 s with Ben's class live; after 1480 nothing opens in 40 s, opens 30 s after the class ends |
| Today › Warning box (management's comments) | Pass | Not tested (send plan) | ✗ open | ✓ | ✓ | – | ✓ | S1; icon heading fixed (1482) |
| Today › Notice of breach banner | Pass | Not tested | ✓ | ✓ | ✓ | – | ✓ | icon (1482) |
| Today › Class sound row | Pass | Blocked (audio) | ✓ | ✓ | ✓ | – | ✓ | icon (1482) |
| Teacher › Team Chat › groups, direct | Pass | Mock-tested | ✓ | ✓ | ✓ | ✓ | ✓ | no presence of other teachers, receipts only on own messages (server code); no "President" |
| Team Chat › Acknowledge / quick replies | Pass | Partly | ✓ | ✓ | ✓ | – | ✓ | buttons render; server confirmation not available in preview |
| Team Chat › Today rows ("Reply to … / Acknowledge …") | Pass | Mock-tested | ✓ | ✓ | ✓ | – | ✓ | mock `todo` items appear in Needs your action |
| Team Chat › search, history, members, sounds, picture mark-up, voice | Not tested | Not tested | | | | | | covered by 1416–1451 tests; not repeated |
| Teacher › Schedule › 4 tabs, week strip | Pass | Mock-tested | ✓ | **✗ → fixed** | ✓ | ✓ scroll and open folds kept | ✓ | D4: finished classes listed after upcoming ones without a status → "Ended" chip |
| Schedule › Leave card, Request leave | Pass | Partly | ✓ | ✓ | ✓ | – | **✗ → fixed** | D6 "President"; `tLeaveClasses` not in fixture → "Could not check your schedule" (Blocked) |
| Schedule › My open times | Blocked | Blocked | | | | | | `tAvail` not in fixture |
| Teacher › Students › search, filters, cards | Pass | Mock-tested | ✓ | ✓ | ✓ | ✓ search kept while typing | ✓ | Chinese student names are data (kept) |
| Students › Trials & sub classes | Pass | Mock-tested | ✓ | ✓ | ✓ | – | ✓ | D8 dates "10-24" → "24 Oct" |
| Students › student page | Pass | Mock-tested | ✓ | ✓ | ✓ | – | ✓ | `coe-cj` not in fixture (journey card empty) |
| Students › Monthly feedback form | Pass | Partly | ✓ | see note | ✓ | ✓ (device draft) | **✗ → fixed** | D9 Chinese labels; D8 due date; "September 2026 classes" is the fixture's old month key (2026-10 = Sep under the 1220 rule) — **not** a live defect |
| Students › Trial report form | Pass | Partly | ✓ | ✓ | ✓ | – | **✗ → fixed** | D9 学员类型; D8 date |
| Students › Progress check form | Blocked | Blocked | | | | | | `tPcForm` not in fixture |
| Teacher › Books | Pass | Not tested | ✓ | ✓ | ✓ | – | ✓ | |
| Teacher › Notices & requests › list, tiles, filters | Pass | Mock-tested | ✓ | **✗ → fixed** | ✓ | ✓ | ✓ | D7 "Reply needed" vs Today "needs your acknowledgement" |
| Notices › thread sheet (Got it) | Pass | Partly | ✓ | ✓ | ✓ | – | ✓ | D8 "10/25 11:10" → "25 Oct 11:10" (shared formatter, fixed by 1471) |
| Notices › New message | Pass | Not tested (send) | ✓ | ✓ | ✓ | – | **✗ → fixed** | D6 "President only" |
| Teacher › Activity log, Copy as proof | Pass | Mock-tested | ✓ | ✓ | ✓ | ✓ | ✓ | proof text has no pay rate or phone number (code read) |
| Teacher › Growth | Pass | Not tested | ✓ | ✓ | ✓ | – | ✓ | `coe-growth` mocked "off" → Google copy path |
| Teacher › QA feedback | Pass | Not tested | ✓ | ✓ | ✓ | – | ✓ | |
| Teacher › Trainings | Pass | Not tested | ✓ | ✓ | ✓ | – | ✓ | |
| Teacher › Pay › all sections | Pass | Partly | ✓ | **✗ → fixed** | ✓ | – | ✓ own pay only | D3: Pay says "Late to class", Today said "Late time-in" |
| Pay › This is correct / Something's wrong | Pass | Not tested (save) | ✓ | ✓ | ✓ | – | ✓ | |
| Teacher › My Contract | Pass | Not tested (sign) | ✓ | ✓ | ✓ | – | **✗ → fixed** | D6 "waiting for the President" |
| Teacher › More (phone) | Pass | – | ✓ | ✓ | ✓ | – | ✓ | |
| Phone bottom bar | **Fail → fixed** | – | – | – | ✓ | – | – | D10: Notices tab had no label below 900 px |
| Laptop side menu | Pass (minor) | – | ✓ | ✓ | ✓ | – | ✓ | D11 two-line "Notices & requests" centred → left |
| Keyboard (1366) | Pass | Tested | | | | | | visible focus ring on header, cards, queue; Esc closes sheets; focus fell to BODY once while a card re-rendered (S5) |
| Emojis in app text (all teacher views + sheets) | **Fail → fixed** | – | | | | | | emoji scan: 🎬 🔔 📚 💬 ✨ ⚠ ⛔ in app text → line icons (1482); scan after: none |
| "President" visible to teachers | **Fail → fixed** | – | | | | | ✗ | leave sheet, leave status, New message, My Contract (1481) |

Counts: 48 rows · Pass 34 · Fail → fixed 8 (+ status/role fixes inside Pass rows) · Blocked 5 · Not tested 4 (+ "Not tested" workflows for saves the preview cannot check).

## 3. Confirmed defects

| # | Severity | Where | Steps | Fix |
|---|---|---|---|---|
| D1 | High (interrupts a live class) | Today | Open the app during a class with an addendum to sign → the signing sheet opens by itself at ~6 s (its first openSheet is an empty shell, which the 1107 class-time hold lets through) | **1480**: waits while a class is running or another sheet is open; opens when the class ends (tested) |
| D2 | Medium (status disagrees; teacher may re-upload) | Today › class card, Needs your action, Completed today vs My class videos | Video found in the folder (My class videos ✓) but no app upload record → card "Upload the class video", queue "Video not done yet" | **1480**: a folder-found video (coe_vid_mine, same student code and start time, file link) counts on the card; the After class row and "with something to finish" clear (tested) |
| D3 | Medium (wrong label) | Today line + queue vs Pay | A late "I'm in" shows "Late time-in pending review" on Today, "Late to class" on Pay | **1480**: Today says "Late to class pending review" (or time-in / both); chip "Late" |
| D4 | Low | Schedule › today | Finished classes are listed after the upcoming and cancelled ones with no status | **1480**: "Ended" chip (the class-status word from 1500) |
| D5 | Medium (phone) | Today › class card | At 390 the line "ST-… · phone · Edit ID" is cut; Edit ID is unreachable | **1482**: wraps on phones; taller tap areas for inline links |
| D6 | Medium (privacy rule) | Request leave, leave status, New message, My Contract | Teacher sees "the President approves", "Waiting for the President", "President only", "waiting for the President", "Countersigned by the President" | Fixed by the President QA release **1460–1466** (shipped first, same evening) except the contract step, which **1481** changes to "Countersigned by management" for teachers |
| D7 | Medium (status) | Notices & requests | The same notice: Today "needs your acknowledgement", Notices "Reply needed" / "waiting for your reply" | **1481**: "Needs acknowledgement" / "to acknowledge" |
| D8 | Low | Queue rows, Trials & sub, feedback / trial headers, message times | Raw dates 2026-10-24, 10-24, due 2026-11-05, 10/25 11:10 | **1481**: "24 Oct", "due 5 Nov"; message times "25 Oct 11:10" were fixed in the shared formatter by Operations' 1471 the same hour, so 1481 does not touch it |
| D9 | Low (English only) | Monthly feedback, Trial report | 听力 口语 … 学员类型 beside English headings | **1481**: hidden on teacher screens; the parent report is unchanged |
| D10 | Medium (phone nav) | Bottom bar < 900 px | Notices & requests tab shows only an icon and a badge | **1482**: label "Notices" |
| D11 | Low | Laptop side menu | "Notices & requests" wraps centred | **1482**: left-aligned |
| D12 | Low (design rule) | Today, sheets | Emojis in the app's own text | **1482**: line icons |
| D13 | **High** (real complaint, blocks homework) | Homework sheet and class note homework box | Student changed book (Phyllis LongVowels → OD1); "page 3" → red "Pages go back · next is p. 38"; second Save sends a flag | **1483 (live)**: pages compared only within the same book; amber Check the pages · Change it / Keep it; one flag per homework. Details: `server/CHANGES-2026-10-28-homework-pages.md` |
| D14 | Medium (duplicate submission) | Homework flags | 3 of 4 flags in S-HW-FLAGS saved twice 0.5–5 s apart (double Save while the check read history) | **1483**: Save cannot run twice during the check; one flag per homework. Old duplicate rows are only in the Google sheet (not changed) |

## 4. Suggestions (not changed — need a decision)

- **S1 · One item, one row (P1).** → **Done in 1485** (see `CHANGES-2026-10-28-teacher-steady.md`: the After class row is primary and lists Homework; the separate homework row is dropped from the list; My class videos folds its per-class lines under Details; Completed today and the warning box kept, with reasons). Original note: The Warning box (management's comments) and Needs your action can show the same item twice (e.g. a video check "Camera off" is in the Warning list and as "Video check · Explain"); Mia's 13:00 class shows in My class videos, Homework row, After class row and Completed today. Proposal: keep Needs your action primary; fold the Warning box into one red row ("Management's comments · 1 issue · Send your plan") and let My class videos link to the class card instead of repeating its own ✗ line. Keeps every action.
- **S2 · Team Chat placement on phones (P3).** Team Chat is under More on phones (laptop: last in the menu). Mentions do reach Today rows, so nothing is lost, but a direct tab would make replies between classes faster. Would replace Pay in the bar (Pay moves to More) — Misty's call.
- **S3 · "Messages" sheet title** inside Notices & requests could read "Notices & requests" (screen name).
- **S4 · Queue count settles late.** → **Done in 1485** (rows and count hold still once Today has settled; later items wait behind a "+N new" chip). Original note: 17 → 22 rows about 15 s after opening while Team Chat and the done-lists answer; rows are inserted above existing ones. A short "Checking Team Chat…" hint or appending late rows would avoid the list moving.
- **S5 · Keyboard.** → **Guard in 1486** (focus returns to the same control after a Today redraw; the loss was not reproduced in the preview). Original note: Once, focus fell back to the page while a class card re-rendered (1 s timer); low impact.
- **S6 · Phone Today moves once after a refresh (pre-existing).** → **Done in 1484** together with the header and arrangement causes (teacher stability 32/32 stable on the same load where main moved on 7 of 32). Original note: A late banner (notice / warning) is inserted above Now & next about 3.5 s after a refresh (CLS 0.08–0.09, intermittent). Fix idea: paint the banners from the saved copy on the first draw, or insert late banners below the class card. Not changed in this round.
- Chinese student names on cards are data and stay.

## 5. Releases

| Release | What | Rollback |
|---|---|---|
| 1480 `patches/1480-teacher-calm-status.js` | D1 D2 D3 D4 | `rollback-pre-1480` (40989e2) · main c193719 · COE_V 1395 · CI and Pages deploy passed 13:10Z |
| 1481 `patches/1481-teacher-words-dates.js` | D6 D7 D8 D9 | (same branch) |
| 1482 `patches/1482-teacher-icons-touch.js` | D5 D10 D11 D12 | (same branch) |
| 1484–1486 `patches/1484-today-in-place.js` · `1485-queue-steady-one-place.js` · `1486-today-keep-focus.js` | phone flicker (header, Today order, banners, Pay punctuality) · S4 · S1 · S5 | `rollback-pre-1484` (9b53575) · main a0efd58 · COE_V 1418 · CI and Pages deploy passed 16:24Z |
| 1483 `patches/1483-homework-pages-same-book.js` (shipped first, priority) | D13 D14 | `rollback-pre-1483` (6b905d3) · main d70015d · COE_V 1381 |

Checks before release (latest main + 1480–1482): `check.js` all scripts OK; regress-saves 17/17; fix tests t1480 / t1481 pass; emoji scan 0; management sanity (Leave keeps "President" for management, Notices, no page errors); full stability (44 management + 16 teacher checks): management all stable except one schedule refresh 0.03 (not touched by these patches); teacher repeats clean except an intermittent **phone Today** shift (0.08–0.09, banner inserted above Now & next ~3.5 s after a refresh).
That phone Today shift is **pre-existing**: the same build without these patches but with the addendum pop-up switched off shows it too (1 of 3 runs, 0.089). Before 1480 the pop-up opened over Today during the class in the fixture and held Today's redraws, which hid it. See S6.
Final run on the newest main (after 1460–1466, 1490, 1495–1497): regress-saves 17/17; laptop teacher 8/8 stable; management Schedule / Leave / Contract stable, Notices 0.07 once (Overview Monitor card, not touched here). **Phone teacher screens move on the current main without these patches too** (baseline 21:01: Schedule 0.11, Trainings 0.07, Students 0.075, Leave 0.29; with the patches: Today 0.24, Growth 0.30, Pay 0.17, Trainings 0.08, Students 0.21 — late shifts 9–23 s after a refresh, sources tinNag / wrap / unnamed). The patches add no late-loading content on those screens. This needs its own flicker pass (see S6) — reported, not hidden.
Messages times: Operations' 1471 made the shared `msgAt` day-first at the same time, so 1481's own edit was dropped.

## 6. Remaining work

- Blocked in preview (needs fixture data or a test environment): Progress check form (`tPcForm`), My open times (`tAvail`), leave class check (`tLeaveClasses`), CEFR journey (`coe-cj`), video upload, speed test / screen share (time-in, Redo), sounds and phone notifications.
- Server-confirmed workflows (Got it, Acknowledge, homework, class note, feedback submit, leave send) were only mock-tested; a zztest teacher session on a writable test environment would close them.
- Suggestions S1–S5 await Misty.
- Data-sync: zzResync28 still pending (not a UI defect).
