// 20 Oct · Trials: enrolment by teacher and trial levels under the 45-day tiles; compact rows (chips inline, friendly dates, score bar).
const inc = require('fs').readFileSync(require('path').join(__dirname, '433-trials-visual.inc'), 'utf8');
require('../tools/lib.js')(process.argv[2], [["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"]]);
