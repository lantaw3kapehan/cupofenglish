// 20 Oct · Trials top: one card with four clickable number tiles (trials, enrolled %, following up, not enrolling) and the bar; Status and Source rows aligned.
const inc = require('fs').readFileSync(require('path').join(__dirname, '399-trials-summary.inc'), 'utf8');
require('../tools/lib.js')(process.argv[2], [["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"]]);
