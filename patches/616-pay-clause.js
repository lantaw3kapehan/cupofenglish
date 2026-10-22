// 22 Oct · Misty: teachers see the clause too. On Pay › Bonuses & deductions, each deduction names the Addendum No. 1 clause it
// falls under (the full rule is in the notice of breach and in My Contract).
require('../tools/lib.js')(process.argv[2], [
['<div class="small mute">${esc(a.date)}${a.student?\' · \'+esc(a.student):\'\'}${a.by?\' · tagged by \'+esc(a.by):\'\'}</div>',
 '<div class="small mute">${esc(a.date)}${a.student?\' · \'+esc(a.student):\'\'}${a.by?\' · tagged by \'+esc(a.by):\'\'}</div>${a.minus && window.NT_RULES && NT_RULES[a.subject] ? `<div class="small" style="color:#9A3A26">Addendum No. 1, Clause ${esc(NT_RULES[a.subject][1])} · ${esc(NT_RULES[a.subject][0])}</div>` : \'\'}'],
]);
