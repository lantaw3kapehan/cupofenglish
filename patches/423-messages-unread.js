// 20 Oct · Messages: number of conversations not opened yet on the menu, beside the title and as an "Unread" tab; new label on rows; tabs on one line.
const inc = require('fs').readFileSync(require('path').join(__dirname, '423-messages-unread.inc'), 'utf8');
require('../tools/lib.js')(process.argv[2], [["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"]]);
