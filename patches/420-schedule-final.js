// 20 Oct · Schedule final polish: calm reminders card, part labels (Today · To send · Classes), small remind pills, finished classes folded.
const inc = require('fs').readFileSync(require('path').join(__dirname, '420-schedule-final.inc'), 'utf8');
require('../tools/lib.js')(process.argv[2], [["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"]]);
