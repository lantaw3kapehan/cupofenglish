// 734: the Team ladder's CSS (.tl…) clashed with the Teachers screen's "units by rank" (.tl), which then floated over the page. Renamed to .tq….
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const a = s.indexOf('  /* 732 · Team ladder (management) */'), b = a < 0 ? -1 : s.indexOf('document.head.appendChild(st); })();', a);
if (a < 0 || b < 0) { console.error('732 block not found'); process.exit(1); }
const blk = s.slice(a, b), fixed = blk.replace(/(?<![A-Za-z0-9_$-])tl(?=[-"'\s{,.:)])/g, 'tq');
if (fixed === blk) { console.error('nothing renamed'); process.exit(1); }
s = s.slice(0, a) + fixed + s.slice(b);
// the call in paintAll and its section use the new names already (all inside the block); teamLadder() name unchanged
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
