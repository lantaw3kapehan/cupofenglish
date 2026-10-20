// 20 Oct · ACTIVE names copied from another student: the DATABASE name is shown everywhere + a red To do card until fixed (coe-trials v4 `names`).
const inc = require('fs').readFileSync(require('path').join(__dirname, '388-copied-names.inc'), 'utf8');
require('../tools/lib.js')(process.argv[2], [["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"]]);
