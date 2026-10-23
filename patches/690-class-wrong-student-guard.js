// 690: (Misty) New class — stop when the chosen code has no active package but an active student has the same name. Include file.
const fs = require('fs'), path = require('path'), file = process.argv[2];
const inc = fs.readFileSync(path.join(__dirname, '690-class-wrong-student-guard.inc.txt'), 'utf8');
let s = fs.readFileSync(file, 'utf8'); const i = s.lastIndexOf('</body>');
if(i < 0 || s.indexOf('23 Oct · 690 ·') >= 0){ console.error('cannot insert'); process.exit(1); }
fs.writeFileSync(file, s.slice(0, i) + inc + '\n' + s.slice(i));
require('../tools/lib.js')(file, []);
