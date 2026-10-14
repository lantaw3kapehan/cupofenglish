// 14 Oct · Speed (Misty: "saving is taking time", 13:53). After an update the app loaded ~35 screens at once; reads that were
// not in the background queue (availability, pay checks, visits, reports wait…) ran all together, so a save waited 10 s.
// 1) Those reads now also go through the background queue (3 at a time; anything just tapped still goes first).
// 2) Add expense closes at once and saves in the background; "✓ Expense added" when the sheet confirms; if it fails the
//    form comes back with the details filled in.
require('../tools/lib.js')(process.argv[2], [
["if(!API_READ.test(fn)) return apiNow(fn, ...args);",
 "if(!API_READ.test(fn) && !API_BG.test(fn)) return apiNow(fn, ...args);   /* 14 Oct: API_BG reads also wait in the queue */"],
["function apiPump(){",
 "const API_BG = /^(mgmtAvailAll|mgmtPayChecks|mgmtVisitCoverage|mgmtMonDay|mgmtReportsWait|mgmtAgreeMap|mgmtEnqList|mgmtMsgs|mgmtHours|mgmtWeekSum|mgmtRemindLog|mgmtReminders|mgmtTeacherVisits|mgmtPeerMonth|mgmtPayReady|tFbStatus)$/;\n" +
 "function apiPump(){"],
["const b = $('fGo'); b.disabled = true; b.textContent = 'Saving…';\ntry{ const r = await api(fn, TOKEN, f);",
 "const b = $('fGo'); b.disabled = true; b.textContent = 'Saving…';\n" +
 "if(fn === 'addExpense'){ if(!f.desc || !f.category || !(+f.amount)){ b.disabled = false; b.textContent = 'Add expense'; return toast('Description, category and amount are needed.'); }\n" +
 "  closeSheet(); toast('Saving expense…');   /* 14 Oct: closes at once, saves in the background */\n" +
 "  api(fn, TOKEN, f).then(r => { if(!r || !r.ok) throw r; toast('✓ ' + (r.note || 'Expense added')); MN = null; loadMoney(); })\n" +
 "  .catch(async e => { try{ await expSheet(); [['fD', f.date], ['fE', f.desc], ['fC', f.category], ['fA', f.amount]].forEach(([id, x]) => { const el = $(id); if(el) el.value = x; }); }catch(y){} toast((e && e.msg) || 'Expense not saved · your details are back in the form. Try again.'); });\n" +
 "  return; }\n" +
 "try{ const r = await api(fn, TOKEN, f);"],
]);
