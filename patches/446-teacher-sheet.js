// 20 Oct · The teacher card (tap a teacher): a dashboard layout with charts; every section and button kept.
const inc = require('fs').readFileSync(require('path').join(__dirname, '446-teacher-sheet.inc'), 'utf8');
require('../tools/lib.js')(process.argv[2], [["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"]]);
