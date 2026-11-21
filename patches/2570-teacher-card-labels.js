// 2570 (audit QA-02, verified 21 Nov, Rose): the Teachers cards said "7 units · 3 students" next to pay for 9.5 units, while her
// detail said 9.5 units · 4 students. Units now = the units behind the pay (regular + sub + trial, coe_overview_core 2570), and the
// student count says what it counts: students with lessons left on her packages (not everyone taught this month).
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["${x.students} students · completion ${pct(x.done,x.sch)}", "${x.students} with lessons left · completion ${pct(x.done,x.sch)}"],
  ["<div class=\"tc2-f\"><span>${x.students} students</span>", "<div class=\"tc2-f\"><span title=\"Students with lessons left on this teacher's packages\">${x.students} with lessons left</span>"],
]);
