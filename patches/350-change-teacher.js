// 19 Oct · Student page › Change teacher: moves the old teacher's classes from a date to the new teacher (same times), sets the new book, keeps the student and balance.
const inc = require('fs').readFileSync(require('path').join(__dirname, '350-change-teacher.inc'), 'utf8');
require('../tools/lib.js')(process.argv[2], [["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"]]);
