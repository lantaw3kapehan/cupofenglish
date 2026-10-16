// 16 Oct · a late time-in decided by one person (Celine) leaves everyone's Time-ins within a minute.
const inc = require('fs').readFileSync(require('path').join(__dirname, '239-late-decided-once.inc'), 'utf8');
require('../tools/lib.js')(process.argv[2], [
["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"],
]);
