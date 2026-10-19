// 19 Oct · Management phone alerts (Overview), who has phone reminders (Performance), and smaller Today boxes for teachers.
const inc = require('fs').readFileSync(require('path').join(__dirname, '335-mgmt-alerts-compact.inc'), 'utf8');
require('../tools/lib.js')(process.argv[2], [["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"]]);
