// 691: (Misty) On the teacher's path, Specialization (Senior step) shows two separate choices: "Inquiry-Based" and
// "Exam · IELTS, TOEFL, KET, PET, YLE" — either one completes the step ("one needed").
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const a = "        + g.items.map(x => { const cls = x.st === 'done' ? 'done' : x.st === 'next' ? 'next' : x.st === 'open' ? 'open' : 'lock';";
const b = "        + g.items.map(x => { const cls = x.st === 'done' ? 'done' : x.st === 'next' ? 'next' : x.st === 'open' ? 'open' : 'lock';\n" +
"          if(x.t.id === 'spec'){ const R0 = (d.records || []).filter(r => r.teacher === who && r.status === 'done'), inq = R0.some(r => r.training_id === 'inq'), ex = R0.some(r => /^spec-/.test(r.training_id) || r.training_id === 'spec');\n" +
"            const one = (ok, id, t) => '<button type=\"button\" class=\"tx-pill ' + (ok ? 'done' : cls === 'done' ? 'open' : cls) + '\" onclick=\"trOpen(\\'' + id + '\\')\">' + (!ok && cls === 'lock' ? LOCK : '') + '<span>' + (ok ? '✓ ' : cls === 'next' ? '▶ ' : '') + t + '</span></button>';\n" +
"            return one(inq, 'inq', 'Inquiry-Based') + one(ex, 'spec-yle', 'Exam · IELTS, TOEFL, KET, PET, YLE') + '<span class=\"small mute\" style=\"align-self:center\">one needed</span>'; }";
if (s.split(a).length !== 2) { console.error('not unique'); process.exit(1); } s = s.replace(a, b);
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
