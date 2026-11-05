// 1773: (Misty 5 Nov "continue what needs to be finished" · everything from the database)
//   Answered by the database (edge coe-lists v5) instead of Google: Leave (management mgmtLeave, teacher tLeave), Peer reviews list (mgmtPeer),
//   Trials (mgmtTrials), class details (mgmtClassInfo). Checked against Google's saved answers (identical apart from data added since).
//   getBootstrap (management start screen): Google's answer is compared in the background with the database's (coe-lists op shadow →
//   docs sys:shadow:getBootstrap) before switching. Database-live copies of tGoals / tSchedule / tHwHist are trusted for 6 h (was 90 min).
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["function sbLiveMax(fn){ return /^(mgmtStudent|tStudent|mgmtStudents|mgmtStuClasses|tStuClasses|mgmtActive)$/.test(fn)",
   "function sbLiveMax(fn){ return /^(mgmtStudent|tStudent|mgmtStudents|mgmtStuClasses|tStuClasses|mgmtActive|tGoals|tSchedule|tHwHist)$/.test(fn)"],
  ["</body>\n</html>",
   "<script>\n/* 1773 · leave, peer reviews, trials, class details from the database (coe-lists); getBootstrap compared in the background */\n(function(){\n" +
   "  const base = window.api; if(!base || base.__1773) return;\n" +
   "  const URL = 'https://rlxkiahqjsabopmuhern.supabase.co/functions/v1/coe-lists', an0 = window.apiNow;\n" +
   "  const body = (fn, a) => fn === 'mgmtLeave' ? { token: a[0], op: 'leave' } : fn === 'tLeave' ? { token: a[0], op: 'tleave' }\n" +
   "    : fn === 'mgmtPeer' ? { token: a[0], op: 'peer' } : fn === 'mgmtTrials' ? { token: a[0], op: 'trials' }\n" +
   "    : fn === 'mgmtClassInfo' && a[1] && typeof a[1] === 'object' ? { token: a[0], op: 'classinfo', ev: a[1] } : null;\n" +
   "  const w = function(fn){ const a = Array.prototype.slice.call(arguments, 1), self = this, go = () => base.apply(self, [fn].concat(a)), fb = () => (typeof an0 === 'function' ? an0.apply(self, [fn].concat(a)) : go());\n" +
   "    const b = a[0] ? body(fn, a) : null; if(!b) return base.apply(this, arguments);\n" +
   "    return fetch(URL, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(b) })\n" +
   "      .then(x => x.json()).then(r => (r && r.ok && r.data != null) ? r.data : fb(), fb); };\n" +
   "  w.__1773 = 1; window.api = w;\n" +
   "  let shAt = 0; const an = window.apiNow; if(typeof an === 'function') window.apiNow = apiNow = function(fn){ const a = Array.prototype.slice.call(arguments, 1);\n" +
   "    if(a[0] && body(fn, a)) return w.apply(this, arguments);\n" +
   "    const p = an.apply(this, arguments);\n" +
   "    if(fn === 'getBootstrap' && a[0] && Date.now() - shAt > 10 * 6e4) Promise.resolve(p).then(g => { try{ if(!g || !g.mgr) return; shAt = Date.now();\n" +
   "      fetch(URL, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ token: a[0], op: 'shadow', fn: 'getBootstrap', google: g }) }).catch(() => {}); }catch(e){} }, () => {});\n" +
   "    return p; };\n" +
   "})();\n</script>\n</body>\n</html>"],
]);
