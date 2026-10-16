// 16 Oct · course books (Drive › COURSEWARE_Used in Class) open from the teacher's class card, class brief and class note.
const inc = require('fs').readFileSync(require('path').join(__dirname, '243-course-books.inc'), 'utf8');
require('../tools/lib.js')(process.argv[2], [
["${c.meet?` · <a class=\"link\" onclick=\"copyId('${esc(c.meet)}')\">${esc(c.meet)}</a>`:''}", "${c.meet?` · <a class=\"link\" onclick=\"copyId('${esc(c.meet)}')\">${esc(c.meet)}</a>`:''}${!D.mgr && c.code && !c.cancelled && window.bkHas && bkHas(c.book || s.book) ? ` · <a class=\"link\" onclick=\"bookSheet('${esc(c.code)}','${esc(c.id)}')\">Book ›</a>` : ''}"],
["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"],
]);
