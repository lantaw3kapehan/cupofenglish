// 2591 (Misty 21 Nov 12:50 "yes"): class completion leaves out cancellations the parent asked for (coe_overview_core: sch = held +
// cancelled − parent-requested). The definitions on Teachers say so.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["completion = classes held ÷ classes booked up to now this month (cancellations by anyone count, also by parents)", "completion = classes held ÷ classes booked up to now this month (cancellations the parent asked for are left out)"],
  ["title=\"Classes held ÷ classes booked up to now this month · cancellations by anyone count\"", "title=\"Classes held ÷ classes booked up to now this month · cancellations the parent asked for are left out\""],
]);
