// 733: Team ladder polish — rank names not cut ("Newly Qualified"), "1 teacher coached".
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const rep = (a, b) => { if (s.split(a).length !== 2) { console.error('not unique: ' + a.slice(0, 90)); process.exit(1); } s = s.replace(a, b); };
rep(".tl-r{display:grid;grid-template-columns:132px 1fr;", ".tl-r{display:grid;grid-template-columns:158px 1fr;");
rep("<small>' + CR.filter(x => x).length + ' teachers coached</small>", "<small>' + CR.filter(x => x).length + (CR.filter(x => x).length === 1 ? ' teacher' : ' teachers') + ' coached</small>");
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
