// 725: activity log polish — no "Teacher Teacher", no "[object Object]", show the server's note next to On time / Late.
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const rep = (a, b) => { if (s.split(a).length !== 2) { console.error('not unique: ' + a.slice(0, 90)); process.exit(1); } s = s.replace(a, b); };
rep("(mine ? '' : 'Teacher ' + E(typeof tName === 'function' ? tName(who) : who) + ' · ')", "(mine ? '' : E(typeof tName === 'function' ? tName(who) : 'Teacher ' + who) + ' · ')");
rep("Math.abs(+r.mins) + ' min after start') + ')' : ''), /Late/.test(r.rst) ? '#C2483A' : '#1E7A55'] : ['✓ Saved' + (r.note ? ' · ' + r.note : ''), '#1E7A55'];",
    "Math.abs(+r.mins) + ' min after start') + ')' : '') + (nt(r) ? ' · ' + nt(r) : ''), /Late/.test(r.rst) ? '#C2483A' : '#1E7A55'] : ['✓ Saved' + (nt(r) ? ' · ' + nt(r) : ''), '#1E7A55'];\n  function nt(r){ return r.note && !/^\\[object/.test(r.note) ? r.note : ''; }");
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
