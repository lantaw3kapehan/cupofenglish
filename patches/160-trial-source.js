// 15 Oct · Trials show each student's source with the same colour labels as Students (ACTIVE › SOURCE when enrolled,
// otherwise DATABASE › SOURCE), plus a colour key with counts that filters the list. Code in 160-trial-source.inc.
const inc = require('fs').readFileSync(require('path').join(__dirname, '160-trial-source.inc'), 'utf8');
require('../tools/lib.js')(process.argv[2], [
["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"],
]);
