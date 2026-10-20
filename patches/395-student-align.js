// 20 Oct · Student page boxes and colours from the app's own tokens (standard section card, soft inner boxes, ink / teal / tint).
const inc = require('fs').readFileSync(require('path').join(__dirname, '395-student-align.inc'), 'utf8');
require('../tools/lib.js')(process.argv[2], [["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"]]);
