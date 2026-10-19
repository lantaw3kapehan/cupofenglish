// 19 Oct · Today (teacher): finished classes (homework, class note and video done) fold into "✓ Finished today" at the bottom.
const inc = require('fs').readFileSync(require('path').join(__dirname, '336-today-finished-fold.inc'), 'utf8');
require('../tools/lib.js')(process.argv[2], [["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"]]);
