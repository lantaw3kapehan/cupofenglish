// 16 Oct · Add class › new student takes its code from the database (never the same code twice).
const inc = require('fs').readFileSync(require('path').join(__dirname, '241-new-code-in-add-class.inc'), 'utf8');
require('../tools/lib.js')(process.argv[2], [
["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"],
]);
