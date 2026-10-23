// 731: (Misty) roadmap climbs — First week at the bottom, Master at the top.
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const rep = (a, b) => { if (s.split(a).length !== 2) { console.error('not unique: ' + a.slice(0, 90)); process.exit(1); } s = s.replace(a, b); };
rep("it.cx = r % 2 ? X(PER - 1 - j) : X(j); it.cy = TOP + r * RH;", "it.cx = r % 2 ? X(PER - 1 - j) : X(j); it.cy = TOP + (rows.length - 1 - r) * RH;");
rep("<span>✓ done · ▶ next · ! not recorded yet · tap a step</span>", "<span>climb from the bottom · ✓ done · ▶ next · ! not recorded yet</span>");
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
