// 19 Oct · Teacher Today: smaller boxes; an overdue to-do shows once (in the waiting box, red), not again in the warning box.
const inc = require('fs').readFileSync(require('path').join(__dirname, '308-today-boxes-compact.inc'), 'utf8');
require('../tools/lib.js')(process.argv[2], [["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"]]);
