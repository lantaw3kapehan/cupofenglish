// 15 Oct · Check of today's changes: the To do card no longer repeats what is already in the orange
// "Management is waiting" box at the top (same items twice on one screen). Code in 147-todo-no-repeat.inc.
const inc = require('fs').readFileSync(require('path').join(__dirname, '147-todo-no-repeat.inc'), 'utf8');
require('../tools/lib.js')(process.argv[2], [
["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"],
]);
