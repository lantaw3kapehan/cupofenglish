// 672: Trainings path polish — icons centred in the circles (a global sheet rule made them absolute), shorter "Catch up" label,
// no parts count on CupOfEnglish Way for teachers who are past Newly Hired.
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const rep = (a, b) => { const i = s.indexOf(a); if (i < 0 || s.indexOf(a, i + 1) > -1) { console.error('not unique: ' + a.slice(0, 90)); process.exit(1); } s = s.replace(a, b); };
rep(".tr-n svg{width:24px;height:24px}", ".tr-n svg{width:24px;height:24px;position:static!important;margin:auto}.tr-n{justify-content:center;align-items:center}");
rep("x.st === 'open' && x.gi <= R.ix && x.t.id !== 'way' ? 'Catch up · not blocking'", "x.st === 'open' && x.gi <= R.ix && x.t.id !== 'way' ? 'Catch up'");
rep(": way && P.length ? pd + ' of ' + P.length + ' parts'", ": way && P.length && R.ix === 0 ? pd + ' of ' + P.length + ' parts'");
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
