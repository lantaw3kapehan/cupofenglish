// 19 Oct · Lessons left: today's classes are never counted twice (Google's Active answer added them on top of records that already had them; Mia 4 → 4.5).
const inc = require('fs').readFileSync(require('path').join(__dirname, '338-active-no-double-today.inc'), 'utf8');
require('../tools/lib.js')(process.argv[2], [["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"]]);
