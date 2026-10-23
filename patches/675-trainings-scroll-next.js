// 675: (Misty) Trainings path reads top (Newly Hired) to bottom (Master). On opening, the screen scrolls to the teacher's next
// training so they land on where they are, once per visit.
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const a = "    h += '</div>'; if(v._h !== h){ v.innerHTML = h; v._h = h; } }\n  function partRow(";
const b = "    h += '</div>'; if(v._h !== h){ v.innerHTML = h; v._h = h; }\n    if(!v._sc){ v._sc = 1; setTimeout(() => { try{ const n = v.querySelector('.tr-n.next'); if(n && n.getBoundingClientRect().top > innerHeight * 0.7) n.scrollIntoView({ block: 'center', behavior: 'smooth' }); }catch(x){} }, 300); } }\n  function partRow(";
if (s.split(a).length !== 2) { console.error('not unique'); process.exit(1); } s = s.replace(a, b);
const c = "if(v === 'train') open(false); if(v === 'today') paintBanner();", d = "if(v === 'train'){ const t = $('v-train'); if(t) t._sc = 0; open(false); } if(v === 'today') paintBanner();";
if (s.split(c).length !== 2) { console.error('not unique 2'); process.exit(1); } s = s.replace(c, d);
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
