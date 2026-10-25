// 911: (audit 25 Oct, finding 5 — re-verified in phase 2) Time-ins › "Today's timeline": every dot, tick and class bar was still
// drawn at the same x (one column at the right of the time axis), even after patch 851.
// Root cause (CSS collision, not the scale): the Trainings screen adds a GLOBAL rule `.tr{max-width:760px;margin:0 auto}`
// (Trainings script, base l.~22708). The timeline track is `<div class="tr">` inside a grid row, so `margin:0 auto` made the
// grid item shrink to its content width — 0 px, because every mark inside is absolutely positioned. All `left:x%` values
// then resolve against a 0-px box → all marks at the same spot. Measured in the preview: track width 0 px in a 784 px column.
// Fix (display only): give the time-in track its full column back. Positions, scale, data and statuses are unchanged.
// The same collision also hits Leave (`#v-leave .lc55 .tr`, width 0) and Performance (`#v-perf .dm52 .tr`, width 0) — other
// groups' screens, reported to the lead, not changed here.
require('../tools/lib.js')(process.argv[2], [
  ["#v-team .tl11 .sx>div{min-width:var(--mw,0)}",
   "#v-team .tl11 .sx>div{min-width:var(--mw,0)}\n#v-team .tl11 .tr{max-width:none;margin:0;width:auto;justify-self:stretch}   /* 911: undo the Trainings .tr rule */"],
]);
