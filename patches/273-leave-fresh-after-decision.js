// 18 Oct · a leave decision shows at once on the deciding device (leave lists from Google for 10 min after a leave save).
const inc = require('fs').readFileSync(require('path').join(__dirname, '273-leave-fresh-after-decision.inc'), 'utf8');
require('../tools/lib.js')(process.argv[2], [["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"]]);
