// 14 Oct night · Save enrolment shows a card that stays (Misty: a toast came and went, no way to know it saved).
// While saving: "Saving Ying's enrolment…" card (can be closed; the save carries on). Then the ✓ result card, or the form
// again with a red "Not saved · reason" box at the top.
require('../tools/lib.js')(process.argv[2], [
["closeSheet(); toast('Enrolling ' + S.name + '… (about 30 s · you can keep working)');",
 "openSheet('<h1 id=\"enSaving\">Saving ' + esc(S.name) + '\\'s enrolment…</h1><div class=\"card\" style=\"margin-top:10px;background:#FFF8E6;border-color:#F3D48B\"><b>⏳ Writing it into ACTIVE' + (f.transfer || f.saleRow ? '' : ' and SALES') + '</b><div class=\"small\" style=\"margin-top:4px\">About 30 seconds. You can close this card and keep working · the save carries on and the result opens here when it is done.</div></div>');"],
["whenFree(() => openSheet('<h1>✓ ' + esc(S.name) + ' enrolled</h1>",
 "(($('enSaving') && $('sheet').classList.contains('on')) ? (fn => fn()) : whenFree)(() => openSheet('<h1>✓ ' + esc(S.name) + ' enrolled</h1>"],
["  toast(((e && e.msg) || 'Not saved') + ' · check SALES and ACTIVE before trying again' + (f.file ? ' · choose the invoice file again' : '')); }",
 "  toast(((e && e.msg) || 'Not saved') + ' · check SALES and ACTIVE before trying again' + (f.file ? ' · choose the invoice file again' : ''));\n  try{ const sb = $('sheetBody'); if(sb) sb.insertAdjacentHTML('afterbegin', '<div class=\"card\" style=\"background:#FDECEA;border-color:#F5B7B1;margin-bottom:10px\"><b style=\"color:#B4513B\">Not saved</b><div class=\"small\" style=\"margin-top:2px\">' + esc((e && e.msg) || 'No answer from Google · check your internet') + '</div></div>'); sb.scrollTop = 0; }catch(y){} }"],
]);
