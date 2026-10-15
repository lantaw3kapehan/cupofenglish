// 15 Oct · Slow Google-only screens: a recent database copy is used as it is (Google was asked again on every open).
// Today: Health 75 opens × 18 s, Night 74 × 16 s, Open times 64 × 16 s, Performance 37 × 10 s, Teacher card 41 × 9 s.
// Each of these is copied to the database whenever Google makes it, so a copy younger than the age below is shown
// without asking Google. After a save (2 min) and with ⟳ Refresh the app still asks Google, as before.
require('../tools/lib.js')(process.argv[2], [
["const SB_BGAGE = { mgmtStudent: 20 * 6e4, mgmtStuClasses: 20 * 6e4, mgmtMsgs: 0, mgmtPulse: 0, mgmtHealth: 0, tStudent: 20 * 6e4, tStuClasses: 20 * 6e4, tMsgs: 0 };",
 "const SB_BGAGE = { mgmtStudent: 20 * 6e4, mgmtStuClasses: 20 * 6e4, mgmtMsgs: 0, mgmtPulse: 0, mgmtHealth: 10 * 6e4, tStudent: 20 * 6e4, tStuClasses: 20 * 6e4, tMsgs: 0 };\n" +
 "const SB_OKAGE = { mgmtHealth: 10 * 6e4, mgmtNight: 60 * 6e4, mgmtAvailAll: 15 * 6e4, mgmtPerformance: 30 * 6e4, mgmtTeacherCard: 30 * 6e4, mgmtRenewals: 10 * 6e4, mgmtReportsWait: 10 * 6e4, tGrowth: 30 * 6e4, mgmtGrowth: 30 * 6e4 };   /* 15 Oct: slow Google-only screens */"],
["  let d0; if(!(fn in SB_BGAGE) || SB_BGAGE[fn] > 0){ d0 = await sbDoc(key); if(d0 && age(d0) < 180000) return d0.data; }",
 "  let d0; if(!(fn in SB_BGAGE) || SB_BGAGE[fn] > 0){ d0 = await sbDoc(key); if(d0 && age(d0) < Math.max(180000, SB_OKAGE[fn] || 0)) return d0.data; }"],
]);
