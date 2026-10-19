// 19 Oct · Today without jumping: the last finished Today stays on screen while the new one is drawn and tidied underneath, then swaps in at once.
const inc = require('fs').readFileSync(require('path').join(__dirname, '320-today-stable.inc'), 'utf8');
require('../tools/lib.js')(process.argv[2], [["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"]]);
