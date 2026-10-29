# 29 Oct 2026 · Flicker after redraws ("shows old then new"): 1651 shipped, 1650 paint gate held

Misty's report at 11:57 was about student Abby (ST-2026-105). The "Class notice" button showed filled teal, then turned outline, and the
Overview numbers flickered on refresh.

- **What shipped:** 1651, which makes corrected colours appear from the first frame.
- **What is held:** 1650, the app-wide paint gate. It is in `patches/held/` and is not applied.
- **Nothing stored was changed:** no schema change, no data write, no Code.gs change.
- **Rollback branch:** `rollback-pre-1650`, which is main (1473) just before this release.

## The cause (measured with frame-by-frame traces at 4× CPU, network answers delayed 1–6 s)
1. **Finishers run after the paint.** About 100 small "finisher" passes (MutationObservers) restyle buttons, add icons, fold the toolbar
   and fix colours after a screen is drawn. Most wait **60–700 ms on a timer**. The plain screen is painted first and the finished one
   later.
   - The older gate (1111) moves some of them before the paint, but only a list of names, 3 per task, and up to 150 ms per task.
   - "Wait until nothing changes for 120 ms" finishers are starved while data keeps arriving. One student open made thousands of
     `clearTimeout` calls, and Class notice stayed raw teal for 3–7 s on the warm path.
2. **Contrast fixes land late.** The safety nets (1007 `contrast()`, 1101 `fixText`) darken text that misses AA after the paint, and
   every redraw paints the original colour again. This hit "Active", "lessons left · CEFR · latest /100", teal links, "▲ vs Sep" and the
   next-class line. They are heavy passes: 150–450 ms per frame at 4× CPU.
3. **Class notice specifically** was cause 1. Since 1596 (Students agent), the template draws it as `btn sm teal x1101-sec`, its final
   outline style. 1596 also skips redrawing when the refreshed data is unchanged. I verified in the traces that the first painted frame is
   outline.

## 1651 · contrast colours from the first frame (`<script id="l1651">`, shipped)
- **What it remembers.** When 1007 or 1101 darkens a text colour, the same colour is kept as a style rule for that place: the element's
  tag and classes plus 3 parents. If the element has its own `style`, such as a per-student avatar colour, only that exact style matches.
- **Effect.** The next drawing is painted in the final colour, and the safety net has nothing left to change.
- **Limits.** The rules last for this session only, so a new release never meets old rules. A place that would need two colours has its
  rule dropped, and the safety net works element by element as before. At most 400 rules.
- **Cost.** It adds no timers and no work before the paint, only one style sheet.

## 1650 · paint gate (held, `patches/held/1650-paint-gate.js`)
**What it does.** It is the first script in `<head>`.
- **Which timers it moves.** Any timer of 800 ms or less started by an observer is a finisher.
- **When finishers run.** Just before the next paint, quickest first.
- **Fallback.** Each finisher keeps its real timer as a fallback.
- **Caps.** Per frame there are at most 25 rounds, 4 runs of the same observer and 150 ms, or 16 ms in the second after a tap. More than
  400 ms in one second sends all finishers back to their timers for 2 s. One `gate:cap` row per load goes to `coe_speed`.
- **1111 stands down.**

**Unit checks.** It passed 9 of 9, and a loop test with three observers retriggering each other, each finisher costing 30 ms: the page
kept drawing about 50 frames a second.

**Why it is held.**
- **Tap-to-paint.** It could not be shown to stay within 20 ms. With the 150 ms budget, Students was +304 ms, Payroll +113 ms and
  Schedule +53 ms against the base. With a 16 ms budget after a tap, Schedule was +158 ms and Home +24 ms in one run. On this test
  machine (2 CPUs, other agents running) the same base build varies by ±300 ms between runs at N = 3, so the numbers are not conclusive
  either way.
- **Stability check.** Home (refresh 0.17) and teacher Today (0.034) moved once; a re-run passed. That is flaky, but it was not clean.

**To ship it later.** Run an interleaved A/B tap-to-paint test (base and gate alternating in the same run, N ≥ 9). Make the heavy
contrast passes check only new elements, so they fit before paint. Then re-number it into `patches/`.

## Measured: same-data redraw (the moment a background refresh arrives with unchanged data)
The screen's own draw function is called again with the same data, 5 times on laptop and 3 times on phone. Each frame just before paint is
snapshotted: visible boxes, colours, text and opacity. The counts are frames that changed after the redraw's first paint. Target 0.

| Screen (laptop, 4× CPU, 5 redraws) | Base 1473 | + 1651 (shipped) | + 1650 + 1651 (held) |
|---|---|---|---|
| Home | 0 | 0 | 0 |
| Students list | 5 | 8 | 0 |
| Schedule | 0 | 0 | 0 |
| Trials | 0 | 0 | 0 |
| Payroll | 5 | 0 | 0 |
| Team Chat | 0 | 0 | 0 |
| Student dialog | 1 | 1 | 0 |
| Teacher Today | 0 | 0 | 0 |
| Teacher Schedule | 0 | 0 | 0 |
| Teacher Students | 0 | 0 | 3 |

- **Students list.** Every counted change on this row is the page height changing by 24 px far below the visible rows (y ≈ 24 600, off
  screen). It is not a visible flash, and it was there before.
- **Payroll.** The 5 → 0 is the "▲ vs Sep" colour flick that 1651 removes.
- **Phone, 4× CPU, 3 redraws.** Base 0 of 30, with both patches 1 of 30.

**Student dialog, cold and warm open with 1–6 s network.**
- Before 1596, the warm re-open went teal → outline → teal → outline.
- With 1596 and 1651 the button is outline from the first frame.
- The kpi labels keep their final colour on later redraws.
- The only skeleton bars left appear on a cold open, in the Status note (1595) and in the hidden Progress tab.
- No fade or entry animation replays on the Overview stat tiles.

## Tests (1651 on 1473)
- `node tools/check.js` passed: 497 scripts and 48 renewal checks.
- `node tools/regress-saves.js` passed 17 of 17.
- `tools/stability-check.js` on laptop for the listed screens (Home, Students, Students list, Schedule, Trials, Payroll, Chat, teacher
  Today / Schedule / Students / Chat): all stable except Payroll refresh 0.0335.
  - Payroll is the same as the base, 0.0335, from `py-top`/`k824`/`py-cap`, and was there before.
  - The full 60-check run did not finish within the time limit on this machine.
- Tap-to-paint, N = 3, CPU 1×: 1651 compared with base is within noise. Schedule 562 vs 474 and Students 1618 vs 1436, but the same
  base measured 1267–1778 on Students across runs. 1651 adds no work before paint.

## Follow-ups
1. **1650 paint gate.** It needs the interleaved tap-to-paint test above, and cheaper contrast passes, before it is renumbered and shipped.
2. **Full traces.** Re-run the full cold-open and warm-open frame traces for every listed screen (base against release) with 1–6 s
   network and 4× CPU. Single runs take 30–60 minutes here, and the cold path varies too much between runs to compare without repeats.
3. **Layout shift on refresh.** Payroll refresh CLS 0.0335 (`py-top`/`k824`), Home warm-open CLS 0.07–0.39 and Students list warm-open CLS
   about 1.1 all come from data arriving under the start cover. This is separate from the flashes.
4. **Teacher Students avatars.** Their letter colours, with per-student inline colours, are fixed after paint on the first draw of each
   avatar.
