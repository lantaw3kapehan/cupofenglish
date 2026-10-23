// 692: (Misty) Each specialization is its own choice: Inquiry-Based, YLE, IELTS, TOEFL, KET, PET (database: spec-ielts/-toefl/-ket/-pet
// added). Senior step on the path shows one pill per specialization, "one needed"; short column names in Books & trials.
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const rep = (a, b) => { if (s.split(a).length !== 2) { console.error('not unique: ' + a.slice(0, 90)); process.exit(1); } s = s.replace(a, b); };
rep("            return one(inq, 'inq', 'Inquiry-Based') + one(ex, 'spec-yle', 'Exam · IELTS, TOEFL, KET, PET, YLE') + '<span class=\"small mute\" style=\"align-self:center\">one needed</span>'; }",
    "            const SP = (d.trainings || []).filter(t => t.id === 'inq' || /^spec-/.test(t.id)).sort((p, q) => (p.id === 'inq' ? 0 : p.id === 'spec-yle' ? 1 : 2) - (q.id === 'inq' ? 0 : q.id === 'spec-yle' ? 1 : 2) || p.sort - q.sort);\n" +
    "            return SP.map(t => one(R0.some(r => r.training_id === t.id), t.id, t.title.replace(/ Specialization$/, ''))).join('') + '<span class=\"small mute\" style=\"align-self:center\">one needed</span>'; }");
rep("trial: 'Trials', 'spec-yle': 'YLE', inq: 'Inquiry',", "trial: 'Trials', 'spec-yle': 'YLE', 'spec-ielts': 'IELTS', 'spec-toefl': 'TOEFL', 'spec-ket': 'KET', 'spec-pet': 'PET', inq: 'Inquiry',");
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
