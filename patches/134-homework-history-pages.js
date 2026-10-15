// 15 Oct · Teachers · Homework: the homework given before (last 3, with date) and the next workbook pages as one-tap
// buttons (Misty, from a teacher: see what was assigned last time to know what to give next). The last workbook page
// is found in the last homework that has a page number ("Continuation of the last homework" is skipped).
// Code in 134-homework-history-pages.inc.
const inc = require('fs').readFileSync(require('path').join(__dirname, '134-homework-history-pages.inc'), 'utf8');
require('../tools/lib.js')(process.argv[2], [
["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"],
]);
