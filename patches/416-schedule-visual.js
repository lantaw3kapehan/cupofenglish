// 20 Oct · Schedule: "Day at a glance" hour columns (done · live · coming · cancelled, now line, click to jump), compact rows, hour headers.
const inc = require('fs').readFileSync(require('path').join(__dirname, '416-schedule-visual.inc'), 'utf8');
require('../tools/lib.js')(process.argv[2], [["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"]]);
