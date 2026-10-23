// 702: (Misty) TESOL designations for books & specializations: In training → Training completed → Qualified to teach (the badge, ★),
// or Requires further training. Attending a live book training now makes it "Training completed"; management then marks
// "Qualified to teach" (after observing a class, demo or check). Mandatory path trainings are unchanged (Done / Assign / Excuse).
const fs = require('fs'), F = process.argv[2]; { let s = fs.readFileSync(F, 'utf8'); const A = "const lab = t => t.id === 'trial' ? 'Trial classes' : t.title.split(' · ')[0].replace(/ Specialization$/, '');";
  if(s.split(A).length !== 3){ console.error('lab: expected 2'); process.exit(1); } s = s.split(A).join(A.replace("/ Specialization$/, '')", "/ Specialization$/, '').replace(/^Phonics Training$/, 'Phonics')")); fs.writeFileSync(F, s); }
require('../tools/lib.js')(process.argv[2], [
// helpers
["  function profHtml(d, who, rank){", `  /* 702: book / specialization designations (status stored: assigned · completed · done · further) */
  const UST = { assigned: ['In training', '#B8742A'], completed: ['Training completed', '#3F6FB5'], done: ['Qualified to teach', '#00737B'], further: ['Requires further training', '#C2483A'] };
  function uSt(d, who, t){ const r = latestRec(d.records, who, t.id), s = r && UST[r.status]; return s && r.status !== 'done' ? '<small style="display:block;font-size:11px;font-weight:700;color:' + s[1] + '">' + s[0] + '</small>' : ''; }
  function uBtns(name, id){ const b = (st, lab, cls) => '<button class="btn ' + cls + '" onclick="trTick(\\'' + e(name) + '\\',\\'' + id + '\\',' + (st === 'assigned' ? '\\'assigned\\'' : 'null') + ',\\'' + st + '\\')">' + lab + '</button>';
    return '<div class="small mute" style="margin-top:12px">Set status · the badge shows only at <b>Qualified to teach</b></div><div class="row" style="gap:8px;margin-top:6px;flex-wrap:wrap">' + b('done', '✓ Qualified to teach', 'teal grow') + b('completed', 'Training completed', 'ghost') + b('assigned', 'In training', 'ghost') + b('further', 'Requires further training', 'ghost') + '</div>'; }
  function profHtml(d, who, rank){`],
// management sheet for one teacher × one book
[`+ '<div class="row" style="gap:8px;margin-top:12px;flex-wrap:wrap"><button class="btn teal grow" onclick="trTick(\\'' + e(name) + '\\',\\'' + id + '\\')">✓ Done</button>`,
 `+ (t.kind === 'unlock' ? uBtns(name, id) + '<div style="display:none">' : '<div class="row" style="gap:8px;margin-top:12px;flex-wrap:wrap">') + '<button class="btn teal grow" onclick="trTick(\\'' + e(name) + '\\',\\'' + id + '\\')">✓ Done</button>`],
["e(r.status) + ' · ' + e(r.via)", "e(t.kind === 'unlock' && UST[r.status] ? UST[r.status][0] : r.status) + ' · ' + e(r.via)"],
["done_at: (status || 'done') === 'done' && d0 ? d0 + 'T12:00:00+08:00' : null });", "done_at: ['done', 'completed'].includes(status || 'done') && d0 ? d0 + 'T12:00:00+08:00' : null });"],
// table cells + legend
[": rec && rec.status === 'assigned' ? '<b class=\"dt\">assigned</b>'", ": rec && rec.status === 'completed' ? '<i class=\"d c\" title=\"Training completed · not yet qualified\"></i>' : rec && rec.status === 'further' ? '<i class=\"d f\" title=\"Requires further training\"></i>' : rec && rec.status === 'assigned' ? '<b class=\"dt\">' + (t.kind === 'unlock' ? 'in training' : 'assigned') + '</b>'"],
["<div class=\"tx-lg\"><span><i class=\"d y\"></i>done</span>", "<div class=\"tx-lg\"><span><i class=\"d y\"></i>' + (tab === 'path' ? 'done' : 'qualified to teach') + '</span>' + (tab === 'path' ? '' : '<span><i class=\"d c\"></i>training completed</span><span><b class=\"dt\">in training</b></span><span><i class=\"d f\"></i>requires further training</span>') + '"],
[".tx .d.x{background:#CFCDD9}", ".tx .d.x{background:#CFCDD9}\n.tx .d.c{border:3px solid #5D8FD6;background:#fff}\n.tx .d.f{background:#fff;border:2px solid #C2483A;position:relative}.tx .d.f::after{content:'!';position:absolute;inset:0;display:grid;place-items:center;font-size:10px;font-weight:700;color:#C2483A}"],
// bulk tick for a book column
["howSel('tcV') + '</div>'", "howSel('tcV') + (t.kind === 'unlock' ? '<label class=\"small mute\">Status</label><select id=\"tcSt\" style=\"width:100%;margin:4px 0 0\"><option value=\"done\">Qualified to teach</option><option value=\"completed\">Training completed</option><option value=\"assigned\">In training</option></select>' : '') + '</div>'"],
["training_id: id, status: 'done', via, done_at: dd ? dd + 'T12:00:00+08:00' : null })), b);", "training_id: id, status: ($('tcSt') || {}).value || 'done', via: ($('tcSt') || {}).value === 'assigned' ? 'assigned' : via, done_at: dd && (($('tcSt') || {}).value || 'done') !== 'assigned' ? dd + 'T12:00:00+08:00' : null })), b);"],
// teacher tiles + one-training sheet
["e(t.id === 'trial' ? 'Trial classes' : t.title.split(' · ')[0].replace(/ Specialization$/, '')) + '</button>').join('') + '</div>').join('') + '</section>'", "e(t.id === 'trial' ? 'Trial classes' : t.title.split(' · ')[0].replace(/ Specialization$/, '').replace(/^Phonics Training$/, 'Phonics')) + uSt(d, who, t) + '</button>').join('') + '</div>').join('') + '</section>'"],
["<b style=\"color:#00737B\">✓ Done ' + e(fmtD(rec.done_at))", "<b style=\"color:#00737B\">✓ ' + (t.kind === 'unlock' ? 'Qualified to teach · ' : 'Done ') + e(fmtD(rec.done_at))"],
["    else if(rec && rec.status === 'excused') h += '<div class=\"card\" style=\"margin-top:12px\"><b>Excused</b>'", "    else if(rec && t.kind === 'unlock' && UST[rec.status]) h += '<div class=\"card\" style=\"margin-top:12px\"><b style=\"color:' + UST[rec.status][1] + '\">' + UST[rec.status][0] + (rec.done_at ? ' · ' + e(fmtD(rec.done_at)) : '') + '</b>' + (rec.status === 'completed' ? '<div class=\"small mute\">Management marks you Qualified to teach after checking a class.</div>' : '') + (rec.note ? '<div class=\"small\" style=\"margin-top:4px\">' + e(rec.note) + '</div>' : '') + '</div>';\n    else if(rec && rec.status === 'excused') h += '<div class=\"card\" style=\"margin-top:12px\"><b>Excused</b>'"],
// wording
["<b class=\"tx-bl\">Cleared to teach:</b>", "<b class=\"tx-bl\">Qualified to teach:</b>"],
["<span class=\"k\">Cleared to teach</span>", "<span class=\"k\">Qualified to teach</span>"],
["Books and specializations you are cleared to teach appear here as management ticks them.", "Books and specializations you are qualified to teach appear here as management marks them."],
["b.title = 'Cleared to teach ' + n", "b.title = 'Qualified to teach ' + n"],
]);
