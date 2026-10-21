// 21 Oct · To do: no flicker — redraws with no new data skipped, close redraws merged, scroll kept.
const inc = require('fs').readFileSync(require('path').join(__dirname, '489-todo-no-flicker.inc'), 'utf8');
require('../tools/lib.js')(process.argv[2], [["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"]]);
