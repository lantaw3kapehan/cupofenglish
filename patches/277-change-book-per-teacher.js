// 19 Oct · Change book: with two teachers, only the chosen teacher's classes change (needs Apps Script mgmtSetBook with teacher).
const inc = require('fs').readFileSync(require('path').join(__dirname, '277-change-book-per-teacher.inc'), 'utf8');
require('../tools/lib.js')(process.argv[2], [["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"]]);
