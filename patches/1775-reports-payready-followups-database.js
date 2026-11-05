// 1775: (Misty 5 Nov "continue what needs to be finished" · everything from the database)
//   Answered by the database (edge coe-lists v7) instead of Google: monthly Reports (mgmtReports / mgmtReportsWait), pay readiness
//   (mgmtPayReady, teacher tPayReady) and trial follow-ups (mgmtTrialFus). Checked against Google's saved answers: same, except where Google
//   had dropped a teacher on an error or reports were sent since. Google only if the database cannot answer.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["</body>\n</html>",
   "<script>\n/* 1775 · reports, pay readiness, trial follow-ups from the database (coe-lists); Google only when the database cannot answer */\n(function(){\n" +
   "  const base = window.api; if(!base || base.__1775) return;\n" +
   "  const URL = 'https://rlxkiahqjsabopmuhern.supabase.co/functions/v1/coe-lists', an0 = window.apiNow;\n" +
   "  const body = (fn, a) => fn === 'mgmtReports' ? { token: a[0], op: 'reports', month: a[1] || '' } : fn === 'mgmtReportsWait' ? { token: a[0], op: 'reportswait', month: a[1] || '' }\n" +
   "    : fn === 'mgmtPayReady' ? { token: a[0], op: 'payready' } : fn === 'tPayReady' ? { token: a[0], op: 'tpayready' } : fn === 'mgmtTrialFus' ? { token: a[0], op: 'trialfus' } : null;\n" +
   "  const w = function(fn){ const a = Array.prototype.slice.call(arguments, 1), self = this, go = () => base.apply(self, [fn].concat(a)), fb = () => (typeof an0 === 'function' ? an0.apply(self, [fn].concat(a)) : go());\n" +
   "    const b = a[0] ? body(fn, a) : null; if(!b) return base.apply(this, arguments);\n" +
   "    return fetch(URL, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(b) })\n" +
   "      .then(x => x.json()).then(r => (r && r.ok && r.data != null) ? r.data : fb(), fb); };\n" +
   "  w.__1775 = 1; window.api = w;\n" +
   "  const an = window.apiNow; if(typeof an === 'function') window.apiNow = apiNow = function(fn){ const a = Array.prototype.slice.call(arguments, 1);\n" +
   "    if(a[0] && body(fn, a)) return w.apply(this, arguments); return an.apply(this, arguments); };\n" +
   "})();\n</script>\n</body>\n</html>"],
]);
