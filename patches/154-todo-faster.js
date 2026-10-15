// 15 Oct · Management To do made faster to work through: "Do next" carries each item's own buttons (copy + ✓ sent),
// zero counts and empty sections fold into one "✓ All clear" line (a section with something due today is never called
// clear), shorter rows with side-by-side buttons, even closed sections. Code in 154-todo-faster.inc.
const inc = require('fs').readFileSync(require('path').join(__dirname, '154-todo-faster.inc'), 'utf8');
require('../tools/lib.js')(process.argv[2], [
["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"],
]);
