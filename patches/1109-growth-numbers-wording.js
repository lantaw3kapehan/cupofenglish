// 1109: (Misty 14:05) Growth numbers say what they count — they matched nothing on Students / Pay because of their labels.
// Checked against the server code and real data (read-only, 26 Oct):
// · Growth "classes this month" was really LESSON UNITS (T-DASH current REG + TRIAL + SUB; a 25-min class = ½ unit), from a
//   copy cached up to 6 h. Pay shows the same T-DASH units live. Real data: April 134 classes taught = 73 units (Pay 73,
//   Growth 70 from the cached copy); Dezza 96 classes = 54.5 units (Pay 54.5, Growth 53).
//   → Teacher: the tile now shows the SAME units as Pay (D.me, the live copy) with "Regular · Trial · Sub" under it and is
//     called "lesson units this month". Management's view of a teacher and the Performance list say "units", not "classes".
// · Growth "monthly feedback written" was really PROGRESS CHECKS (PR-DATA rows by check date, this calendar month). Real data:
//   April 1, Mayi 3, Julia 3 = their October progress checks; their monthly feedback for October classes (cycle 2026-11,
//   due 9 Nov) is 0 of 22 (April), 0 of 19 (Dezza) — what Students shows.
//   → Teacher: the tile shows monthly feedback from the same list as Students ("Written N of M · October classes · due …"),
//     with the progress checks named under it. Without that list (management's view) it is called "progress checks".
// Display only: no number is recalculated on the server, nothing about pay, feedback or records changes.
const fs = require('fs'), file = process.argv[2];
require('../tools/lib.js')(file, [
  ["[k.units != null ? k.units : '—', 'classes this month', k.rank ? esc(k.rank) : '', ''],",
   "(typeof g1109U === 'function' ? g1109U(mgr, k) : [k.units != null ? k.units : '—', 'units this month', k.rank ? esc(k.rank) : '', '']),"],
  ["[k.feedback || 0, 'monthly feedback written', pm + ' total: ' + (p.feedback||0), ''],",
   "(typeof g1109F === 'function' ? g1109F(mgr, k, p, pm) : [k.feedback || 0, 'progress checks this month', pm + ': ' + (p.feedback||0), '']),"],
  ["t.units+' classes this month'", "t.units+' units this month'"],
  ["<span>Feedback</span>", "<span title=\"Progress checks written this month\">Progress checks</span>"],
]);
let s = fs.readFileSync(file, 'utf8');
const js = String.raw`
/* 1109 · Growth tiles: same units as Pay, monthly feedback from the same list as Students, progress checks named */
function g1109U(mgr, k){ var n = function(v){ return Math.round((+v || 0) * 10) / 10; };
  try{ var me = !mgr && typeof D !== 'undefined' && D && D.me; if(me && (me.nowReg != null || me.nowTrial != null || me.nowSub != null)){
    var t = n((me.nowReg || 0) + (me.nowTrial || 0) + (me.nowSub || 0));
    return [t, 'lesson units this month', 'Regular ' + n(me.nowReg) + ' · Trial ' + n(me.nowTrial) + ' · Sub ' + n(me.nowSub) + ' · same as Pay', '']; } }catch(e){}
  return [k.units != null ? k.units : '—', 'lesson units this month', (k.rank ? esc(k.rank) + ' · ' : '') + 'Regular + Trial + Sub', '']; }
function g1109F(mgr, k, p, pm){ var pc = (k.feedback || 0) + ' progress check' + ((k.feedback || 0) === 1 ? '' : 's') + ' this month';
  try{ if(!mgr && typeof FB !== 'undefined' && FB && FB.students && FB.students.length){
    var L = FB.students, done = L.filter(function(x){ return x.done; }).length, lbl = (typeof fbLbl === 'function' ? fbLbl() : FB.label || '').split(' ')[0];
    var open = typeof fbOpen === 'function' ? fbOpen() : true;
    return [done + ' of ' + L.length, 'monthly feedback written', esc(lbl) + ' classes · ' + (open ? (FB.dueLabel ? 'due ' + esc(FB.dueLabel) : 'open') : 'opens ' + esc(FB.opensLabel || '')) + ' · ' + pc, '']; } }catch(e){}
  return [k.feedback || 0, 'progress checks this month', pm + ': ' + (p.feedback || 0), '']; }
`;
const i = s.lastIndexOf('</body>');
s = s.slice(0, i) + '<script>' + js + '</script>\n' + s.slice(i);
fs.writeFileSync(file, s);
