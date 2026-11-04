// 1738: (Misty 4 Nov 13:22, "ALRIGHT GO AHEAD") batch 3 through the database queue (coe-wq v5): trial report marked sent (time and
//   name filled in at once), course on a package, trial CEFR level, report returned to a teacher, comment on a class note, peer review
//   assignment, mark a teacher paid, and a teacher's "not my student". Same safety as batches 1–2 (Google does the same work behind;
//   a refusal shows in the failed-saves notice; Google's minute job finishes what it did not answer).
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["setSharedPkg: 1, tLeaveCancel: 1 };   /* 1737 */",
   "setSharedPkg: 1, tLeaveCancel: 1,   /* 1737 */\n    mgmtTrialSent: 1, mgmtSetCourse: 1, mgmtTrialCefrSave: 1, mgmtReportReturn: 1, mgmtNoteComment: 1, mgmtPeerAssign: 1, markPaid: 1, tNotMine: 1 };   /* 1738 */"],
  ["setSharedPkg: 'Shared package', tLeaveCancel: 'Cancel leave request' };",
   "setSharedPkg: 'Shared package', tLeaveCancel: 'Cancel leave request', mgmtTrialSent: 'Trial report sent', mgmtSetCourse: 'Course', mgmtTrialCefrSave: 'Trial level', mgmtReportReturn: 'Report returned', mgmtNoteComment: 'Note comment', mgmtPeerAssign: 'Peer review', markPaid: 'Mark paid', tNotMine: 'Not my student' };"],
  ["    if(/^(mgmtTaskStatus|mgmtLeaveSave|mgmtShiftClose|mgmtLeaveAsk|markPaidMonth|mgmtProfileSave|tLeaveCancel)$/.test(fn))",
   "    if(fn === 'mgmtTrialSent') return { ok: true, queued: true, n: Array.isArray(a[1]) ? a[1].length : 1, at: nowAt(), by: me() };   /* 1738 */\n" +
   "    if(fn === 'mgmtSetCourse') return { ok: true, queued: true, course: String(a[3] || '').trim() };\n" +
   "    if(fn === 'mgmtTrialCefrSave') return { ok: true, queued: true, cefr: String(a[2] || ''), remade: false };\n" +
   "    if(fn === 'mgmtPeerAssign') return { ok: true, queued: true, n: ((f && f.evaluators) || []).length, month: (f && f.month) || '' };\n" +
   "    if(fn === 'tNotMine') return { ok: true, queued: true, student: String(a[1] || '') };\n" +
   "    if(/^(mgmtTaskStatus|mgmtLeaveSave|mgmtShiftClose|mgmtLeaveAsk|markPaidMonth|mgmtProfileSave|tLeaveCancel)$/.test(fn))"],
  ["(!/^t(LeaveInformed|LeaveCancel)$/.test(fn) && !D.mgr)", "(!/^t(LeaveInformed|LeaveCancel|NotMine)$/.test(fn) && !D.mgr)"],
]);
