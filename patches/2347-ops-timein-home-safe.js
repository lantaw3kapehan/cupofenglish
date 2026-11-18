// 2347: the Overview Time in button must not read d (not defined in renderHome); show it to staff who have not timed in today, never to the President.
const file = process.argv[2];
require('../tools/lib.js')(file, [
["'<div class=\"ov-caps\">' + (!d.timein && !(D.timeIn && D.timeIn.time) ? ", "'<div class=\"ov-caps\">' + (!D.pres && !(D.timeIn && D.timeIn.time) ? "]
]);
