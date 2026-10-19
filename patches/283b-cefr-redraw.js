// 19 Oct · CEFR journey drawn again when the class list arrives.
const inc = require('fs').readFileSync(require('path').join(__dirname, '283b-cefr-redraw.inc'), 'utf8');
require('../tools/lib.js')(process.argv[2], [["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"]]);
