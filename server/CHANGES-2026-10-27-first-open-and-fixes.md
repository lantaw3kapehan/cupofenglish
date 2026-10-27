# 27 Oct 2026 · First open without moving · small fixes (COE_V 1321 · rollback-pre-1320 · commit 8987eb4)

Misty 12:35 (backlog 4 + 5): "yes go ahead and do all".

## 1320 · First open on a device
The very first open on a device (new phone/laptop, or right after signing in — nothing saved yet) showed the screen building
itself for 1–2 s: start-up layout → header changing size once the app knew it was management → Overview boxes → the screen asked
for. Now that first open shows one steady loading card (logo + grey lines, fixed in place, "Loading your screen…") while the
screen is built underneath, and shows the finished screen at once when it has been quiet for 0.35 s (at most 2.2 s after the
start data arrives; never longer than 12 s if offline). Hooked into skeleton(), which every first open calls (start-up with no
device copy, and both sign-in paths). Every later open and refresh is unchanged (the device copy is shown at once).

First-open layout shift (preview, Google simulated fast; average per group, limit 0.02):
| group | before | after |
|---|---|---|
| management laptop (12 screens) | 0.051 | 0.001 |
| management phone (12 screens) | 0.300 | 0.017–0.019 |
| teacher laptop (8 screens) | 0.042 | 0.002–0.003 |
| teacher phone (8 screens) | 0.089 | 0.000 |
Refresh / open: unchanged versus live (same screens flagged on both builds in the same conditions — noise from shared CPU).

## 1321 · Small fixes
- Parent picture report: the student's name line was 1.15 high; a Chinese name (e.g. 佐伊) drawn in the CJK fallback font is
  taller than Fredoka One and lost a few pixels at the bottom. Name line 1.32 with a little room below (picture ~13 px taller).
- Monitor › Time-ins "Needs a look": after a redo turns a weak internet result good, the count updates at once
  ("0 teachers · … · 1 re-checked OK") and that row is dimmed, instead of waiting for the next redraw.

Not tested: real devices (font metrics, real network timings); the 佐伊 clip itself could not be reproduced offline (web fonts
blocked in the test browser) — the fix gives the line the room it needs.
