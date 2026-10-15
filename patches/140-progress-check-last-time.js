// 15 Oct · Progress check: "Last time" next to "now", and more checks that keep ratings objective (Misty).
//  · A "Last time · compare with now" card: the last progress check (date, teacher, Speaking/Listening/Reading/Total, CEFR)
//    and the last monthly feedback (Speaking/Listening/Reading/Writing /25).
//  · Each section shows Last check · Monthly feedback % · Now (▲/▼), each skill shows "Last check N" (from PR-DATA).
//  · Asked to explain (as with the trial) when: a section jumps a quarter or more since the last check (≤ 4 months),
//    the CEFR level goes up within 3 months of the last check, a section is 25+ points above the monthly feedback,
//    6–8 skills are Excellent, or all 9 skills have the same score.
// Code in 140-progress-check-last-time.inc.
const inc = require('fs').readFileSync(require('path').join(__dirname, '140-progress-check-last-time.inc'), 'utf8');
require('../tools/lib.js')(process.argv[2], [
["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"],
]);
