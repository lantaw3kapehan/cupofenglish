// 748: family class notice — every teacher block carries the child's name (a child with two teachers showed the name only once).
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const rep = (a, b) => { if (s.split(a).length !== 2) { console.error('not unique: ' + a.slice(0, 90)); process.exit(1); } s = s.replace(a, b); };
rep(".split('\\n').map((l, j) => j === 0 && /^Teacher /.test(l) ? en(m.name) + ' · ' + l : l).join('\\n')", ".split('\\n').map(l => /^Teacher /.test(l) ? en(m.name) + ' · ' + l : l).join('\\n')");
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
