// 676: (Misty) Trainings path climbs from the bottom up: CupOfEnglish Way at the bottom, Master Teacher at the top. Each rank is the
// milestone ABOVE the trainings that lead to it. The screen opens on the teacher's next training.
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const A = "  function pathHtml(d, who, R){\n", Z = "  function paintMy(){ const v = $('v-train');";
const i = s.indexOf(A), j = s.indexOf(Z);
if (i < 0 || j < i || s.indexOf(A, i + 1) > -1) { console.error('pathHtml not found once'); process.exit(1); }
let f = s.slice(i, j);
const rep = (a, b) => { if (f.split(a).length !== 2) { console.error('not unique: ' + a.slice(0, 80)); process.exit(1); } f = f.replace(a, b); };
// 1) build the rows bottom-up (trainings of a rank, then the rank pill above them), then draw them top-down reversed
rep("    let gPrev = null;\n    L.forEach(x => {\n      if(x.t.gate !== gPrev){ gPrev = x.t.gate; const gi = x.gi,",
    "    const G = []; L.forEach(x => { const g = G[G.length - 1]; if(g && g.gate === x.t.gate) g.items.push(x); else G.push({ gate: x.t.gate, gi: x.gi, items: [x] }); });\n" +
    "    const rows = []; G.forEach(g => { g.items.forEach(x => rows.push({ x })); rows.push({ pill: g }); }); rows.reverse();\n" +
    "    rows.forEach(row => {\n      if(row.pill){ const gi = row.pill.gi, gname = row.pill.gate,");
rep("const lab = e(x.t.gate) +", "const lab = e(gname) +");
rep("pills.push('<div class=\"tr-pill ' + cls + '\" style=\"top:' + y + 'px\"><span>' + lab + '</span></div>'); y += 50; }",
    "pills.push('<div class=\"tr-pill ' + cls + '\" style=\"top:' + (y + 6) + 'px\"><span>' + lab + '</span></div>'); y += 50; return; }\n      const x = row.x;");
f = f.replace(/\n      y \+= 84; \}\);\n/, "\n      y += 84; });\n");
s = s.slice(0, i) + f + s.slice(j);
// 2) always open on the next training (the path is long and the start is at the bottom)
const a2 = "if(n && n.getBoundingClientRect().top > innerHeight * 0.7) n.scrollIntoView", b2 = "if(n) n.scrollIntoView";
if (s.split(a2).length !== 2) { console.error('scroll not found'); process.exit(1); } s = s.replace(a2, b2);
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
