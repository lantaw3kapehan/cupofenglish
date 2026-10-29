// 1602 · Misty 09:14: "avoid drawing from Google if the data is already in the Supabase database".
//   Reports and lists that Google works out and the database keeps a copy of (docs) are no longer re-asked from Google each
//   time a screen opens: the database copy is used, with no Google call at all, while it is younger than the age below
//   (minutes). Google is asked only when the copy is missing or older (the copy has stopped being refreshed), right after
//   this person's own save (2 min), or on the Refresh button. Database-made screens (live) were already Google-free.
//   The ages can be changed without a release: docs 'sys:dbonly' {"ages": {"mgmtTrials": 15, …}, "off": false}.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["</script>\n<script>\n/* 1526 · teacher cards from this device's last copy",
   "</script>\n<script>\n/* 1602 · database copy without Google while it is young enough */\n(function(){\n" +
   "  const base = window.api; if(!base || base.__1602) return;\n" +
   "  const AGE = { mgmtUrls: 1440, mgmtSlipPeople: 1440, mgmtProfiles: 360, schedLists: 120, moneyLists: 60, mgmtFixIgnored: 60, mgmtTrialFus: 30, mgmtAgreeMap: 120,\n" +
   "    mgmtVisitCoverage: 120, mgmtTeacherCard: 120, mgmtPerformance: 120, mgmtPayChecks: 60, mgmtPayReady: 60, mgmtNight: 120, mgmtHours: 60, mgmtWeekSum: 120,\n" +
   "    mgmtTeacherVisits: 60, mgmtHealth: 30, mgmtTrials: 15, mgmtReports: 15, mgmtReportsWait: 15, mgmtPeer: 30, mgmtMyPay: 60, tPayCheck: 30, tPayReady: 30 };\n" +
   "  let CFG = null, cfgAt = 0, rf = 0;\n" +
   "  document.addEventListener('click', ev => { try{ if(ev.target && ev.target.closest && ev.target.closest('#rf')) rf = Date.now(); }catch(e){} }, true);\n" +
   "  function cfg(){ if(Date.now() - cfgAt > 5 * 6e4 && typeof sbDoc === 'function'){ cfgAt = Date.now(); sbDoc('sys:dbonly').then(d => { CFG = d && d.data || null; }).catch(() => {}); } return CFG; }\n" +
   "  const w = function(fn){ const args = Array.prototype.slice.call(arguments, 1), self = this;\n" +
   "    try{ const C = cfg(); if(C && C.off) return base.apply(this, arguments);\n" +
   "      const m = C && C.ages && C.ages[fn] != null ? +C.ages[fn] : AGE[fn];\n" +
   "      if(m > 0 && typeof LIVE !== 'undefined' && LIVE && typeof sbOn === 'function' && sbOn() && typeof sbKey === 'function' && args[0] === TOKEN && Date.now() - rf > 5000\n" +
   "        && !(typeof SB_LASTW !== 'undefined' && SB_LASTW && Date.now() - SB_LASTW < 120000)){\n" +
   "        const key = sbKey(fn, args);\n" +
   "        return Promise.race([(typeof sbDocV === 'function' ? sbDocV(key, fn) : sbDoc(key)), new Promise(z => setTimeout(() => z(null), 4500))]).then(d => (d && d.data != null && !(d.data && d.data.ok === false) && Date.now() - Date.parse(d.at) < m * 6e4) ? d.data : base.apply(self, [fn].concat(args)), () => base.apply(self, [fn].concat(args))); }\n" +
   "    }catch(e){}\n" +
   "    return base.apply(this, arguments); };\n" +
   "  w.__1602 = 1; for(const k in base) try{ w[k] = base[k]; }catch(e){} window.api = w;\n" +
   "})();\n" +
   "</script>\n<script>\n/* 1526 · teacher cards from this device's last copy"],
]);
