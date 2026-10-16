// 16 Oct · course books in three places: class card (one tap to the unit), student page, Books library in the teacher menu.
const inc = require('fs').readFileSync(require('path').join(__dirname, '244-books-unit-student-library.inc'), 'utf8');
require('../tools/lib.js')(process.argv[2], [
["${!D.mgr && c.code && !c.cancelled && window.bkHas && bkHas(c.book || s.book) ? ` · <a class=\"link\" onclick=\"bookSheet('${esc(c.code)}','${esc(c.id)}')\">Book ›</a>` : ''}", "${!D.mgr && c.code && !c.cancelled && window.bkCard ? bkCard(c, s) : ''}"],
["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"],
]);
