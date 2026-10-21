// 21 Oct · Teacher Schedule: summary with taught/still-to-teach bar, week tiles or month calendar by load, tidy day cards, finished days folded.
const inc = require('fs').readFileSync(require('path').join(__dirname, '501-teacher-schedule.inc'), 'utf8');
require('../tools/lib.js')(process.argv[2], [["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"]]);
