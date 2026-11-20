// 2534 (final QA): Books page subtitle still said "read it in Google Drive"; books now open in the CupOfEnglish reader.
const file = process.argv[2], fs = require('fs');
let s = fs.readFileSync(file, 'utf8');
const A = 'Open a book to read it in Google Drive. No Adobe needed.';
if(s.split(A).length !== 3) throw new Error('2534 expected 2');
s = s.split(A).join('Open a book to read it in the CupOfEnglish reader. No Adobe needed.');
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
