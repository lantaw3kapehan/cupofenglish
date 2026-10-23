// 684: short column label "YLE" for the YLE Specialization (Books & trials tab).
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const a = "trial: 'Trial classes', 'cw-phonics': 'Phonics',", b = "trial: 'Trial classes', 'spec-yle': 'YLE', 'cw-phonics': 'Phonics',";
if (s.split(a).length !== 2) { console.error('not unique'); process.exit(1); } s = s.replace(a, b); fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
