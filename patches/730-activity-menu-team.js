// 730: (Misty) teacher menu · Activity log sits with Messages under TEAM (what you said and what you did, side by side).
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const rep = (a, b) => { if (s.split(a).length !== 2) { console.error('not unique: ' + a.slice(0, 90)); process.exit(1); } s = s.replace(a, b); };
rep("if(!D.mgr && !NAV_T.some(x => x[0] === 'act')){ const i = NAV_T.findIndex(x => x[0] === 'pay'); NAV_T.splice(i < 0 ? NAV_T.length : i + 1, 0, ['act', 'Activity log', 'act']); buildNav(); }",
    "if(!D.mgr && !NAV_T.some(x => x[0] === 'act')){ const i = NAV_T.findIndex(x => x[0] === 'tinbox'), g = i < 0 ? '' : NAV_T[i][4]; NAV_T.splice(i < 0 ? NAV_T.length : i + 1, 0, ['act', 'Activity log', 'act', undefined, g || 'Team']); buildNav(); }");
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
