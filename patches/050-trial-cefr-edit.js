// Trial report: management can change the CEFR level (e.g. the teacher put A2 but the child is A1). Writes TR-DATA "CEFR override"
// and clears the PDF link, so a new parent PDF is made with the right level at the sheet's next hourly sync (server mgmtTrialCefrSave, v352).
require('../tools/lib.js')(process.argv[2], [
[
"if(el && TLD && TLD.redo && !$('rdN'))",
"if(el && TLD && TLD.label && !$('lvB')) el.insertAdjacentHTML('afterend', '<div id=\"lvB\" style=\"width:100%;margin-top:10px\"><div class=\"small\"><b>Level on the report</b> <span class=\"mute\">· tap to change · a new PDF is made within about an hour</span></div><div class=\"row\" style=\"gap:6px;flex-wrap:wrap;margin-top:6px\">' + ['Pre-A1', 'A1', 'A2', 'B1', 'B2', 'C1'].map(v => '<button type=\"button\" class=\"btn sm ' + (String(TLD.cefr) === v ? 'teal' : 'ghost') + '\" onclick=\"tlCefr(\\'' + v + '\\')\">' + v + '</button>').join('') + '</div></div>');\nif(el && TLD && TLD.redo && !$('rdN'))"
],
[
"window.tlRedo = function(){",
"window.tlCefr = async function(v){ if(!TLD || !TLD.label || String(TLD.cefr) === v) return; if(!confirm('Change ' + TLD.student + '\\'s level from ' + (TLD.cefr || '—') + ' to ' + v + '?\\nThe parent PDF will be made again with ' + v + '.')) return;\ntry{ const r = await api('mgmtTrialCefrSave', TOKEN, TLD.label, v); if(!r || !r.ok) throw r; TLD.cefr = r.cefr; if(r.remade){ TLD.pdf = ''; TLB = null; if(TLD.status !== 'Sent') TLD.status = 'Making PDF'; } toast(TLD.student + ' · level ' + r.cefr + (r.remade ? ' · new PDF within about an hour' : '')); TRL = null; loadTrials(); tlPaint(); }\ncatch(e){ toast((e && e.msg) || 'Not saved. Check your internet and try again.'); } };\nwindow.tlRedo = function(){"
]
]);
