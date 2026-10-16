// 16 Oct · Add expense and Add sale (without an invoice file) save in about a second through the database; Google writes
// the row into EXPENSES / SALES within a minute (same checks as before). A sale with an invoice PDF still goes to Google
// directly (the file is saved to Drive). If the database cannot take it, the save goes to Google exactly as before.
require('../tools/lib.js')(process.argv[2], [
["FAST_M.saveStudent = 1;", "FAST_M.saveStudent = 1;\nFAST_M.addExpense = 1; FAST_M.addSale = 1;   /* 16 Oct: money entries through the database (a sale with an invoice file: Google) */"],
["args[1].linkTrial))); }   /* memos and new students: Google */", "args[1].linkTrial)) && !(fn === 'addSale' && args[1] && args[1].file)); }   /* memos, new students and a sale with an invoice file: Google */"],
["  return { ok: true, queued: true }; }", "  if(fn === 'addExpense') return { ok: true, queued: true, note: 'Expense saved · in EXPENSES within a minute' };\n  if(fn === 'addSale') return { ok: true, queued: true, note: 'Sale saved · in SALES within a minute' };\n  return { ok: true, queued: true }; }"],
["tLeaveRequest: 'Leave request', tPayVerify: 'Pay check' }", "tLeaveRequest: 'Leave request', tPayVerify: 'Pay check', addExpense: 'Expense', addSale: 'Sale' }"],
["try{ const r = await api(fn, TOKEN, f); if(!r.ok) throw r; closeSheet(); toast(r.note);", "if(fn === 'addSale' && (!(f.invoice || (f.file && f.file.name)) || !f.partner)){ b.disabled = false; b.textContent = 'Add sale'; return toast('Invoice/student and partner are needed.'); }   /* checked here too: a fast save is answered before the sheet sees it */\ntry{ const r = await api(fn, TOKEN, f); if(!r.ok) throw r; closeSheet(); toast(r.note);"],
]);
