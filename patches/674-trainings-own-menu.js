// 674: (Misty) Teacher menu — Trainings under its own heading "Trainings", not under "My growth".
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const a = "['train', 'Trainings', 'train', undefined, 'My growth']);", b = "['train', 'Trainings', 'train', undefined, 'Trainings']);";
if (s.split(a).length !== 2) { console.error('not unique'); process.exit(1); } s = s.replace(a, b); fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
