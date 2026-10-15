// 15 Oct night · Messages come from the database (the original): the message lists open at once, and a message or
// reply sent by management shows in the list straight away (Google still sends the notifications a minute later).
// Memos (official memorandum) still go through Google.
require('../tools/lib.js')(process.argv[2], [
["const SB_LIVE = /^(mgmt(Active|Students|Student|StuClasses|Schedule|TeacherWeek|Teacher|AvailAll|MonDay|Actions|Payroll|Leave)|t(Student|Schedule|FbStatus|HwHist|Reminders|Goals|Leave|MyVisits)|getBootstrap)$/;",
 "const SB_LIVE = /^(mgmt(Active|Students|Student|StuClasses|Schedule|TeacherWeek|Teacher|AvailAll|MonDay|Actions|Payroll|Leave|Msgs)|t(Student|Schedule|FbStatus|HwHist|Reminders|Goals|Leave|MyVisits|Msgs)|getBootstrap)$/;"],
["const FAST_M = { mgmtReportSent: 1, mgmtTrialFu: 1, setCaseDone: 1, mgmtMsgSeen: 1 };", "const FAST_M = { mgmtReportSent: 1, mgmtTrialFu: 1, setCaseDone: 1, mgmtMsgSeen: 1, mgmtMsgSend: 1, mgmtMsgReply: 1 };"],
["FAST_M[fn] && !(fn === 'mgmtTrialFu' && args[2] === 'Enrolling')); }", "FAST_M[fn] && !(fn === 'mgmtTrialFu' && args[2] === 'Enrolling') && !(fn === 'mgmtMsgSend' && args[4])); }   /* memos: Google */"],
["  if(fn === 'tMsgAck') return { ok: true, queued: true, note: 'Saved' };",
 "  if(fn === 'tMsgAck') return { ok: true, queued: true, note: 'Saved' };\n  if(fn === 'mgmtMsgSend'){ const to = [].concat(args[1] || []); return { ok: true, queued: true, note: 'Sent to ' + (to.length === 1 ? to[0] : to.length + ' people') }; }\n  if(fn === 'mgmtMsgReply') return { ok: true, queued: true, note: 'Reply sent' };"],
["function fastAns(fn, args){ const t = new Date()", "function fastAns(fn, args){ if(/Msg/.test(fn)) try{ Object.keys(SB_FRESH).forEach(k => { if(/Msgs\\|/.test(k)) delete SB_FRESH[k]; }); }catch(e){}   /* the message list is read again at once */\n  const t = new Date()"],
]);
