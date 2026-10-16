// 16 Oct · Books library: covers by series colour, "Your students' books" first, grouped by stage of learning.
const inc = require('fs').readFileSync(require('path').join(__dirname, '245-books-library-design.inc'), 'utf8');
require('../tools/lib.js')(process.argv[2], [
["function renderBooks(){ const v = $('v-books'); if(!v) return; const q = LQ.trim().toLowerCase();", "function renderBooks(){ if(window.bkLib2) return bkLib2(LIB, LQ); const v = $('v-books'); if(!v) return; const q = LQ.trim().toLowerCase();"],
["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"],
]);
