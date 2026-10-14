// 14 Oct pm · Teachers: the last slow actions (Misty: "finish items 1–4").
// Message to management, leave request (with the proof file) and the pay check now confirm at once through the fast layer;
// the sheet gets them within a minute with the same checks (replayed at the time tapped). The new message / leave request
// shows in the teacher's list after about a minute (the list reloads by itself). Refusals show in the "Not sent" box on Today.
// (Item 1, every student page ready for each teacher, is the server paste SERVER-TEACHER-FINISH.)
require('../tools/lib.js')(process.argv[2], [
["FAST_W = { saveNote: 1, markHomework: 1, tNoteTag: 1, tGoalsSave: 1, timeIn: 1, classIn: 1, tFbSubmit: 1, tPcSubmit: 1, tTrialSubmit: 1, tPeerSubmit: 1, tSetMeet: 1, tMsgAck: 1, tVisitAck: 1, tMsgSeen: 1, tHwFlag: 1 };",
 "FAST_W = { saveNote: 1, markHomework: 1, tNoteTag: 1, tGoalsSave: 1, timeIn: 1, classIn: 1, tFbSubmit: 1, tPcSubmit: 1, tTrialSubmit: 1, tPeerSubmit: 1, tSetMeet: 1, tMsgAck: 1, tVisitAck: 1, tMsgSeen: 1, tHwFlag: 1, tMsgSend: 1, tLeaveRequest: 1, tPayVerify: 1 };"],
["  if(fn === 'tSetMeet') return { ok: true, queued: true, meet: args[2] };",
 "  if(fn === 'tSetMeet') return { ok: true, queued: true, meet: args[2] };\n" +
 "  if(fn === 'tMsgSend') return { ok: true, queued: true, note: 'Sent · management sees it in the app' };\n" +
 "  if(fn === 'tLeaveRequest') return { ok: true, queued: true, note: 'Leave request sent · it shows in your list within a minute', classes: 0 };\n" +
 "  if(fn === 'tPayVerify'){ const ok = !!args[2], c0 = (typeof PCK !== 'undefined' && PCK && PCK.check) || {}, net = (typeof PCK !== 'undefined' && PCK && PCK.me && PCK.me.net) || '', d = new Date(), at = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ' ' + t;\n" +
 "    return { ok: true, queued: true, check: Object.assign({}, c0, { status: ok ? 'Verified' : 'Disputed', net: net, note: ok ? (c0.note || '') : (c0.note && c0.status !== 'Verified' ? c0.note + '\\n' : '') + at + ' · ' + String(args[3] || ''), at: new Date().toISOString().slice(0, 16).replace('T', ' ') }), note: ok ? 'Thank you · management sees your pay is verified' : 'Sent · management sees your note on Payroll' }; }"],
["try{ const r = await api('tMsgSend', TOKEN, t, parent || '', po); if(!r.ok) throw r; toast('✓ ' + r.note); await loadTMsgs(); if(parent) tMsgOpen(parent); }",
 "try{ const r = await api('tMsgSend', TOKEN, t, parent || '', po); if(!r.ok) throw r; toast('✓ ' + r.note); if(r.queued){ setTimeout(loadTMsgs, 75000); if(parent) tMsgOpen(parent); } else { await loadTMsgs(); if(parent) tMsgOpen(parent); } }"],
["try{ const r = await api('tMsgSend', TOKEN, t, parent, false); if(!r || !r.ok) throw r; delete loc.pending; loadTMsgs(); }",
 "try{ const r = await api('tMsgSend', TOKEN, t, parent, false); if(!r || !r.ok) throw r; delete loc.pending; if(r.queued) setTimeout(loadTMsgs, 75000); else loadTMsgs(); }"],
["try{ const r = await api('tLeaveRequest', TOKEN, f); if(!r.ok) throw r; LVFILES = []; closeSheet(); toast('✓ ' + r.note + (r.classes ? ' · ' + r.classes + ' classes in those dates' : '')); loadTLeave(); }",
 "try{ const r = await api('tLeaveRequest', TOKEN, f); if(!r.ok) throw r; LVFILES = []; closeSheet(); toast('✓ ' + r.note + (r.classes ? ' · ' + r.classes + ' classes in those dates' : '')); if(r.queued) setTimeout(loadTLeave, 75000); else loadTLeave(); }"],
["tGoalsSave: 'Goals', tNoteTag: 'Note tag', tSetMeet: 'Meeting ID' };",
 "tGoalsSave: 'Goals', tNoteTag: 'Note tag', tSetMeet: 'Meeting ID', tMsgSend: 'Message', tLeaveRequest: 'Leave request', tPayVerify: 'Pay check' };"],
["function ffWho(x){ const a = x.a1; return typeof a === 'string' ? a : a && (a.student || a.code || a.date) || ''; }",
 "function ffWho(x){ const a = x.a1; return String(typeof a === 'string' ? a : a && (a.student || a.code || a.date || a.type || a.from) || '').slice(0, 60); }"],
]);
