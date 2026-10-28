// 1469 · President QA follow-up (D16). Monitor › "Everything done in the app" showed raw action codes (ADDCLASS, EDITCLASS…) whenever the
//   server had no name for an action (coe-monitor falls back to the code), and the Activity log did the same (NAME[fn] || fn).
//   Now one shared map, window.ACT_LABELS, names every action the app saves (the Activity log's own list moves into it unchanged), and
//   any code it does not know is turned into words ("mgmtWeekSum" → "Week sum") instead of shown raw. Monitor feed, Activity log and
//   actWhat all read it. Display only; the server feed and stored rows are unchanged.
const file = process.argv[2];
const OLD = "  const NAME = { timeIn: 'Time in', classIn: '\"I\\'m in\"', saveNote: 'Class note', markHomework: 'Homework', tMsgSend: 'Message sent', tMsgAck: 'Replied to a notice', tMsgSeen: 'Opened messages', tNoteTag: 'Note tags', tVisitAck: 'Class visit seen',\n    tLeaveRequest: 'Leave request', tFbSubmit: 'Monthly feedback', tPcSubmit: 'Progress check', tPeerSubmit: 'Peer review', tTrialSubmit: 'Trial report', tHwFlag: 'Homework flag', tSetMeet: 'Meeting ID', tGoalsSave: 'Learning goals', tPayVerify: 'Pay check', tVidStart: 'Class video \u00b7 upload started', tVidDone: 'Class video uploaded', tVidExplain: 'Class video \u00b7 explanation', tRemindLog: 'WeChat reminder sent', tNotMine: '\"Not my student\" sent', tLeaveReply: 'Leave \u00b7 answer sent', tLeaveCancel: 'Leave cancelled' };";
require('../tools/lib.js')(file, [
  [OLD, "  const NAME = window.ACT_LABELS || {};   /* 1469: the shared action names */"],
  ["<span class=\"kd\">' + E(x.kind) + '</span>", "<span class=\"kd\">' + E(window.actLabel ? actLabel(x.kind, x.fn) : x.kind) + '</span>"],
  ["\nconst API_URL = window.COE_API || '';\n",
   "\n/* 1469 · one shared place for action names (Monitor feed, Activity log) */\n" +
   "window.ACT_LABELS = (function(){\n" +
   "  var L = { timeIn: 'Time in', classIn: '\"I\\'m in\"', saveNote: 'Class note', markHomework: 'Homework', tMsgSend: 'Message sent', tMsgAck: 'Replied to a notice', tMsgSeen: 'Opened messages', tNoteTag: 'Note tags', tVisitAck: 'Class visit seen',\n" +
   "    tLeaveRequest: 'Leave request', tFbSubmit: 'Monthly feedback', tPcSubmit: 'Progress check', tPeerSubmit: 'Peer review', tTrialSubmit: 'Trial report', tHwFlag: 'Homework flag', tSetMeet: 'Meeting ID', tGoalsSave: 'Learning goals', tPayVerify: 'Pay check', tVidStart: 'Class video · upload started', tVidDone: 'Class video uploaded', tVidExplain: 'Class video · explanation', tRemindLog: 'WeChat reminder sent', tNotMine: '\"Not my student\" sent', tLeaveReply: 'Leave · answer sent', tLeaveCancel: 'Leave cancelled',\n" +
   "    timeOut: 'Time out', decideLate: 'Late time-in decided', mgmtTagClass: 'Class tagged', mgmtVidFlagSet: 'Video review', mgmtTrialSent: 'Trial report sent', mgmtTrialGroup: 'Learner type', mgmtTrialFu: 'Trial follow-up', mgmtReportSent: 'Report sent',\n" +
   "    mgmtRemindLog: 'WeChat reminder sent', mgmtLeaveSave: 'Leave saved', mgmtLeaveAsk: 'Leave · details asked', mgmtLeaveProof: 'Leave proof', setCaseDone: 'Case completed', addCase: 'Case added', mgmtCaseWaive: 'Case waived',\n" +
   "    mgmtRenewal: 'Renewal', mgmtRenewPaid: 'Renewed · paid', mgmtEnrolPaid: 'Enrolled · paid', saveStudent: 'Student record saved', mgmtPkgFix: 'Package fixed', mgmtPkgCheck: 'Package check', setSharedPkg: 'Shared package set',\n" +
   "    addSale: 'Sale added', addExpense: 'Expense added', markPaid: 'Marked paid', mgmtRefund: 'Refund recorded', mgmtPayNudge: 'Pay reminder sent', mgmtPayVerNudge: 'Pay check reminder sent', mgmtPayReply: 'Pay question answered',\n" +
   "    mgmtMsgSend: 'Notice sent', mgmtMsgReply: 'Reply sent', mgmtNoteComment: 'Comment on a class note', mgmtTaskStatus: 'Task status', mgmtShiftClose: 'Shift handover',\n" +
   "    addClass: 'Class added', editClass: 'Class changed', cancelClass: 'Class cancelled', moveClass: 'Class moved', mgmtSetBook: 'Book set', mgmtSetCourse: 'Course set', mgmtClassInfo: 'Class details',\n" +
   "    mgmtEnqSave: 'Enquiry saved', mgmtTrialCefrSave: 'Trial CEFR saved', mgmtTrialReturn: 'Trial report returned', mgmtTrialSentPic: 'Trial picture sent', mgmtReportReturn: 'Report returned', mgmtZh: 'Chinese checked',\n" +
   "    mgmtQaSubmit: 'QA evaluation', mgmtPeerAssign: 'Peer review assigned', mgmtPeerCancel: 'Peer review cancelled', mgmtAgreeSave: 'Agreement saved', mgmtAvailSave: 'Open times saved', mgmtProfileSave: 'Profile saved', mgmtProfileImg: 'Profile photo',\n" +
   "    mgmtPwSave: 'Password set', setPassword: 'Password set', setTeacherEmail: 'Teacher e-mail set', mgmtAccessOff: 'App access turned off', setActiveTick: 'ACTIVE tick', mgmtFix: 'Data fixed', mgmtFixIgnored: 'Data check skipped' };\n" +
   "  var words = function(k){ var w = String(k).replace(/^(mgmt|t)(?=[A-Z])/, '').replace(/[_-]+/g, ' ').replace(/([a-z0-9])([A-Z])/g, '$1 $2').trim().toLowerCase(); return w ? w.charAt(0).toUpperCase() + w.slice(1) : String(k); };\n" +
   "  window.actLabel = function(kind, fn){ var k = String(kind == null ? '' : kind); if(fn && k === fn) return L[fn] || words(fn); if(L[k]) return L[k]; return /^[a-z][A-Za-z0-9_]*$/.test(k) && /[A-Z_]/.test(k) ? words(k) : k; };\n" +
   "  return typeof Proxy === 'function' ? new Proxy(L, { get: function(t, k){ return typeof k === 'string' && !(k in t) && /^[a-z][A-Za-z0-9_]*$/.test(k) ? words(k) : t[k]; } }) : L;\n" +
   "})();\n" +
   "const API_URL = window.COE_API || '';\n"],
]);
