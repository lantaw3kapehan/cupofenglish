// 656: Books to buy — covers from COURSEWARE + Taobao search words, one picture for parents (Student Book + Workbook), from To do › New book
// and the student page. See 656-books-to-buy.inc.txt (server: Apps Script mgmtBookCovers, coe-notice v5 book_buy_*).
const fs = require('fs'), path = require('path'), file = process.argv[2];
const inc = fs.readFileSync(path.join(__dirname, '656-books-to-buy.inc.txt'), 'utf8');
let s = fs.readFileSync(file, 'utf8'); const i = s.lastIndexOf('</body>');
if(i < 0 || s.indexOf('656 · Books to buy') >= 0){ console.error('cannot insert'); process.exit(1); }
fs.writeFileSync(file, s.slice(0, i) + inc + '\n' + s.slice(i));
require('../tools/lib.js')(file, [
[
"<div class=\"tdb\"><button class=\"btn teal sm\" onclick=\"celPic(${i})\">Picture</button>",
"<div class=\"tdb\"><button class=\"btn teal sm\" onclick=\"celPic(${i})\">Picture</button>${x.kind === 'book' && window.bbOpen ? `<button class=\"btn ghost sm\" onclick=\"bbOpen('${e(x.book)}','${e(x.en)}','${e(x.cn || '')}')\">Books to buy</button>` : ''}"
]
]);
