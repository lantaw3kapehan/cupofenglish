// 15 Oct · Stage 1 · A teacher's home screen (Today, students, pay, cases) comes from the database.
// Checked against Google for Kat, Pam and Dezza: the same students, lessons left, notes, schedule, pay and cases.
// Management's own start screen and ⟳ Refresh still ask Google; if the database's copy is not complete, Google answers.
require('../tools/lib.js')(process.argv[2], [
["const SB_LIVE = /^(mgmt(Active|Students|Student|StuClasses|Schedule|TeacherWeek)|t(Student|Schedule))$/",
 "const SB_LIVE = /^(mgmt(Active|Students|Student|StuClasses|Schedule|TeacherWeek)|t(Student|Schedule)|getBootstrap)$/"],
["const SB_UIAGE = { mgmtStudent: 7 * 864e5,", "const SB_UIAGE = { getBootstrap: 1, mgmtStudent: 7 * 864e5,"],
["function sbKey(fn, args){ return (/^t[A-Z]/.test(fn) ?", "function sbKey(fn, args){ return (/^t[A-Z]|^getBootstrap$/.test(fn) ?"],
["function sbRedraw(fn, args, data){ try{\n",
 "function sbRedraw(fn, args, data){ try{\n  if(fn === 'getBootstrap'){ if(D && !D.mgr && data && data.me){ D = data; store('set', KEY_D, JSON.stringify(D)); render(); } return; }\n"],
["if(SB_R.test(fn) && sbOn() && Date.now() - SB_LASTW > 120000){",
 "if((SB_R.test(fn) || (fn === 'getBootstrap' && D && !D.mgr && D.me && D.me.name)) && sbOn() && Date.now() - SB_LASTW > 120000){"],
["  const real = () => ui || /^(mgmtOverview|mgmtRenewals|mgmtTrialFus)$/.test(fn) ? go()",
 "  const real = () => ui || /^(getBootstrap|mgmtOverview|mgmtRenewals|mgmtTrialFus)$/.test(fn) ? go()"],
]);
