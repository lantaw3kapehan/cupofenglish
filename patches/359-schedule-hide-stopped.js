// 20 Oct · Schedule: classes cancelled ahead of time (stopped / changed schedules) are hidden, with a Show link.
const inc = require('fs').readFileSync(require('path').join(__dirname, '359-schedule-hide-stopped.inc'), 'utf8');
require('../tools/lib.js')(process.argv[2], [["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"]]);
