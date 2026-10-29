# 29 Oct 2026 (evening) · Phone To do: the top sections no longer drop out after a refresh · release 1653 · 1652 paint gate held again

Rollback branch: `rollback-pre-1653` (= main 1484 just before this release). Nothing stored changed: no schema, data or Code.gs change.

## 1653 · To do merged redraw goes through the whole screen
**Symptom.** On the phone, about 1 refresh in 8, the two top sections (summary tiles and "Reports not sent") dropped down about 2 s
after a refresh: CLS 0.58–0.60, from `tdsum | td-reports`. It happened on main too.

**Reproduced.** The test reloaded phone To do with its saved copies kept, like a real refresh: 5 bad refreshes out of 32 (1 in 6.4) on 1484.

**The race.** 528 (21 Oct) merges To do redraws that come within 350 ms of each other. The merged redraw ran later on a timer, but it
called the copy of the screen that 528 had wrapped, so every step added after 528 was skipped on that one redraw.
- **What it skipped.** 891 "Today's focus under the title" and the Celebrate box (22667).
- **What happened on screen:**
  1. tdFocus placed Today's focus before Renewals, under the tiles and Reports.
  2. 300 ms later, 891's observer moved Today's focus back to the top.
  3. The tiles and Reports dropped down. That is the shift.
  4. Celebrate stayed missing until the next redraw.
- **When it happened.** Only when two answers (TODAY, renewals, trial follow-ups, data to fix, trial reports, agreements …) landed
  within 350 ms of each other, hence about 1 refresh in 8.

**Fix at the source.** The merged redraw now calls the whole screen (`window.renderMToday`, every step) once. While it runs, 528 lets it
straight through. The 350 ms merge and the "a tap redraws at once" rule are unchanged.

**After.** 0 bad refreshes out of 32 in the same test.

## 1652 paint gate · re-tested after 1626, held again (`patches/held/1652-paint-gate.js`)
**What changed in the gate.**
- Rebased onto 1484. 1111 stays on.
- In the second after a tap or key press, the gate lets every timer through untouched, so tapped screens behave exactly as before.

**Tap-to-paint.** Interleaved A/B test, base and gate alternating in the same run, CPU 1×, laptop, median ms:

| Screen | Base | Gate | Difference | Runs per side |
|---|---|---|---|---|
| Students | 660 | 667 | +7 | 15 |
| Chat | 112 | 116 | +4 | 15 |
| Student dialog | 262 | 234 | −28 | 15 |
| Teacher Students | 54 | 45 | −9 | 15 |
| Schedule | 313 | 244 | −69 | 9 |
| Trials | 122 | 110 | −12 | 9 |
| Payroll | 151 | 130 | −21 | 9 |
| Home | 82 | 72 | −10 | 9 |
| Teacher Today | 92 | 83 | −9 | 9 |
| Teacher Schedule | 90 | 79 | −11 | 9 |

No screen is slower by more than 20 ms at the median.

Earlier gate settings failed this test:
- 150 ms budget after taps: Schedule +86, Payroll +80.
- 16 ms budget after taps: Schedule +47.
- Running only the 1111 list after taps: Schedule +112.

**Same-data redraw** (4× CPU, 5 redraws, changes after first paint).
- Base 1484 is already at 0 on every screen except the Students list: 2 per redraw, the page height wobbling by 24 px far below the
  visible rows, the same with the gate.
- The gate did not lower anything. On teacher screens it showed 1–2 single changes in 8 redraws; the base showed the same kind once.
- The design agent's note was about 1101 button roles and chip marks after paint. They already run before paint through 1111 in these
  tests. One "Ending soon" chip mark came after paint once with the gate and never on the base.

**Cold / warm open traces** (1–6 s network, 4× CPU). These are single runs, mixed results, no clear gain:
- Student dialog, after-paint changes with no new data: cold 3 → 6, warm 1 → 0, reload 1 → 0.
- To do: cold 2 → 0.

**Decision.** There is no measured benefit on current main, and the gate is a change to timing across the whole app, so it stays held.
It is ready to ship if a live report shows finishers landing after paint on frames nobody tapped.

## Tests (1653 on 1484)
- `tools/check.js` passed: 503 scripts and 48 renewal checks.
- `tools/regress-saves.js` passed 17 of 17.
- `stability-check` on the phone:
  - To do: refresh 0.0003, ok.
  - Schedule: ok.
  - Trials: refresh 0.0222. The base is the same (0.0222, `seg | #text`) and it was there before.
