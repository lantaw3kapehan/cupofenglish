// 1737: (Misty 4 Nov 13:15, "do the rest … in the supabase database") batch 2 through the database queue (coe-wq v4): cancel a peer
//   observation, ask a teacher about leave, mark a month paid, teacher profile, trial / sub class fix, ignore / fix an item, shared
//   package link, and a teacher cancelling her own leave request. "Saved" at once; Google does the same work behind; a refusal shows
//   in the failed-saves notice. Google's minute job finishes any it did not answer (WQ1104 batch 2).
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["addCase: 1, mgmtCaseWaive: 1, mgmtTaskStatus: 1, mgmtTrialGroup: 1, mgmtLeaveSave: 1, setActiveTick: 1, mgmtAvailSave: 1, mgmtShiftClose: 1 };",
   "addCase: 1, mgmtCaseWaive: 1, mgmtTaskStatus: 1, mgmtTrialGroup: 1, mgmtLeaveSave: 1, setActiveTick: 1, mgmtAvailSave: 1, mgmtShiftClose: 1,\n    mgmtPeerCancel: 1, mgmtLeaveAsk: 1, markPaidMonth: 1, mgmtProfileSave: 1, mgmtTcSubFix: 1, mgmtFix: 1, setSharedPkg: 1, tLeaveCancel: 1 };   /* 1737 */"],
  ["mgmtAvailSave: 'Teacher hours', mgmtShiftClose: 'Shift handover' };",
   "mgmtAvailSave: 'Teacher hours', mgmtShiftClose: 'Shift handover', mgmtPeerCancel: 'Cancel peer observation', mgmtLeaveAsk: 'Leave question', markPaidMonth: 'Mark paid', mgmtProfileSave: 'Teacher profile', mgmtTcSubFix: 'Trial / sub class fix', mgmtFix: 'Fix', setSharedPkg: 'Shared package', tLeaveCancel: 'Cancel leave request' };"],
  ["if(fn === 'mgmtTaskStatus' || fn === 'mgmtLeaveSave' || fn === 'mgmtShiftClose')",
   "if(/^(mgmtTaskStatus|mgmtLeaveSave|mgmtShiftClose|mgmtLeaveAsk|markPaidMonth|mgmtProfileSave|tLeaveCancel)$/.test(fn))"],
  ["(fn !== 'tLeaveInformed' && !D.mgr)", "(!/^t(LeaveInformed|LeaveCancel)$/.test(fn) && !D.mgr)"],
]);
