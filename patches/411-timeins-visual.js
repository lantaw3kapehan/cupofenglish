// 20 Oct · Time-ins at a glance: ring + coloured counts + next due in one card, and "Today's timeline" (due tick, time-in dot, now line).
const inc = require('fs').readFileSync(require('path').join(__dirname, '411-timeins-visual.inc'), 'utf8');
require('../tools/lib.js')(process.argv[2], [["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"]]);
