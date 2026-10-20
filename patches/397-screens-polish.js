// 20 Oct · Every screen: calm titles, link buttons, pill filters without track, row lists in one card, lessons-left colours.
const inc = require('fs').readFileSync(require('path').join(__dirname, '397-screens-polish.inc'), 'utf8');
require('../tools/lib.js')(process.argv[2], [["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"]]);
