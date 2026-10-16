// 16 Oct · To do no longer flickers: redraws close together are joined, identical redraws change nothing.
const inc = require('fs').readFileSync(require('path').join(__dirname, '227-todo-no-flicker.inc'), 'utf8');
require('../tools/lib.js')(process.argv[2], [
["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"],
]);
