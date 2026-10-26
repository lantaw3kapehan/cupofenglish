// 1142: (Misty, 26 Oct 16:59) "Teacher Trainer here should follow capitalization, big letter T on Trainer" — the title is
//      written "Teacher Trainer" everywhere it shows (header chip, its tooltip, the Qualified-to-teach line).
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8'); const n = s.split('Teacher trainer').length - 1; if(n < 1) throw new Error('1142 none');
s = s.split('Teacher trainer').join('Teacher Trainer'); fs.writeFileSync(file, s); console.log('replaced ' + n);
require('../tools/lib.js')(file, []);
