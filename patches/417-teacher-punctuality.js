// 20 Oct · Time-ins › Full details › "Teachers' time-ins": per teacher a month chart of minutes before class (late below the line), like Management hours.
const inc = require('fs').readFileSync(require('path').join(__dirname, '417-teacher-punctuality.inc'), 'utf8');
require('../tools/lib.js')(process.argv[2], [["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"]]);
