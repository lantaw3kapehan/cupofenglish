// 15 Oct · Stage 2 · student details, leave form and pay reply save in the background (form comes back if refused).
const inc = require('fs').readFileSync(require('path').join(__dirname,'175-bg-saves.inc'),'utf8');
require('../tools/lib.js')(process.argv[2], [
["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"],
["const b = $('sGo'); b.disabled = true; b.textContent = 'Saving…';\ntry{ const r = await api('saveStudent', TOKEN, f, row || 0); if(!r.ok) throw r; closeSheet(); toast(r.note);",
 "const b = $('sGo'); b.disabled = true; b.textContent = 'Saving…'; const _sn = sheetSnap(); closeSheet(); toast('Saving ' + (f.en || f.cn) + '…');\ntry{ const r = await api('saveStudent', TOKEN, f, row || 0); if(!r.ok) throw r; toast(r.note);"],
["catch(e){ toast((e&&e.msg)||'Not saved. Try again.'); b.disabled = false; stuBtn(row?1:0); }",
 "catch(e){ sheetBack(_sn); toast(((e&&e.msg)||'Not saved') + ' · your changes are back in the form. Try again.'); try{ stuBtn(row?1:0); }catch(x){} }"],
["try{ const r = await api('mgmtLeaveSave', TOKEN, f); if(!r.ok) throw r; closeSheet(); toast('✓ ' + r.note); loadLeave(true); }\ncatch(e){ if(b){ b.disabled = false; b.textContent = 'Try again'; } toast((e && (e.msg || e.message)) || 'Not saved. Try again.'); } }",
 "const _sn = sheetSnap(); closeSheet(); toast('Saving leave…');\ntry{ const r = await api('mgmtLeaveSave', TOKEN, f); if(!r.ok) throw r; toast('✓ ' + r.note); loadLeave(true); }\ncatch(e){ sheetBack(_sn); toast(((e && (e.msg || e.message)) || 'Not saved') + ' · the form is back. Try again.'); } }"],
["try{ const r = await api('mgmtPayReply', TOKEN, n, t); if(!r.ok) throw r; PCKM.checks[n.toLowerCase()] = r.check; keep('paychkm', PCKM); closeSheet(); toast('✓ ' + r.note); renderPayroll(); }\ncatch(e){ toast((e && (e.msg || e.message)) || 'Not sent. Try again.'); if(b){ b.disabled = false; b.textContent = 'Send reply'; } } }",
 "const _sn = sheetSnap(); closeSheet(); toast('Sending reply to Teacher ' + n + '…');\ntry{ const r = await api('mgmtPayReply', TOKEN, n, t); if(!r.ok) throw r; PCKM.checks[n.toLowerCase()] = r.check; keep('paychkm', PCKM); toast('✓ ' + r.note); renderPayroll(); }\ncatch(e){ sheetBack(_sn); toast(((e && (e.msg || e.message)) || 'Not sent') + ' · your reply is back. Try again.'); } }"],
]);
