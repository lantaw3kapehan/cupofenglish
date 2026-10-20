// 20 Oct · Trial report sheet: one calm numbered list in Misty's order (report → course plan → CEFR → price), After sending, More.
const inc = require('fs').readFileSync(require('path').join(__dirname, '354-trial-sheet-steps.inc'), 'utf8');
require('../tools/lib.js')(process.argv[2], [["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"]]);
