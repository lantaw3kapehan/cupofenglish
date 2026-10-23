// 735: the roadmap's short class names (.rl .rn .rp .rm) clashed with the Teachers screen (its "units by rank" labels use .rl), so words
// floated over the Teachers page. Roadmap classes renamed to .rq-*.
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const a = s.indexOf('  /* 728 · Trainings (teacher): compact rank card + winding roadmap */'), b = a < 0 ? -1 : s.indexOf('document.head.appendChild(st); })();', a);
if (a < 0 || b < 0) { console.error('728 block not found'); process.exit(1); }
const blk = s.slice(a, b);
const fixed = blk.replace(/(?<![A-Za-z0-9_$-])(rmc|rm|rn|rl|rp)(?=[ "'.{:,)])/g, (m, c) => 'rq-' + c);
if (fixed === blk) { console.error('nothing renamed'); process.exit(1); }
s = s.slice(0, a) + fixed + s.slice(b);
// 731 changed the legend inside the block; @keyframes rmP stays (unique name)
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
