// 16 Oct · Books: student names as coloured labels (one colour per student everywhere).
const inc = require('fs').readFileSync(require('path').join(__dirname, '249-books-student-colours.inc'), 'utf8');
require('../tools/lib.js')(process.argv[2], [
["${who.length ? `<div class=\"who\"><b>${who.length}</b> · ${esc(who.slice(0, 4).join(', '))}${who.length > 4 ? ' +' + (who.length - 4) : ''}</div>` : ''}", "${who.length ? (window.bkWho ? bkWho(who) : '') : ''}"],
["<div class=\"bl-av\" style=\"--bc:${S0.c}\">", "<div class=\"bl-av\" style=\"--bc:${window.bkStuC ? bkStuC(w) : S0.c}\">"],
["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"],
]);
