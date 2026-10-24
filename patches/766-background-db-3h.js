// 766: (Misty) Schedule, teacher student pages, Leave still reached Google in the background (4–80 s each): their database copy is partly
// Google's own copy, and 761 asked Google again once that part was 30 min old. Opening the screen already refreshes it; the quiet
// background refresh now waits 3 hours (and Leave joins the list).
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const rep = (a, b) => { if (s.split(a).length !== 2) { console.error('not unique: ' + a.slice(0, 90)); process.exit(1); } s = s.replace(a, b); };
rep("(d.live || Date.now() - Date.parse(d.at) < 30 * 6e4)) ? d.data : go(), go); }", "(d.live || Date.now() - Date.parse(d.at) < 180 * 6e4)) ? d.data : go(), go); }   /* 766: 3 h */");
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
