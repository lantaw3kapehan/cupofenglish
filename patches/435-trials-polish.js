// 20 Oct · Trials polish: one card for filters + list, tighter teacher chart, richer levels card (enrolled by level, average score), lighter rows.
const inc = require('fs').readFileSync(require('path').join(__dirname, '435-trials-polish.inc'), 'utf8');
require('../tools/lib.js')(process.argv[2], [["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"]]);
