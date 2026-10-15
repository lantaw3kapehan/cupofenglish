// 15 Oct · Management Schedule redesigned: week strip with class counts (tap a day), one summary line, classes grouped by
// start time as side-by-side cards, finished classes folded, By teacher as cards. Every action kept (tap a class, Remind,
// Proof for the parent, check-in chips, search, teacher filter). Code in 155-schedule-redesign.inc.
const inc = require('fs').readFileSync(require('path').join(__dirname, '155-schedule-redesign.inc'), 'utf8');
require('../tools/lib.js')(process.argv[2], [
["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"],
]);
