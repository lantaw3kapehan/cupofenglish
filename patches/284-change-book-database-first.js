// 19 Oct · Change book: database first, Google Calendar follows.
const inc = require('fs').readFileSync(require('path').join(__dirname, '284-change-book-database-first.inc'), 'utf8');
require('../tools/lib.js')(process.argv[2], [["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"]]);
