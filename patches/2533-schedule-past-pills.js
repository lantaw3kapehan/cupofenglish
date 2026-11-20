// 2533 (final QA): Schedule day strip · past days showed "·" instead of the class count.
// Pills now read the copy already saved on this device, and the two days before yesterday are fetched quietly too.
const file = process.argv[2], fs = require('fs');
let s = fs.readFileSync(file, 'utf8');
const A = 'const k = ymdLocal(d), c = SCC[k] || null;';
const B = "const k = ymdLocal(d), c = SCC[k] || (o !== SC_OFF ? (x => x && x.date === k ? x : null)(kept('sched.' + k)) : null) || null;";
if(!s.includes(A)) throw new Error('2533 pill not found');
s = s.split(A).join(B);
const C = 'for(const o of [1,-1,2,3,4,5,6,7]){';
const D = 'for(const o of [1,-1,2,3,4,5,6,7,-2,-3]){';
if(s.split(C).length !== 2) throw new Error('2533 ahead not single');
s = s.replace(C, D);
const E2 = 'if(c && c._t && Date.now() - c._t < 5*60000) continue;';
if(s.split(E2).length !== 2) throw new Error('2533 skip not single');
s = s.replace(E2, "if(c && c._t && (Date.now() - c._t < 5*60000 || (o < -1 && nk < ymdLocal(new Date())))) continue; if(o < -1 && !c && (x => x && x.date === nk)(kept('sched.' + nk))) continue;");
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
