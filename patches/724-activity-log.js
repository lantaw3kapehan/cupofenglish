// 724: (Misty) activity log as proof for disputes — teacher's own copy (Pay › My activity log), management per teacher + "Proof" on lates.
// Also: Cases amounts follow tonight's POLICY (New teacher, Excused late = ₱0). See 724-activity-log.inc.txt.
const fs = require('fs'), path = require('path'), file = process.argv[2];
const inc = fs.readFileSync(path.join(__dirname, '724-activity-log.inc.txt'), 'utf8');
let s = fs.readFileSync(file, 'utf8');
const rep = (a, b) => { if (s.split(a).length !== 2) { console.error('not unique: ' + a.slice(0, 90)); process.exit(1); } s = s.replace(a, b); };
rep("<button class=\"btn ghost sm\" onclick=\"avOpen('${esc(name)}')\">Open slots</button>", "<button class=\"btn ghost sm\" onclick=\"actLog('${esc(name)}')\">📋 Activity log</button><button class=\"btn ghost sm\" onclick=\"avOpen('${esc(name)}')\">Open slots</button>");
rep("'<div class=\"lqm-b\"><button class=\"btn sm ghost\" onclick=\"decide(' + x.row + ',\\'Excused\\')\">Excused</button>",
    "'<div class=\"lqm-b\"><button class=\"btn sm ghost\" onclick=\"actLog(\\'' + esc(x.teacher) + '\\',\\'' + (+x.row > 1e9 ? new Date(+x.row + 8 * 3600e3).toISOString().slice(0, 10) : '') + '\\')\">📋 Proof</button><button class=\"btn sm ghost\" onclick=\"decide(' + x.row + ',\\'Excused\\')\">Excused</button>");
rep("const CA_AMT = { late: { Excused: [100, 100], Unexcused: [100, 300] },", "const CA_AMT = { late: { Excused: [0, 100], Unexcused: [100, 300] },   /* 724: POLICY 23 Oct · New teacher, Excused late = ₱0 */");
const i = s.lastIndexOf('</body>'); if (i < 0 || s.indexOf('724 · (Misty) Activity log') >= 0) { console.error('cannot insert'); process.exit(1); }
s = s.slice(0, i) + inc + '\n' + s.slice(i);
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
