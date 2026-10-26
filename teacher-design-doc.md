# 26 Oct 2026 · Teacher screens — laptop first (releases 1103–1114, COE_V 1281)

Requests: Misty 11:59 ("teacher's access login for their screen design") and 12:00 (laptop first; Today = the teacher's main workspace; reliable completion; calm; split-screen usable). Follow-up: "continue with the unfinished stages" (D–G).

| Stage | Release | Rollback branch | Commit → build |
|---|---|---|---|
| A · layout + overlay + sign-in | `patches/1103-teacher-layout-login.js` | `rollback-pre-1103` (COE_V 1256) | 126e6a7 → 7440ae7 (COE_V 1258) |
| B · Today workspace | `patches/1104-teacher-today-workspace.js` | `rollback-pre-1104` (1258) | fa4c9f8 → 6280e8b (COE_V 1259) |
| C · saving / failed states | `patches/1105-teacher-today-saving-states.js` | `rollback-pre-1105` (1259) | f02272a → 73c0c8f (COE_V 1260) |
| D + E · management messages + one pending queue | `patches/1106-teacher-one-queue-messages.js` | `rollback-pre-1106` (1260) | aa42e6e → 6df1d80 (COE_V 1261) |
| F · calm during a lesson | `patches/1107-teacher-calm-lesson.js` | `rollback-pre-1107` (1261) | 87b3c75 → 984aa7b (COE_V 1262) |
| G · per-screen laptop pass | `patches/1108-teacher-laptop-screens.js` | `rollback-pre-1108` (1262) | 8ff4836 → ede07c3 (COE_V 1263) |
| Growth numbers say what they count | `patches/1109-growth-numbers-wording.js` | `rollback-pre-1109` (1263) | a5b1fb0 → 14cc7da (COE_V 1264) |
| Pay in two columns on wide laptops | `patches/1110-teacher-pay-two-columns.js` | `rollback-pre-1110` (1264) | 3574bbd → 8f781a1 (COE_V 1265) |
| No flicker (shared, management + teachers) | `patches/1111-no-flicker-settle.js` | `rollback-pre-1111` (1273) | f197504 → 2feb32f (COE_V 1274) |
| Teacher sidebar, emojis, queue labels, one primary | `patches/1112-teacher-sidebar-tidy.js` | `rollback-pre-1112` (1274) | 51fc095 → 62e213a (COE_V 1275) |
| Queue title/detail lines | `patches/1113-queue-title-lines.js` | `rollback-pre-1113` | 33a206c → COE_V 1278 |
| Excellence link readable | `patches/1114-excellence-link-readable.js` | `rollback-pre-1114` (1280) | 59a4981 → COE_V 1281 |

## Stage A (1103)
- **Narrow-window overlay fixed (the real bug):** below 900 px wide (split screen, half a laptop, phones) the Excellence card was inserted INTO the bottom navigation bar, which grew to ~400 px and covered half the screen. The card now goes in the side menu only when the side menu exists (≥ 900 px); on narrow windows the short Excellence chip shows in the header (ellipsis, no overflow).
- **Laptop side menu:** scrollable, compact on short screens (≤ 800 px high), Excellence card slimmed to a summary (medal, level, place, score) so it does not push the menu; full card stays in Growth.
- **Sign-in (everyone):** visible labels (Email (Gmail), Password, Code from the email, New password), Teacher / Management choice with colour + outline + ✓, one solid teal Sign in, Show / Hide password button, 48 px fields, visible focus. Same ids, same sign-in code, nothing different sent.
- Contrast safety net now re-checks small links that the older contrast pass (1007) had recoloured on tinted boxes.

## Stage B (1104) · Today order
1. Greeting, then urgent only (notice of breach, management comments that need action).
2. **Now & next:** the class happening now and the next class (side by side on laptops) — their own cards moved up, with "Now · ends 14:05" / "Next · 16:00 · in 2 h 10 min". Cards keep everything (time, length, student, book, last lesson → next, I'm in, Class brief, Class note, Book, homework, video, drag-and-drop upload).
3. **Needs your action:** late time-in review, signatures, "Management is waiting", video checks, my class videos.
4. The day at a glance, then "Rest of today" (earlier classes keep their unfinished checklist), time-in, to-do list.

## Stage C (1105) · reliable completion (display only)
- Homework "Given": "Homework · saving…" until the server answers; ✓ only after a confirmed save; if the server says no / cannot be reached the chip stays red "Homework · not saved — tap to retry".
- Time-in kept as pending shows "In · saving…".
- Class notes already keep the draft on the device; video uploads already keep the class pending with "Class video not uploaded · reason" — verified, unchanged.

## Stage D + E (1106) · one pending queue, management messages on Today
- **One list under "Needs your action"**, de-duplicated, ordered by urgency then deadline (overdue → today → within N days → dated): late time-in reviews, messages from management, signatures, "Management is waiting" items, the To do list, video checks. Each row: what it is · state · due · one button. First row is the solid teal action; 6 rows shown, then "Show all N". The separate boxes it replaces are hidden (not deleted) while the queue is on; the side To do is hidden on Today only.
- **Management messages:** action-required (needs acknowledgement) rank above announcements. States kept apart: "Unread · needs your acknowledgement" → "Read · not acknowledged yet" → "Acknowledging…" → removed only after the server confirms the acknowledgement. Unread announcements show as "New · unread" and leave the queue once opened. The full thread stays in Messages; acknowledgement rules and notification settings unchanged.
- An item leaves the queue only when the app's own data says it is done (server-confirmed); failed actions stay with their retry.

## Stage F (1107) · calm during a lesson
- While a class is running (start ≤ now < end, not cancelled): non-class notifications (to-do reminders, messages, pay/leave updates), the message chime and dialogs that open by themselves (no tap/key in the last 30 s) are held.
- Always shown at once: class reminders (starting now / next class / time-in), class cancelled, "not saved" problems, notices of breach, and anything the teacher opens herself.
- After the class: one notification "While you were teaching · N updates" + a short message in the app, the chime once, then held dialogs one at a time (oldest first). If notifications or sounds are off in settings, nothing extra is shown.

## Stage G (1108) · per-screen laptop pass
Checked at 1440×900, 1366×768, 1280×720, 125 % (1152×720 / 1093×614), 1000, 683 and phone 390/360: Schedule, Students list, student page, Growth, Pay (incl. Punctuality / time-ins), Activity log, Monthly feedback form, Trainings, Books, QA feedback, Messages, My Contract.
- Already fit on laptop after 1101–1107 (no change needed): Schedule (week strip + day lists), Students (2-column cards), student page (header, tabs, calendars side by side), Growth, Pay, Trainings roadmap, Messages.
- Monthly feedback form: already one clear flow — class notes summary, then each skill section with its own "0 / 10" progress, a sticky Total "0 / 100" and a single "Send feedback" button that stays visible. No change.
- **Changed — Activity log:** was limited to a 760 px column on laptop (half the screen empty, ~2 screens of scrolling for one day). Now uses the width: what was saved + saved/not saved on the left, device / place / reference on the right; a normal-width "Copy as proof" button. A typical day fits on one laptop screen. Phone and the management pop-up unchanged. Display only.

## Tests (preview, fake writes, production untouched)
- 17 teacher screens at 1440×900, 1366×768, 1280×720, 1152×720, 1093×614, 1000×700, 683×768, 390×844, 360×780 after every stage: contrast AA failures 0, page errors 0, sideways scroll 0. Management sanity (132 screens, 1366 + 390): 0 / 0 / 0 (one phone run showed a transient contrast flake from 1-second re-renders; re-runs of both the old and new build were clean).
- Back-to-back sequence (Ben now, Mia earlier, Zoe next): drafts survive switching students; note sheet names the student and code; slow server → "saving…" then ✓ only after confirmation; failure → "not saved — tap to retry"; failed upload → video stays pending with the failure pill.
- Messages: unread → read-not-acknowledged → acknowledging → acknowledged and removed (server confirmation).
- Calm: non-urgent notification/dialog held during Ben's class; urgent and teacher-opened shown; after the class, summary + oldest held dialog.
- Speed: teacher tour long-task totals within noise of the 1256 base (e.g. 242 vs 248 ms for 1262 vs 1263).
- Live: 1260, 1262 confirmed on app.cupofenglishatph.com (markers for 1103–1107 present). 1263 checked after the build propagates.

## 1109 · Growth numbers vs Students / Pay (Misty 14:05) — findings and fix
What each number counted (server code `growth_()` / `perf_()` in Code.gs, edge function `coe` T-DASH reader, app code), checked against real data read-only on 26 Oct:
- **Growth "classes this month"** = T-DASH CURRENT REG + TRIAL + SUB **lesson units** (a 25-min class = ½ unit), from a Growth copy cached up to 6 h. **Pay** = the same T-DASH columns, live (D.me.nowReg/nowTrial/nowSub). So they count the same thing; Growth was mislabelled ("classes") and could lag.
  Real data: April — 134 classes taught in October = 73 units (Reg 71.5 · Trial 1 · Sub 0.5); Pay 73, Growth showed 70 (cached copy of 25 Oct). Dezza — 96 classes = 54.5 units; Pay 54.5, Growth 53.
- **Growth "monthly feedback written"** = rows in **PR-DATA = progress checks**, by check date, this calendar month — not monthly feedback. **Students "Written / To write"** = monthly feedback for the current cycle (key = due month: 2026-11 = October classes, due 9 Nov), from FEEDBACK DATA + app submissions (tFbStatus).
  Real data: Growth April 1, Mayi 3, Julia 3, Dezza 0 = exactly their October PR-DATA progress checks; monthly feedback for October classes: April 0 of 22, Dezza 0 of 19.
- The sample-data mismatch (48 vs 53) was the preview fixture only; on real data both come from T-DASH.
Fix (display only, no server or record change):
- Teacher Growth tile → **"lesson units this month"** with the same number as Pay (live copy) and "Regular · Trial · Sub · same as Pay".
- Teacher Growth tile → **"monthly feedback written · N of M · October classes · due …"** from the same list as Students, with "· N progress checks this month" under it. Without that list (management's view of a teacher) it is labelled **"progress checks this month"**.
- Management Performance list: "N units this month" (was "classes"), column "Progress checks" (was "Feedback").
- Note: Growth "September" comparisons show 0 for time-ins / progress checks because the sheets the server reads only start in October — not changed.

## 1110 · Pay in two columns (≥ 1200 px)
- Left: last month's pay to check (This is correct / Something's wrong) · October estimate (units, bonus, deductions, Regular · Trial · Sub) · what is left before October pay is released · Punctuality.
- Right: total earned · pay history (payslips) · bonuses & deductions.
- Below 1200 px (125 % zoom, split screen, phone) one column exactly as before. Same cards and buttons moved, nothing recalculated.

## Tests 1109–1110
- 17 teacher screens × 9 sizes and 132 management screens × 2: contrast 0, errors 0, sideways scroll 0. Sequence / messages / calm regression clean. Speed within noise.

## 1111 · No flicker (Misty 14:20)
Measured live (Misty's management session, screens opened with the app's own navigation, nothing typed or saved): each screen was drawn, painted, then finished 60–700 ms later by ~40 "finishing passes" on timers (contrast colours, button styles x1101-sec, number alignment n991, chart axis/hint, tab arrows, Excellence wrapper). Each data refresh repeated that, so screens visibly changed after opening (Finance height 1507 ↔ 1534 px, chart axis appearing/disappearing, buttons fading from solid to outline).
Fix (presentation only): finishing passes that are triggered by a screen change and wait ≤ 800 ms now run in the same step, before the browser paints (only named finishing passes; each at most 3× per step; 150 ms per step and 400 ms/s budgets, then back to their own timers). Amount-column scan also re-runs on content changes. Finance chart: axis/hint step now handles every chart and uses its own done-mark (the contrast pass's data-c1007="0" made it skip — the real cause of the disappearing axis). Button/colour transitions are off for 350 ms while a screen is finished. Career ladder current rank uses the darker teal from the start (AA).
Result (preview, 600 ms server delay, screencast of 3 s after opening): visible changes after first paint 25 → 9 across 8 management screens (Pay run, Money, Payroll 0; mtoday buttons 2 → 0; Finance 6 → 1; Overview 3–7 → 1); remaining ones are data arriving and preview-only error toasts. Total CPU over a 10-screen tour unchanged (6.2–6.8 s vs 6.5–6.9 s); work moves before paint, so the longest single step is ~0.1 s (teacher) / ~0.3 s (management). The rest of the flicker work continues in a separate fork (1170–1179).

## 1112–1113 · Misty 15:52 ("I still see these")
- Laptop side menu (≥ 900 px): no category headings. Today · Schedule · Students · Books · Messages — divider — Growth · QA feedback · Trainings · Pay · My Contract · Activity log. Same buttons (routes, badges, clicks unchanged), only order/headings; phone bottom bar unchanged. **Trainings** sits with Growth/QA (career), **Activity log** at the end of the second group (records, next to Pay/Contract).
- Students badge = "to do now (feedback or trial report)" (the app's own count): visible "3 to do" under Students + aria-label/tooltip with the full text.
- Excellence: one compact line linking to Growth (score · level or "Not ranked yet" · #place · month); fits at 2000×1100, 1366×768, 1280×720, 1093×614 without scrolling the menu.
- "Needs your action": chip text no longer leaks into titles ("!FeedbackOctober…", "◷Pay release4…"), title and detail are separate lines, chip labels drop leading symbols/emoji. Checked every row type in the queue.
- Emojis → text/1120 icons: 🥇🥈🥉 → #1 #2 #3 (Top 3) and "1st place"; 🌱 → "—"; 📷 Teaching setup check → camera icon; 🏆/🥇 on Excellence cards → target icon; ✨ ⭐ 🏆 🥇 removed from Excellence messages. Parent/WeChat message templates untouched.
- Class card: when Time in / I'm in is solid, Class brief is outline (one primary per card).
- Tests: 17 teacher screens at 2000×1100, 1440, 1366, 1280×720, 1152×720, 1093×614, 683, 390, 360 and 132 management screens: contrast 0, errors 0, sideways scroll 0; sequence/messages/calm regression clean.

## 1114 · Excellence link readable (Misty 16:31)
- Two lines, no ellipsis: "Bronze · 74.3" / "#5 · Oct so far" next to the level-coloured coin; not ranked: "Not ranked yet" / "Oct · needs 20 h to rank". Checked Bronze, Silver, Gold, not ranked at 2000×1100, 1440×900, 1366×768, 1280×720, 1093×614: nothing cut, the side menu does not scroll.
- The hover box ("Teacher Excellence · tap for details") is removed. The full text is the aria-label, and Enter/Space opens Growth.

## Still open
- Remaining flicker work and the stuck-reminders audit run in separate forks (1170–1179, 1180–1189).
