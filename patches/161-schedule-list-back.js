// 15 Oct · Schedule: the previous class list is back (Misty preferred it), with the week strip and one-line summary kept
// on top. Code in 161-schedule-list-back.inc.
const inc = require('fs').readFileSync(require('path').join(__dirname, '161-schedule-list-back.inc'), 'utf8');
require('../tools/lib.js')(process.argv[2], [
["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"],
]);
