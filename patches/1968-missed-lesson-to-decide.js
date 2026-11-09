// 1968: (Misty 9 Nov 13:03 "we have to return Penny's lesson since Mayi was absent … how to settle that and for long term and others? since
//   we're automating all, 25 minute class, so we return 0.5 too")
//   A class cancelled with "Who asked? Teacher" now appears with the lates to decide as "Missed lesson" (database 1968). Excused / Unexcused
//   make the "Teacher Missed Lesson" case from POLICY (New ₱100 / ₱300, Regular ₱300 / ₱500); Waive = no penalty. It is never decided
//   automatically. The lesson is already back with the student (a cancelled class is never counted as held; 25 min = 0.5, 50 min = 1).
//   Here: the entry reads "class 16:00 · cancelled 27 h before" instead of "tapped …", without the 24 h auto-Unexcused note,
//   and the confirm sheet names the right case.
const file = process.argv[2];
const ML = "const mlx1968 = x => x.kind === 'Missed lesson';\nconst mlNote1968 = x => { const m = +x.mins; if(!isFinite(m)) return 'cancelled'; const a = Math.abs(m), t = a >= 120 ? Math.round(a / 60) + ' h' : a + ' min'; return 'cancelled ' + t + (m >= 0 ? ' before' : ' after start'); };\n";
require('../tools/lib.js')(file, [
  ["function decide(row, cond){", ML + "function decide(row, cond){"],
  ["<p class=\"small\" style=\"margin-top:12px\">${cond==='Waive'?'No penalty. The entry is marked Waived.':'Adds a '+(x.kind==='Late time-in'?'Teacher Late Time-in':'Teacher Late to Class')+' row at the top of ACTIONS.",
   "<p class=\"small\" style=\"margin-top:12px\">${cond==='Waive'?'No penalty. The entry is marked Waived.':'Adds a '+(x.kind==='Late time-in'?'Teacher Late Time-in':mlx1968(x)?'Teacher Missed Lesson':'Teacher Late to Class')+' row at the top of ACTIONS."],
  ["<div class=\"small mute\">${esc(x.date)} · in ${esc(x.time)}${x.first ? ' · class ' + esc(x.first) : ''}${x.mins !== '' ? ' · ' + Math.abs(x.mins) + ' min ' + (x.mins >= 0 ? 'before' : 'after') : ''}${x.cls ? ' · ' + esc(x.cls) : ''}</div>",
   "<div class=\"small mute\">${mlx1968(x) ? esc(x.date) + ' · class ' + esc(x.first) + ' · ' + mlNote1968(x) + (x.cls ? ' · ' + esc(x.cls) : '') + ' · lesson returned to the student' : `${esc(x.date)} · in ${esc(x.time)}${x.first ? ' · class ' + esc(x.first) : ''}${x.mins !== '' ? ' · ' + Math.abs(x.mins) + ' min ' + (x.mins >= 0 ? 'before' : 'after') : ''}${x.cls ? ' · ' + esc(x.cls) : ''}`}</div>"],
  ["const row = x => '<div class=\"lqm-it\"><div class=\"grow\"><b>' + esc(typeof tName === 'function' ? tName(x.teacher) : x.teacher) + ' · ' + esc(x.kind) + (x.mins !== '' && x.mins != null ? ' · ' + Math.abs(+x.mins) + ' min' + (+x.mins > 0 ? ' before' : ' after start') : '') + '</b>'",
   "const ml = x => x.kind === 'Missed lesson', mlN = x => { const m = +x.mins, a = Math.abs(m); return isFinite(m) ? 'cancelled ' + (a >= 120 ? Math.round(a / 60) + ' h' : a + ' min') + (m >= 0 ? ' before' : ' after start') : 'cancelled'; };\n    const row = x => '<div class=\"lqm-it\"><div class=\"grow\"><b>' + esc(typeof tName === 'function' ? tName(x.teacher) : x.teacher) + ' · ' + esc(x.kind) + (ml(x) ? '' : x.mins !== '' && x.mins != null ? ' · ' + Math.abs(+x.mins) + ' min' + (+x.mins > 0 ? ' before' : ' after start') : '') + '</b>'"],
  ["+ '<div class=\"small mute\">' + esc(x.date) + ' · tapped ' + esc(x.time) + (x.first ? ' · class ' + esc(x.first) : '') + (x.cls ? ' · ' + esc(x.cls) : '') + (due(x) ? ' · <span style=\"color:#B4532F\">auto Unexcused ' + esc(due(x)) + '</span>' : '') + '</div>'",
   "+ '<div class=\"small mute\">' + (ml(x) ? esc(x.date) + ' · class ' + esc(x.first) + ' · ' + mlN(x) + (x.cls ? ' · ' + esc(x.cls) : '') + ' · lesson returned to the student · no automatic decision' : esc(x.date) + ' · tapped ' + esc(x.time) + (x.first ? ' · class ' + esc(x.first) : '') + (x.cls ? ' · ' + esc(x.cls) : '') + (due(x) ? ' · <span style=\"color:#B4532F\">auto Unexcused ' + esc(due(x)) + '</span>' : '')) + '</div>'"],
]);
