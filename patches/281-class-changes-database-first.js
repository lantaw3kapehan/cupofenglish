// 19 Oct · cancel / restore / move one class: database first, Google Calendar follows.
const inc = require('fs').readFileSync(require('path').join(__dirname, '281-class-changes-database-first.inc'), 'utf8');
require('../tools/lib.js')(process.argv[2], [["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"]]);
