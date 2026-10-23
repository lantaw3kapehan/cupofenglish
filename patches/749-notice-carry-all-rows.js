// 749: (Misty) Una + Levin = 68.5 units: the 0.5 carried over sits on another ACTIVE row of the same code (a second teacher row),
// so the class notice showed 68. Carry over now adds up every ACTIVE row of the student.
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const rep = (a, b) => { if (s.split(a).length !== 2) { console.error('not unique: ' + a.slice(0, 90)); process.exit(1); } s = s.replace(a, b); };
rep("en: r[C.enrolled], carry: +r[C.carry] || 0,", "en: r[C.enrolled], carry: Math.round(rows.reduce((a, q) => a + (+q[C.carry] || 0), 0) * 10) / 10,");
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
