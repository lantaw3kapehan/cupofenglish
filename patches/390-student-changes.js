// 20 Oct · Student page: one "Changes · step by step" card with Renewal / Teacher or time / Pause or stop steps.
const inc = require('fs').readFileSync(require('path').join(__dirname, '390-student-changes.inc'), 'utf8');
require('../tools/lib.js')(process.argv[2], [["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"]]);
