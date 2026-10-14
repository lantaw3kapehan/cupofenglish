// 14 Oct · After adding a Substitute (SC) class, the result (regular class cancelled, CASE number, "contract: suspension")
// stays on screen as a card at the top of the "Class added" sheet, instead of only a 2-second message.
require('../tools/lib.js')(process.argv[2], [
["try{ classShare(f, r, s); }catch(x){ closeSheet(); }",
 "try{ classShare(f, r, s); if(r.sub) cxSubCard(r.sub); }catch(x){ closeSheet(); }"],
["function cxSheet(){",
 "function cxSubCard(t){ const h = $('sheetBody') && $('sheetBody').querySelector('h1'); if(!h) return; const L = String(t).split(' · ').map(x => x.trim()).filter(Boolean), bad = /NOT /.test(t), sus = /suspension/i.test(t), cs = /CASE /.test(t);\n" +
 "  h.insertAdjacentHTML('afterend', '<div style=\"margin:10px 0 4px;padding:12px 14px;border-radius:14px;background:' + (bad || sus ? '#FFF1EC' : cs ? '#FFF8E6' : '#E8F6F1') + ';color:' + (bad || sus ? '#9A3B22' : cs ? '#8A5A00' : '#1E6B4F') + '\"><b>' + (bad ? '⚠️ Check this' : cs ? 'Substitute · case lodged' : 'Substitute · done') + '</b><div class=\"small\" style=\"margin-top:4px;line-height:1.5\">' + L.map(esc).join('<br>') + '</div>' + (sus ? '<div class=\"small\" style=\"margin-top:6px\"><b>3rd absence this month · contract (d): immediate suspension · decide in Cases</b></div>' : '') + '</div>'); }   /* 14 Oct */\n" +
 "function cxSheet(){"],
]);
