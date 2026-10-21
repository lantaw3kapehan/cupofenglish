// 21 Oct · Cases: month summary with a 6-month chart, Who this month bars (replaces 21 name buttons), one row per case with Excused / Unexcused, older months folded.
const inc = require('fs').readFileSync(require('path').join(__dirname, '524-cases.inc'), 'utf8');
require('../tools/lib.js')(process.argv[2], [["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"]]);
