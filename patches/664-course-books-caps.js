// 664: (Misty) "Course Books" with a capital B (title case) everywhere — buttons, screen, picture.
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8'); const n = s.split('Course books').length - 1;
if (n < 5) { console.error('Expected Course books, found ' + n); process.exit(1); }
s = s.split('Course books').join('Course Books'); fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
