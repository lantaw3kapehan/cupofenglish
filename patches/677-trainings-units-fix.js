// 677: Trainings — next-rank units on the management view of a teacher's path (Performance gives "need", not "units").
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const a = "(+R.next.units).toLocaleString()", b = "Math.round(R.next.units != null ? +R.next.units : (+R.life || 0) + (+R.next.need || 0)).toLocaleString()";
if (s.split(a).length !== 2) { console.error('not unique'); process.exit(1); } s = s.replace(a, b); fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
