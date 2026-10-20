// 20 Oct · Student page: "Coming up" becomes a month calendar (two months side by side on a laptop), the list folds under it.
const inc = require('fs').readFileSync(require('path').join(__dirname, '428-student-calendar.inc'), 'utf8');
require('../tools/lib.js')(process.argv[2], [["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"]]);
