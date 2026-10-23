// 673: Trainings path — CupOfEnglish Way shows no "Live · date to follow" (it is done in the app, not live).
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const a = ": x.rec && x.rec.status === 'assigned' ? 'Assigned to you' : 'Live · date to follow';", b = ": x.rec && x.rec.status === 'assigned' ? 'Assigned to you' : way ? (R.ix === 0 ? 'In the app' : '') : 'Live · date to follow';";
if (s.split(a).length !== 2) { console.error('not unique'); process.exit(1); } s = s.replace(a, b); fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
