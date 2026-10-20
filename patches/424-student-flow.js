// 20 Oct · Overview › Student flow (trials, trial→enrolled %, renewals, stopped with ▲▼ vs the month before; 6-month new/renewed/stopped chart); calm teal menu badges.
const inc = require('fs').readFileSync(require('path').join(__dirname, '424-student-flow.inc'), 'utf8');
require('../tools/lib.js')(process.argv[2], [["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"]]);
