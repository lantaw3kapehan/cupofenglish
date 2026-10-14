// 14 Oct pm · Teachers' screens open from the database too (Misty: "both Management and Teachers screens").
// Student page, classes, feedback status, growth, schedule, pay check, messages, leave, visits, comments, homework history,
// goals, reminders and the forms (feedback, progress check, trial, peer review) are copied to Supabase under the teacher's own
// name (server paste SERVER-MIRROR-2) — a teacher can only read her own. Same rule as management: the copy shows at once,
// the fresh one comes from Google in the background and the screen redraws if it changed; fresh from Google for 2 min after a save.
// Also: the "pulse" check is no longer looked up in the database (it changes every minute).
require('../tools/lib.js')(process.argv[2], [
["const SB_R = /^(mgmt(Overview|Students|Student|Schedule|Teacher|Actions|Active|Renewals|Trials|TrialFus|Reports|ReportsWait|Performance|TeacherCard|PayChecks|PayReady|AvailAll|Health|Night|Msgs|Tab|Database|Payroll|Leave|Peer|Hours|StuClasses|Urls|EnqList|MonDay|VisitCoverage|AgreeMap|Growth|Pulse)|schedLists|moneyLists|dbLists)$/;",
 "const SB_R = /^(mgmt(Overview|Students|Student|Schedule|Teacher|Actions|Active|Renewals|Trials|TrialFus|Reports|ReportsWait|Performance|TeacherCard|PayChecks|PayReady|AvailAll|Health|Night|Msgs|Tab|Database|Payroll|Leave|Peer|Hours|StuClasses|Urls|EnqList|MonDay|VisitCoverage|AgreeMap|Growth)|schedLists|moneyLists|dbLists|t(Student|StuClasses|FbStatus|Growth|Schedule|PayCheck|PayReady|Msgs|Leave|LeaveClasses|MyVisits|MyComments|HwHist|Goals|NoteComments|Reminders|FbForm|PcForm|TrialForm|PeerForm))$/;   /* 14 Oct pm: + teachers' screens, − pulse */"],
["const SB_BGAGE = { mgmtStudent: 20 * 6e4, mgmtStuClasses: 20 * 6e4, mgmtMsgs: 0, mgmtPulse: 0, mgmtHealth: 0 };",
 "const SB_BGAGE = { mgmtStudent: 20 * 6e4, mgmtStuClasses: 20 * 6e4, mgmtMsgs: 0, mgmtPulse: 0, mgmtHealth: 0, tStudent: 20 * 6e4, tStuClasses: 20 * 6e4, tMsgs: 0 };"],
["return !!(D && D.mgr && TOKEN); }",
 "return !!(D && TOKEN && (D.mgr || (D.me && D.me.name))); }"],
["function sbKey(fn, args){ return (SB_SH.test(fn) || !D.pres ? 'mgmt' : 'pres') + ':' + fn + '|' + JSON.stringify(args.slice(1)); }",
 "function sbKey(fn, args){ return (/^t[A-Z]/.test(fn) ? String((D.me || {}).name || '').trim().toLowerCase() : SB_SH.test(fn) || !D.pres ? 'mgmt' : 'pres') + ':' + fn + '|' + JSON.stringify(args.slice(1)); }"],
["  if(fn === 'mgmtStudent'){ const code = args[1];",
 "  if(fn === 'mgmtStudent' || fn === 'tStudent'){ const code = args[1];"],
["  if(fn === 'mgmtStuClasses'){ const code = args[1];",
 "  if(fn === 'mgmtStuClasses' || fn === 'tStuClasses'){ const code = args[1];"],
["try{ if(VIEW === 'astudents') loadStudents(); else if(VIEW === 'schedule') loadSchedule(0, true); else { const S = SCREENS[VIEW]; if(S) S[2](true); } }catch(e){}",
 "try{ if(VIEW === 'astudents') loadStudents(); else if(VIEW === 'schedule') loadSchedule(0, true); else if(VIEW === 'growth' || VIEW === 'qa') loadGrowth(); else if(VIEW === 'pay' || VIEW === 'mypay') loadMyReady(); else { const S = SCREENS[VIEW]; if(S) S[2](true); } }catch(e){}"],
["if(!API_READ.test(fn) && !API_BG.test(fn) && !/Seen|Ack|Pulse|Nudge/.test(fn)) SB_LASTW = Date.now();",
 "if(!API_READ.test(fn) && !API_BG.test(fn) && !SB_R.test(fn) && !/Seen|Ack|Pulse|Nudge/.test(fn)) SB_LASTW = Date.now();"],
["if(!API_READ.test(fn) && !API_BG.test(fn)) return apiNow(fn, ...args);",
 "if(!API_READ.test(fn) && !API_BG.test(fn) && !(SB_R.test(fn) && sbOn())) return apiNow(fn, ...args);"],
]);
