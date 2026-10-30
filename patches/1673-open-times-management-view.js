// 1673: (Misty, 30 Oct 11:08) "This is the picture for partners. Where do we see the open slots for management access?"
// Teachers › All teachers · open times: the table under the teacher buttons is now management's working view.
//   · Each day column shows its date (e.g. 30/10), so management sees exactly which week it is.
//   · Each open time is a button: one tap opens Add class with the teacher, date, time and length already filled in (the same booking
//     form as the teacher's own open-slots page).
//   · Each teacher's name opens her full open-slots page (dated week, booked classes, teaching hours).
// The partner picture and the copied text are unchanged (no dates, open times only).
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["const rows = chosen.map(t => { const W = avaTW(t); return `<tr><th style=\"text-align:left;padding:6px 8px;white-space:nowrap\">${esc(t.name)}</th>${W.map(x => `<td style=\"padding:4px;vertical-align:top;text-align:center\">${x.free.length ? x.free.map(v => `<span class=\"chip teal\" style=\"margin:2px;display:inline-block\">${avT(v)}</span>`).join('') : x.full ? '<span class=\"small\" style=\"color:#E0533D;font-weight:700\">Full</span>' : '<span class=\"small mute\">—</span>'}</td>`).join('')}</tr>`; }).join('');",
   "const W0 = chosen.length ? avaTW(chosen[0]) : [];\nconst rows = chosen.map(t => { const W = avaTW(t); return `<tr><th style=\"text-align:left;padding:6px 8px;white-space:nowrap\"><a href=\"javascript:void(0)\" title=\"Open Teacher ${esc(t.name)}'s open slots\" onclick=\"avOpen('${esc(t.name)}')\">${esc(t.name)}</a></th>${W.map(x => `<td style=\"padding:4px;vertical-align:top;text-align:center\">${x.free.length ? x.free.map(v => `<button type=\"button\" class=\"chip teal\" style=\"margin:2px;display:inline-block;cursor:pointer;border:0;font:inherit\" title=\"Book Teacher ${esc(t.name)} at ${avT(v)}\" onclick=\"avaBook1673('${esc(t.name)}',${+new Date(v)})\">${avT(v)}</button>`).join('') : x.full ? '<span class=\"small\" style=\"color:#E0533D;font-weight:700\">Full</span>' : '<span class=\"small mute\">—</span>'}</td>`).join('')}</tr>`; }).join('');"],
  ["<th style=\"padding:4px\">${d}<div class=\"small mute\">周${AV_WZ[i]}</div></th>",
   "<th style=\"padding:4px\">${d}<div class=\"small mute\">${W0[i] ? String(W0[i].d.getDate()).padStart(2, '0') + '/' + String(W0[i].d.getMonth() + 1).padStart(2, '0') : '周' + AV_WZ[i]}</div></th>"],
  ["function avaAll(on){",
   "function avaBook1673(n, t){ const x = AVA && AVA.teachers.find(y => y.name === n); if(!x) return; AVD = { name: x.name, days: (x.days || ['', '', '', '', '', '', '']).concat(['', '', '', '', '', '', '']).slice(0, 7), busy: x.busy || [], from: AVA.from, len: AVA.len, wk: AVA.wk }; avBook(t); }\nfunction avaAll(on){"]
]);
