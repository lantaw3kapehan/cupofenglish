// 20 Oct · Cmd/Ctrl-click or middle-click opens a screen or a student in a new tab; menu items are real links; #student=CODE opens that student.
const inc = require('fs').readFileSync(require('path').join(__dirname, '412-new-tab.inc'), 'utf8');
require('../tools/lib.js')(process.argv[2], [["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"]]);
