// 20 Oct · Trials: "Last 45 days · This year · All time" switch; all-time standing with charts (coe-trials v8 · tall).
const inc = require('fs').readFileSync(require('path').join(__dirname, '437-trials-alltime.inc'), 'utf8');
require('../tools/lib.js')(process.argv[2], [["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"]]);
