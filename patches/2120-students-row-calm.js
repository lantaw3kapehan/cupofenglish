// 2120 (12 Nov audit · Misty: "clean, simple, minimal"): Students rows.
// · "✓ Agreement ✓" showed two ticks (the green chip already adds one): now "✓ Agreement".
// · The week column's second line "= 0.5 lesson units a week" is now "0.5 units" (the line above the list explains units).
// · The explanation line above the list is shorter.
// · "No check in 30+ days" (213 of 223 students; progress checks are rare) is taken out of More filters.
const lib = require("../tools/lib.js"), file = process.argv[2];
lib(file, [
  [`'<span class="chip green" style="font-size:11px">Agreement ✓</span>'`, `'<span class="chip green" style="font-size:11px">Agreement</span>'`],
  ["${w.cw ? '= ' : ''}${w.v} lesson unit${w.v === 1 ? '' : 's'} a week</small>", "${w.v} unit${w.v === 1 ? '' : 's'}</small>"],
  ["'<b>A week:</b> classes = the scheduled sessions · lesson units = what the package counts (1 unit = 50 min, so a 25-min class uses 0.5)'",
   "'<b>A week:</b> classes booked, and the lesson units they use (1 unit = 50 min, so a 25-min class is 0.5).'"],
  ["['agr', 'No agreement'], ['stale', 'No check in 30+ days'], ['past', 'Finished / not active']", "['agr', 'No agreement'], ['past', 'Finished / not active']"],   // progress checks are rare (14 in all), so "no check in 30+ days" listed 213 of 223 students: removed
]);
