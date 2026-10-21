// 21 Oct · Teacher Pay polish: rank in the header, months table folds under the chart, clearer bonuses and deductions.
const inc = require('fs').readFileSync(require('path').join(__dirname, '509-teacher-pay.inc'), 'utf8');
require('../tools/lib.js')(process.argv[2], [["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"]]);
