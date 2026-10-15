// 15 Oct · Teachers · "Where did you end?" with page buttons (a teacher's request via Misty: see what was typed last
// time and just tap the pages). Shows last time's line ("OD1 · Unit 3 · SB p. 42 · WB p. 30") with "Same as last time",
// the student's books as buttons, and − / + for Unit, Student book page and Workbook page, starting from last time.
// The text line fills itself (still editable). Homework gets "Workbook p. N+1". Code in 133-ended-page-picker.inc.
const inc = require('fs').readFileSync(require('path').join(__dirname, '133-ended-page-picker.inc'), 'utf8');
require('../tools/lib.js')(process.argv[2], [
["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"],
]);
