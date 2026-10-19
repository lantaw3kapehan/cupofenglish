// 19 Oct · Leave screen polished: date tiles, slimmer counts, numbered steps, days-of-leave bars.
const inc = require('fs').readFileSync(require('path').join(__dirname, '343-leave-polish.inc'), 'utf8');
require('../tools/lib.js')(process.argv[2], [["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"]]);
