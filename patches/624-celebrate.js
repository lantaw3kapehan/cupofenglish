// 22 Oct · Celebrate 🎉 in management To do: birthdays, new books, lesson milestones — bilingual picture + message (see 624-celebrate.inc.txt).
// Server: coe-notice actions cel_list / cel_mark / cel_seed; tables coe_celebrate, coe_cel_books.
const fs = require('fs'), path = require('path'), file = process.argv[2];
const inc = fs.readFileSync(path.join(__dirname, '624-celebrate.inc.txt'), 'utf8');
let s = fs.readFileSync(file, 'utf8'); const i = s.lastIndexOf('</body>');
if(i < 0 || s.indexOf('624 · Celebrate') >= 0){ console.error('cannot insert'); process.exit(1); }
fs.writeFileSync(file, s.slice(0, i) + inc + '\n' + s.slice(i));
require('../tools/lib.js')(file, []);
