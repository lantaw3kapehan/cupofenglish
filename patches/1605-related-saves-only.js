// 1605 · 1602 refined: after your own save the app asked Google again for every report for 2 minutes (this morning's
//   "aftersave" reads: Health, Pay ready, Actions, Reports, Peer… after an enquiry or a schedule save). Now only the reports
//   that the save can change are asked again (for example a trial save → Trials and Trial follow-ups; a pay save → payroll
//   checks; Health never). All other reports keep using the database copy.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["    try{ const C = cfg(); if(C && C.off) return base.apply(this, arguments);",
   "    try{ if(!(typeof API_READ !== 'undefined' && API_READ.test(fn)) && !(typeof API_BG !== 'undefined' && API_BG.test(fn)) && !(typeof SB_R !== 'undefined' && SB_R.test(fn)) && !/Seen|Ack|Pulse|Nudge|Pdf|Check/.test(fn)) { LSF = fn; LSA = Date.now(); }   /* 1605: the last save */\n" +
   "      const C = cfg(); if(C && C.off) return base.apply(this, arguments);"],
  ["        && !(typeof SB_LASTW !== 'undefined' && SB_LASTW && Date.now() - SB_LASTW < 120000)){",
   "        && !(Date.now() - LSA < 120000 && REL[fn] && REL[fn].test(LSF))){   /* 1605: only a related save asks Google again */"],
  ["  let CFG = null, cfgAt = 0, rf = 0;",
   "  let CFG = null, cfgAt = 0, rf = 0, LSF = '', LSA = 0;\n" +
   "  const REL = { mgmtTrials: /Trial|Enrol|Enq/, mgmtTrialFus: /Trial|Enrol|Enq/, mgmtReports: /Report|Fb/, mgmtReportsWait: /Report|Fb/, mgmtPeer: /Peer/, mgmtPayChecks: /Pay|Paid/, mgmtPayReady: /Pay|Paid|Report|Peer|Vid/,\n" +
   "    mgmtFixIgnored: /Fix/, schedLists: /Class|Sched|Student|Enrol|Renew|Teacher|Staff/, moneyLists: /Sale|Expense|Paid|Refund|Renew|Enrol/, mgmtAgreeMap: /Agree/, mgmtVisitCoverage: /Visit|Monitor/, mgmtTeacherCard: /Teacher|Profile|Staff/,\n" +
   "    mgmtPerformance: /Report|Fb|Peer|Qa/, mgmtNight: /Note|Homework|Vid|Class/, mgmtHours: /time|Time|Leave/, mgmtWeekSum: /Class|Time/, mgmtTeacherVisits: /Visit|Monitor/, mgmtProfiles: /Profile/, mgmtSlipPeople: /Staff|Teacher/,\n" +
   "    mgmtMyPay: /Pay|Paid/, tPayCheck: /Pay|time|Time|class|Class/, tPayReady: /Fb|Peer|Vid|Report/ };"],
]);
