// 19 Oct · 305 · Teacher Excellence: new level lines (Misty) — Gold 88+ · Silver 78+ · Bronze 65+ · Developing below; Quality 35 = Reliability 35 · Progress 15 · Trust 15.
// Changes the level track, side-menu bar, chart lines, "points to …" and the explanations, only inside the Teacher Excellence scripts (289–299).
const fs = require('fs'), file = process.argv[2], s = fs.readFileSync(file, 'utf8');
const a = s.indexOf('/* 19 Oct · 289'), b = s.indexOf('/* 19 Oct · 300');
if(a < 0 || b < a) { console.error('Teacher Excellence scripts not found'); process.exit(1); }
const old = s.slice(a, b); let nw = old;
const R = [
  ["[[0, 55, 'Developing'], [55, 70, 'Bronze'], [70, 85, 'Silver'], [85, 100, 'Gold']]", "[[0, 65, 'Developing'], [65, 78, 'Bronze'], [78, 88, 'Silver'], [88, 100, 'Gold']]"],
  ["${seg(0, 55, 'Developing')}${seg(55, 70, 'Bronze')}${seg(70, 85, 'Silver')}${seg(85, 100, 'Gold')}", "${seg(0, 65, 'Developing')}${seg(65, 78, 'Bronze')}${seg(78, 88, 'Silver')}${seg(88, 100, 'Gold')}"],
  ["[['Developing', 0], ['Bronze', 55], ['Silver', 70], ['Gold', 85]]", "[['Developing', 0], ['Bronze', 65], ['Silver', 78], ['Gold', 88]]"],
  ["transform:translateX(-' + (x[1] === 85 ? 30 : 50) + '%)", "transform:translateX(-' + (x[1] === 88 ? 30 : 50) + '%)"],
  ["[[55, 'Bronze'], [70, 'Silver'], [85, 'Gold']]", "[[65, 'Bronze'], [78, 'Silver'], [88, 'Gold']]"],
  ["const nx = t < 55 ? ['Bronze', 55] : t < 70 ? ['Silver', 70] : t < 85 ? ['Gold', 85] : null;", "const nx = t < 65 ? ['Bronze', 65] : t < 78 ? ['Silver', 78] : t < 88 ? ['Gold', 88] : null;"],
  ["Gold 85+ · Silver 70+ · Bronze 55+", "Gold 88+ · Silver 78+ · Bronze 65+"],
  ["Quality 40 (your monthly QA and daily class visits) · Reliability 30 (attendance, class videos, class record, hours) · Progress 15 · Trust 15.", "Quality 35 (your monthly QA and daily class visits) · Reliability 35 (attendance, class videos, class record, hours) · Progress 15 · Trust 15."],
  ["Quality 40 (monthly QA 55%, daily class visits 40%, peers 5%) · Reliability 30 (", "Quality 35 (monthly QA 55%, daily class visits 40%, peers 5%) · Reliability 35 ("]];
for(const [x, y] of R){ const n = nw.split(x).length - 1; if(!n){ console.error('not found: ' + x.slice(0, 80)); process.exit(1); } nw = nw.split(x).join(y); }
require('../tools/lib.js')(file, [[old, nw]]);
