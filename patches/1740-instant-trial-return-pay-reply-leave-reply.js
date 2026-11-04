// 1740: (Misty 4 Nov 14:35, "go ahead with small saves") three more saves answered at once through the database queue (coe-wq v7):
//   · Trial report › Send back for redo (mgmtTrialReturn)
//   · Payroll › Reply to a teacher's pay question (mgmtPayReply)
//   · Teacher › Leave › answer Operations (tLeaveReply) — only a written answer; an answer with a file still goes to Google (the file is not kept in the database)
//   Google still does the work in the background (same checks); a refusal shows in the failed-saves notice. When Google has saved, the list reloads.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["mgmtTrialSent: 1, mgmtSetCourse: 1, mgmtTrialCefrSave: 1, mgmtReportReturn: 1, mgmtNoteComment: 1, mgmtPeerAssign: 1, markPaid: 1, tNotMine: 1 };   /* 1738 */",
   "mgmtTrialSent: 1, mgmtSetCourse: 1, mgmtTrialCefrSave: 1, mgmtReportReturn: 1, mgmtNoteComment: 1, mgmtPeerAssign: 1, markPaid: 1, tNotMine: 1,   /* 1738 */\n    mgmtTrialReturn: 1, mgmtPayReply: 1 };   /* 1740 */"],
  ["markPaid: 'Mark paid', tNotMine: 'Not my student', mgmtEnqSave: 'Enquiry' };",
   "markPaid: 'Mark paid', tNotMine: 'Not my student', mgmtEnqSave: 'Enquiry', mgmtTrialReturn: 'Trial report sent back', mgmtPayReply: 'Pay reply', tLeaveReply: 'Leave answer' };"],
  ["    if(fn === 'tNotMine') return { ok: true, queued: true, student: String(a[1] || '') };",
   "    if(fn === 'tNotMine') return { ok: true, queued: true, student: String(a[1] || '') };\n" +
   "    if(fn === 'mgmtTrialReturn'){ const x = (typeof TLD !== 'undefined' && TLD && TLD.label === a[1]) ? TLD : {};   /* 1740 */\n" +
   "      return { ok: true, queued: true, teacher: String(x.teacher || ''), student: String(x.student || ''), redo: { at: nowAt(), by: me(), note: String(a[2] || '').trim() } }; }\n" +
   "    if(fn === 'mgmtPayReply'){ let c0 = {}; try{ c0 = (PCKM && PCKM.checks && PCKM.checks[String(a[1]).toLowerCase()]) || {}; }catch(e){}\n" +
   "      return { ok: true, queued: true, check: Object.assign({}, c0, { status: 'Answered', reply: String(a[2] || '').trim(), replyBy: me(), replyAt: nowAt() }), note: 'Reply sent to Teacher ' + a[1] }; }\n" +
   "    if(fn === 'tLeaveReply') return { ok: true, queued: true, files: 0, note: 'Sent · Operations will check it' };"],
  ["        if((fn === 'decideLate' || fn === 'mgmtTagClass') && g.caseId) try{ toast((g.note || 'Saved') + ' · ' + g.caseId); }catch(e){}",
   "        if((fn === 'decideLate' || fn === 'mgmtTagClass') && g.caseId) try{ toast((g.note || 'Saved') + ' · ' + g.caseId); }catch(e){}\n" +
   "        try{ if(fn === 'tLeaveReply' && typeof loadTLeave === 'function') loadTLeave(); if(fn === 'mgmtPayReply' && typeof loadPayChecks === 'function') loadPayChecks(1);   /* 1740: Google's copy is in */\n" +
   "          if(fn === 'mgmtTrialReturn' && typeof loadTrials === 'function'){ TRL = null; loadTrials(); } }catch(e){}"],
  ["let on = !!FNS[fn] || (fn === 'mgmtEnqSave' && a[1] && a[1].id && !/^tmp/.test(String(a[1].id)));   /* 1739: enquiry changes */",
   "let on = !!FNS[fn] || (fn === 'mgmtEnqSave' && a[1] && a[1].id && !/^tmp/.test(String(a[1].id)))   /* 1739: enquiry changes */\n" +
   "      || (fn === 'tLeaveReply' && !(Array.isArray(a[3]) && a[3].length));   /* 1740: a written leave answer (with a file → Google) */"],
  ["(!/^t(LeaveInformed|LeaveCancel|NotMine)$/.test(fn) && !D.mgr)", "(!/^t(LeaveInformed|LeaveCancel|NotMine|LeaveReply)$/.test(fn) && !D.mgr)"],
]);
