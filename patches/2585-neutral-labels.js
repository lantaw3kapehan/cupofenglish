// 2585 (audit QA-15, verified 21 Nov): Teachers › Team map called zones "Carrying the team" and "Needs a talk"; Performance called a filter
// "Not complying". Labels now say what is measured: workload and calendar completion (held ÷ booked to date this month, cancellations by
// anyone count), and "Class records to review" (class record below 85% or late tags). Thresholds and numbers unchanged.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["zone(W - R - 6, Tp + 16, 'CARRYING THE TEAM', 'end') + zone(W - R - 6, H - B - 8, 'BUSY · CHECK COMPLETION', 'end') + zone(xa - 8, Tp + 16, 'ROOM TO TAKE MORE', 'end') + zone(xa - 8, H - B - 8, 'NEEDS A TALK', 'end');",
   "zone(W - R - 6, Tp + 16, 'HIGH WORKLOAD · 85%+ HELD', 'end') + zone(W - R - 6, H - B - 8, 'HIGH WORKLOAD · REVIEW COMPLETION', 'end') + zone(xa - 8, Tp + 16, 'ROOM FOR MORE CLASSES', 'end') + zone(xa - 8, H - B - 8, 'REVIEW COMPLETION', 'end');   /* 2585 */"],
  ["fill=\"#2D7E67\">goal 85%</text>';", "fill=\"#2D7E67\">goal 85% held</text>';"],
  ["<div class=\"mp43\"><div class=\"h\"><span>Team map · workload and completion</span><span>dot size = students · click a dot to open</span></div>",
   "<div class=\"mp43\"><div class=\"h\"><span>Team map · workload and calendar completion</span><span>completion = classes held ÷ classes booked up to now this month (cancellations by anyone count, also by parents) · dot size = students · click a dot to open</span></div>"],
  ["onclick=\"pfSet('comply')\">Not complying · ${T.filter(nonc).length}</button>", "onclick=\"pfSet('comply')\" title=\"Class record below 85% (on time, videos, homework, notes) or late tags\">Class records to review · ${T.filter(nonc).length}</button>"],
  ["none: 'Not evaluated', comply: 'Not complying' }", "none: 'Not evaluated', comply: 'Class records to review' }"],
]);
