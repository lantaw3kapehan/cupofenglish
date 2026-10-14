// 14 Oct · Misty: (1) a teacher who told us 4 hours or more before class gets NO case (like approved leave) · only under 4 h
// or no notice is Teacher Absence · Unexcused. (2) Cases › Waive: keeps the case on record at ₱0 / 0 points (server mgmtCaseWaive).
require('../tools/lib.js')(process.argv[2], [
["t = (ok ? '<b style=\"color:#B7791F\">CASE · Teacher Absence · Excused</b>' : '<b style=\"color:#9A3B22\">CASE · Teacher Absence · Unexcused</b>') + ' <span class=\"mute\">· told us ' + esc(ht) + (ok ? ' (4 h or more)' : ' (under 4 h)') + ' · amount from POLICY</span>';",
 "t = (ok ? '<span style=\"color:#2E8B57\">No case · told us ' + esc(ht) + ' (4 h or more)</span>' : '<b style=\"color:#9A3B22\">CASE · Teacher Absence · Unexcused</b> <span class=\"mute\">· told us ' + esc(ht) + ' (under 4 h) · amount from POLICY</span>');"],
["<label class=\"check\"><input type=\"checkbox\" ${x.done?'checked':''} onchange=\"caseDone('${esc(id)}',this.checked)\"><span>Completed</span></label>`);",
 "<label class=\"check\"><input type=\"checkbox\" ${x.done?'checked':''} onchange=\"caseDone('${esc(id)}',this.checked)\"><span>Completed</span></label>\n" +
 "${x.amount && x.amount !== '0' && !/^Waived/.test(x.action || '') ? `<div id=\"cwBox\" style=\"margin-top:14px\"><input id=\"cwWhy\" class=\"in-t\" placeholder=\"Reason, e.g. informed us in advance\"><button class=\"btn ghost block\" style=\"margin-top:8px\" onclick=\"caseWaive('${esc(id)}')\">Waive · no penalty, keep on record</button></div>` : /^Waived/.test(x.action || '') ? '<div class=\"fbdone\" style=\"margin-top:12px\">Waived · no penalty</div>' : ''}`);"],
["async function caseDone(id, v){",
 "async function caseWaive(id){ const x = AC.rows.find(y => y.id === id); if(!x) return; const why = (($('cwWhy') || {}).value || '').trim(); if(!why) return toast('Write the reason first');\n" +
 "if(!confirm('Waive ' + id + ' (' + x.employee + ', ' + x.amount + ')? It stays on record with no penalty.')) return;\n" +
 "try{ const r = await api('mgmtCaseWaive', TOKEN, id, why); if(!r || !r.ok) throw r; x.amount = '0'; x.demerit = ''; x.done = true; if(r.action) x.action = r.action + (x.action ? '\\n' + x.action : ''); keep('actions', AC); renderActions(); caseView(id); toast('✓ Waived · ' + x.employee); }\n" +
 "catch(e){ toast((e && e.msg) || (/unknown action/i.test(String(e && (e.msg || e.message))) ? 'Server part not installed yet' : 'Not saved. Try again.')); } }   /* 14 Oct */\n" +
 "async function caseDone(id, v){"],
]);
