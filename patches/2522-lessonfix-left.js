// 2522 (Sunny ST-2025-011): "Correct a month" gets a tick box "Never counted anywhere: also take them off Lessons left".
//   Without it (as before) only the month and "used" change, which is right when the sheet already had the lessons (Chenyu, first months).
//   With it, "lessons left" goes down by the same amount (lessons the sheet never counted, e.g. Mayi's 1–2 March classes), so the summary agrees.
//   coe-ops v19 stores the flag and closes open reports / problems that name the student.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["+ '<button class=\"btn teal sm\" onclick=\"lf2456(\\'' + E(U) + '\\')\">Save</button></div></div>';",
   "+ '<label class=\"small\" style=\"display:flex;gap:6px;align-items:center;flex-basis:100%;color:#4A4566\"><input type=\"checkbox\" id=\"lfL\"> These lessons were never counted anywhere (missing classes): also take them off Lessons left</label>'\n      + '<button class=\"btn teal sm\" onclick=\"lf2456(\\'' + E(U) + '\\')\">Save</button></div></div>';"],
  ["body: JSON.stringify({ token: TOKEN, op: 'lessonfix', code: code, ym: ym, v: undo ? null : +v, was: was, note: undo ? 'undo' : note })",
   "body: JSON.stringify({ token: TOKEN, op: 'lessonfix', code: code, ym: ym, v: undo ? null : +v, was: was, note: undo ? 'undo' : note, left: !undo && !!(($('lfL') || {}).checked) })"],
  ["return { code: String(p[0] || '').toUpperCase(), ym: p[1], v: x.v, was: x.was }; }",
   "return { code: String(p[0] || '').toUpperCase(), ym: p[1], v: x.v, was: x.was, left: !!x.left }; }"],
  ["tot = r1(R.reduce(function(a, r){ return a + val(r); }, 0)), d = r1(f.v - tot); if(!d) return;",
   "tot = r1(R.reduce(function(a, r){ return a + val(r); }, 0)), d = r1(f.v - tot); if(!d) return;\n    if(f.left){ var ar = R.filter(function(r){ return r[C.available] !== '' && r[C.available] != null; })[0]; if(ar) ar[C.available] = r1((+ar[C.available] || 0) - d); }   /* 2522 */"]
]);
