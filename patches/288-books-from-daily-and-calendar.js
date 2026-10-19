// 19 Oct · book changes from the -DAILY tabs and the calendar (students list, CEFR journey).
const inc = require('fs').readFileSync(require('path').join(__dirname, '288-books-from-daily-and-calendar.inc'), 'utf8');
require('../tools/lib.js')(process.argv[2], [["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"]]);
