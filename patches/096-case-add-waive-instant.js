// 14 Oct · Speed (Misty: "click → fast, like a website"). Add case (13.7 s) and Waive (12.5 s) waited for the server.
// Now both close / update at once and confirm in the background ("✓ OAR-… added", "✓ Waived · …"). If the server says no,
// a new case's form comes back filled in, and a waive is undone on screen.
require('../tools/lib.js')(process.argv[2], [
["const b = $('cGo'); b.disabled = true; b.textContent = 'Saving…';\ntry{ const r = await api('addCase', TOKEN, f); if(!r.ok) throw r; closeSheet(); toast(r.caseId + ' added'); AC = null; loadActions(); }\ncatch(e){ toast((e&&e.msg)||'Not saved. Try again.'); b.disabled=false; b.textContent='Add case'; }",
 "const ids = { cS: f.subject, cE: f.employee, cT: f.type, cSt: f.student, cSo: f.source, cC: f.condition, cSt2: f.status, cTi: f.tier, cD: f.demerit, cI: f.incentive, cA: f.amount, cX: f.action };\n" +
 "closeSheet(); toast('Saving case · ' + f.employee + '…');   /* 14 Oct: closes at once, saves in the background */\n" +
 "api('addCase', TOKEN, f).then(r => { if(!r || !r.ok) throw r; toast('✓ ' + r.caseId + ' added · ' + f.employee); AC = null; loadActions(); })\n" +
 ".catch(e => { try{ caseSheet(); Object.keys(ids).forEach(k => { const el = $(k); if(el && ids[k] != null) el.value = ids[k]; }); if($('cDone')) $('cDone').checked = !!f.done; }catch(y){} toast((e && e.msg) || 'Case not saved · your details are back in the form. Try again.'); });"],
["try{ const r = await api('mgmtCaseWaive', TOKEN, id, why); if(!r || !r.ok) throw r; x.amount = '0'; x.demerit = ''; x.done = true; if(r.action) x.action = r.action + (x.action ? '\\n' + x.action : ''); keep('actions', AC); renderActions(); caseView(id); toast('✓ Waived · ' + x.employee); }\ncatch(e){ toast(",
 "const was = { amount: x.amount, demerit: x.demerit, done: x.done, action: x.action };\n" +
 "x.amount = '0'; x.demerit = ''; x.done = true; x.action = 'Waived · ' + why + (x.action ? '\\n' + x.action : ''); keep('actions', AC); renderActions(); caseView(id); toast('Waiving · ' + x.employee + '…');   /* 14 Oct: shown at once */\n" +
 "try{ const r = await api('mgmtCaseWaive', TOKEN, id, why); if(!r || !r.ok) throw r; if(r.action) x.action = r.action + (was.action ? '\\n' + was.action : ''); keep('actions', AC); renderActions(); if($('cwBox') === null && $('sheet').classList.contains('on')) try{ caseView(id); }catch(y){} toast('✓ Waived · ' + x.employee); }\n" +
 "catch(e){ Object.assign(x, was); keep('actions', AC); renderActions(); try{ caseView(id); }catch(y){} toast("],
]);
