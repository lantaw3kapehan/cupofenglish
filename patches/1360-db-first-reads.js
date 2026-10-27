// 1360 · database first (Misty 27 Oct 21:15: "everything reads straight from the database").
//   Student pages (management + teacher) and the Students list are worked out by the database itself (coe docs op, live: true).
//   They were still asked again from Google in the background whenever the slowest sheet copy behind them (TR-DATA / PR-DATA,
//   copied about every 2 h) was more than 90 min old: ~300 Google calls a day at 4–14 s each that nobody needed.
//   Now a live database answer counts as current for 6 h for these screens (a save still forces a fresh read as before).
//   Growth (tGrowth) and the night report (mgmtNight) open from the database copy; Google refreshes those copies at most every 3 h
//   in the background (was 30 / 60 min). Nothing is computed differently; only how often Google is asked behind the screen.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["let SB_LASTW = 0; const SB_FRESH = {}, SB_WANT = {}; let SB_T = 0;",
   "function sbLiveMax(fn){ return /^(mgmtStudent|tStudent|mgmtStudents|mgmtStuClasses|tStuClasses|mgmtActive)$/.test(fn) ? 6 * 3600e3 : 90 * 6e4; }   /* 1360 */\nlet SB_LASTW = 0; const SB_FRESH = {}, SB_WANT = {}; let SB_T = 0;"],
  ["if(!ui){ const d = await sbDoc(key); if(d && (age(d) < mx || (d.live && age(d) < 90 * 6e4))) return d.data; return real(); }",
   "if(!ui){ const d = await sbDoc(key); if(d && (age(d) < mx || (d.live && age(d) < sbLiveMax(fn)))) return d.data; return real(); }"],
  ["if(SB_LIVE.test(fn)){ const d = await sbDoc(key); if(d && ((d.live && age(d) < 90 * 6e4) ||",
   "if(SB_LIVE.test(fn)){ const d = await sbDoc(key); if(d && ((d.live && age(d) < sbLiveMax(fn)) ||"],
  ["const SB_BGAGE = { tGrowth: 30 * 6e4,", "const SB_BGAGE = { tGrowth: 180 * 6e4,"],
  ["mgmtPerformance: 30 * 6e4, mgmtNight: 60 * 6e4, mgmtReports: 10 * 6e4,", "mgmtPerformance: 30 * 6e4, mgmtNight: 180 * 6e4, mgmtReports: 10 * 6e4,"],
  ["mgmtUrls: 360 * M, mgmtHealth: 15 * M, mgmtNight: 60 * M,", "mgmtUrls: 360 * M, mgmtHealth: 15 * M, mgmtNight: 180 * M,"],
  ["tPayCheck: 20 * M, tPayReady: 20 * M, tGrowth: 30 * M,", "tPayCheck: 20 * M, tPayReady: 20 * M, tGrowth: 180 * M,"],
]);
