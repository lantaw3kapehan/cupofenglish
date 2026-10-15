// 15 Oct · Management screens: fewer waits for Google.
// 1. After any save, every screen used to skip the database copies for 2 minutes and wait for Google (5–40 s). Now only
//    copies older than that save are refreshed, and the screen still opens at once with the copy while Google answers.
// 2. Screens that Google takes long to build (QA visits per teacher 5–7 s each, week summary 16 s, performance 22 s,
//    night check 27 s, health 41 s, peer visits, hours, reports, trials, money, database) are taken from the database copy
//    when it is reasonably recent, instead of asking Google again on every open.
require('../tools/lib.js')(process.argv[2], [
["if((SB_R.test(fn) || (fn === 'getBootstrap' && D && !D.mgr && D.me && D.me.name)) && sbOn() && Date.now() - SB_LASTW > 120000){",
 "if((SB_R.test(fn) || (fn === 'getBootstrap' && D && !D.mgr && D.me && D.me.name)) && sbOn()){"],
["  const age = d => d ? Date.now() - Date.parse(d.at) : Infinity, mx = fn in SB_BGAGE ? SB_BGAGE[fn] : 300000;",
 "  const age0 = d => d ? Date.now() - Date.parse(d.at) : Infinity, mx = fn in SB_BGAGE ? SB_BGAGE[fn] : 300000;\n  const age = d => d && SB_LASTW && Date.now() - SB_LASTW < 120000 && Date.parse(d.at) < SB_LASTW ? Infinity / 2 : age0(d);   /* a copy made before your last save counts as old (shown, then refreshed) */"],
["    const rp = real(); if(!d || age(d) > (SB_UIAGE[fn] || 3 * 864e5)) return rp;",
 "    const rp = real(); if(!d || age0(d) > (SB_UIAGE[fn] || 3 * 864e5)) return rp;"],
["  if(!d || age(d) > (SB_UIAGE[fn] || 3 * 864e5)) return rp;\n  rp.then(x =>",
 "  if(!d || age0(d) > (SB_UIAGE[fn] || 3 * 864e5)) return rp;\n  rp.then(x =>"],
["const SB_OKAGE = { mgmtHealth: 10 * 6e4,",
 "const SB_OKAGE = { mgmtTeacherVisits: 30 * 6e4, mgmtWeekSum: 60 * 6e4, mgmtPeer: 30 * 6e4, mgmtHours: 15 * 6e4, mgmtReports: 10 * 6e4, mgmtTrials: 10 * 6e4, mgmtTab: 10 * 6e4, mgmtDatabase: 10 * 6e4, mgmtMyPay: 30 * 6e4, mgmtUrls: 60 * 6e4, mgmtHealth: 10 * 6e4,"],
["const SB_BGAGE = { mgmtStudent: 20 * 6e4,",
 "const SB_BGAGE = { mgmtTeacherVisits: 30 * 6e4, mgmtWeekSum: 60 * 6e4, mgmtPeer: 30 * 6e4, mgmtHours: 15 * 6e4, mgmtPerformance: 30 * 6e4, mgmtNight: 60 * 6e4, mgmtReports: 10 * 6e4, mgmtReportsWait: 10 * 6e4, mgmtTrials: 10 * 6e4, mgmtTab: 10 * 6e4, mgmtStudent: 20 * 6e4,"],
]);
