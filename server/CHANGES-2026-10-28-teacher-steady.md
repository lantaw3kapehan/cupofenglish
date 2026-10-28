# Teacher screens stay still · steady "Needs your action" · one place per class (1484–1486) · 28 Oct 2026

Follow-up to the teacher QA (`QA-2026-10-28-teacher.md`, S1, S4, S5, S6). The coordinator's order: phone flicker first, then S4, S5 and S1.

## Why phone screens moved 9–23 s after a refresh
Measured on the teacher preview at 390 px with the browser CPU slowed 6× (a busy phone), after a refresh with the saved copy, with every moved element named (layout-shift sources):
1. **Header (all screens, CLS ≈ 0.15).** The phone header hides the teacher's name once the teacher marker (`body.role-t`) and its rule are in place. Both came from late scripts, so the name showed first, the "I'm in" chip squeezed it onto 3 lines (header 64 → 98 px), then it vanished (98 → 64 px).
2. **Today drawn in two orders (CLS 0.15–0.53).** The app draws Today from the saved copy about 1.5 s after opening, while the page's ~450 finishing scripts are still loading. The arrangement (Now & next, Needs your action) ran on a 30 ms timer that every change restarted. While boxes kept arriving it never ran (25 s on the slow phone); then the whole page jumped.
3. **Banners above Now & next (S6).** Notice of breach and the management-comments warning were fetched after every refresh and inserted above the class card.
4. **The list itself.** Needs your action rebuilt as late data arrived (17 → 22 rows) and sorted new rows above the ones being read (S4).

## What changed
**1484 · draw in place**
- The teacher marker and its header rule are set as soon as the saved data says "teacher", so the header never grows and shrinks.
- The Today arrangers (1104 Now & next / Needs your action, 1105 saving states, 1106 the list) run in the same step as the change, before the screen paints. A loop guard falls back to a short timer.
- A teacher's warm open shows the steady loading card from 1320 (the one used on a first open) until the page has finished loading and Today has stopped changing. It needs 350 ms of quiet, lifts at most 2.2 s after that, and never stays longer than 12 s. Today is then drawn once more with every finishing pass in place. Management opens are unchanged.
- The notice of breach banner, the warning box and Punctuality (late time-ins) are drawn from the last copy on this device at once, per teacher, and updated in place. Punctuality is also drawn in the same step as Today and Pay. It used to arrive ~5 s after a refresh and push Pay down 400 px (phone CLS 0.34).
- Pay's two-column arrangement (1110) runs before the paint.

**1485 · steady list, one place per class**
- **S4:** once Today is on screen and the list has stopped changing for 5 s (at most 20 s after opening), rows keep their order and count. Anything later waits behind a "+N new" chip on the heading line; it is red when one of them is urgent. Tapping the chip, or coming back to Today from another screen, adds them in their proper place. A row that only drops out for a moment during a redraw keeps its place for 2.5 s; a row that is done leaves.
- **S1:** one class was in four places. The table shows what stays primary and how each action stays reachable.

| Where | Before | After | Access kept |
|---|---|---|---|
| Needs your action · After class row | "Mia Example · 13:00 class · Class note · Video not done yet" | **Primary:** "Homework · Class note · Video not done yet" | "Open class" goes to the class card at the first missing step (Given → Class note → Upload video) |
| Needs your action · Homework row | "1 class today not marked · Mia Example" | Not shown when an After class row lists the homework | The class card's Given / Add details, and the To do list |
| My class videos | heading + "✗ Mia · 13:00 · no video in the folder yet · checked 13:45" + found list | heading + "1 not found yet" + "Details · 1 in Needs your action" (folds when every missing video is already a row) | Details opens the folder-check lines and found files |
| Completed today | "2 with something to finish" | Unchanged: a count on the fold, not a task | the fold opens the cards |
| Warning box (management's comments) and "Video check · Explain" | both show the camera issue | Unchanged: different actions (send a follow-up plan vs explain one video) | both kept |

**1486 · keyboard focus**
- When focus was inside Today and Today redraws, the same control (same action and label) gets focus back before the screen paints, without scrolling. In the preview Ben's "Class brief" button kept focus across a redraw both before and after this change, so the original focus loss (seen once during a Tab pass) was not reproduced. 1486 is a guard.

## Checks
See the release section of `QA-2026-10-28-teacher.md` for stability numbers (main vs these patches, same load), regress-saves and the functional re-tests.

## Results (preview, synthetic teacher, same container load, interleaved runs)
| Check | main (before) | with 1484–1486 |
|---|---|---|
| Stability, 16 teacher screens × 2 runs (laptop 1440 + phone 390), 22:30 | 7 of 32 moved (Schedule 0.10, Growth 0.04, Trainings 0.07–0.41, Pay 0.38, Students 0.02) | **32 of 32 stable** |
| Same, newest main at 23:47 (after 1467–1469, 1540) | 3 of 16 moved (phone Pay 0.34, phone Notices 0.09, laptop Pay 0.034) | 1 of 16: laptop Pay 0.034, the same as main (the Total earned card is marked by a later script and changes column; left for a follow-up) |
| "first open" CLS (reported, not failed) | up to 0.56 | 0–0.015 |
| Phone Today, CPU slowed 6×, after a refresh | 0.28–0.67 | 0.006–0.08 (one run 0.022: two small banner/homework-box size changes 15–30 s later) |
| Time until Today is on screen (no CPU slowdown, fonts as in production) | raw 1.07 s, arranged 1.25 s | arranged 1.02 s |
| Management (mtoday, msgs, students, payroll, schedule; laptop + phone) | Payroll moves on main too (0.023–0.044, py-top / st830); Overview (mtoday) moved once on main (0.18) | same Payroll movement, Overview stable twice. These screens are not touched by these patches; reported to the management agents |
| regress-saves | 17/17 | 17/17 |
- S4 test: an urgent item injected after the list settled → heading "Needs your action 21 · +1 new", rows and order unchanged; tapping the chip → 22 rows, the urgent item first.
- S1 test: Mia's 13:00 class is one row "After class · Homework · Class note · Video not done yet"; the "1 class today not marked" row is gone; My class videos shows "Details · 1 in Needs your action".
- Earlier fixes re-checked on this build: 1480/1481 tests, homework page check (1483) cases A and B, emoji scan 0.
- Measurement note: the container's proxy refuses Google Fonts, which holds the page's scripts until the request fails. Comparisons were run on the same builds under the same conditions; the time-to-content row strips the font link, as on a teacher's phone where fonts load.
