// 681: (Misty) Final Demo (Newly Hired, after CupOfEnglish Way) and Integration (after the 4Cs) added to the path (database).
// Courseware trainings (Phonics Training, Oxford Discover 1 and 2, Reading Explorer) and Trial class training are "unlocks":
// columns in the management table (tick like any other) and chips on the teacher's screen.
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const rep = (a, b) => { if (s.split(a).length !== 2) { console.error('not unique: ' + a.slice(0, 90)); process.exit(1); } s = s.replace(a, b); };
rep("M.map(t => '<th class=\"c\"", "M.concat((d.trainings || []).filter(t => t.kind === 'unlock').sort((a, b) => a.sort - b.sort)).map(t => '<th class=\"c\"");
rep("M.map(t => { const rec = latestRec(d.records, x.name, t.id), ses", "M.concat((d.trainings || []).filter(t => t.kind === 'unlock').sort((a, b) => a.sort - b.sort)).map(t => { const rec = latestRec(d.records, x.name, t.id), ses");
rep("const trial = latestRec(d.records, who, 'trial'), spec = latestRec(d.records, who, 'spec');", "const U = (d.trainings || []).filter(t => t.kind === 'unlock').sort((a, b) => a.sort - b.sort).concat((d.trainings || []).filter(t => t.id === 'spec')), okU = t => ['done', 'excused'].includes((latestRec(d.records, who, t.id) || {}).status);");
rep("h += '<div class=\"tr-chips\"><span class=\"' + (trial && trial.status === 'done' ? 'ok' : '') + '\">' + (trial && trial.status === 'done' ? '✓ ' : '') + 'Trial classes</span><span class=\"' + (spec && spec.status === 'done' ? 'ok' : '') + '\">' + (spec && spec.status === 'done' ? '✓ ' : '') + 'Exam students</span></div>';",
    "h += '<div class=\"tr-chips\">' + U.map(t => '<span class=\"' + (okU(t) ? 'ok' : '') + '\" style=\"cursor:pointer\" onclick=\"trOpen(\\'' + t.id + '\\')\">' + (okU(t) ? '✓ ' : '') + e(t.id === 'trial' ? 'Trial classes' : t.id === 'spec' ? 'Exam students' : t.title) + '</span>').join('') + '</div>';");
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
