// 1770: (Misty 5 Nov "let us do 1-4" · "everything read directly from the database")
//   Management lists answered by the database (edge coe-lists) instead of Google / Google-refreshed copies:
//   the day Schedule (classes + check-ins + videos, ~0.1 s),
//   teacher messages (coe_msgs), and the PAY / MONEY / TODAY tabs. Anything coe-lists cannot answer (fallback) goes to Google as before.
//   getBootstrap stays as it is for now (no saved Google answer to compare with yet). Active students already read the database
//   (coe-mgmt › coe_active_screen); that SQL function was replaced by the single-pass version (identical answer, ~2 s → ~0.1 s).
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["</body>\n</html>",
   "<script>\n/* 1770 · management lists from the database (coe-lists); Google only when the database cannot answer */\n(function(){\n" +
   "  const base = window.api; if(!base || base.__1770) return;\n" +
   "  const URL = 'https://rlxkiahqjsabopmuhern.supabase.co/functions/v1/coe-lists', an0 = window.apiNow;\n" +
   "  const body = (fn, a) => fn === 'mgmtSchedule' && a[1] ? { token: a[0], op: 'schedule', date: String(a[1]) }\n" +
   "    : fn === 'tMsgs' ? { token: a[0], op: 'tmsgs' }\n" +
   "    : fn === 'mgmtTab' && /^(PAY|MONEY|TODAY)$/.test(String(a[1] || '')) ? { token: a[0], op: 'tab', key: String(a[1]), pick: a[2] || '', pick2: a[3] || '' } : null;\n" +
   "  const w = function(fn){ const a = Array.prototype.slice.call(arguments, 1), self = this, go = () => base.apply(self, [fn].concat(a)), fb = () => (typeof an0 === 'function' ? an0.apply(self, [fn].concat(a)) : go());\n" +
   "    const b = a[0] ? body(fn, a) : null; if(!b) return base.apply(this, arguments);\n" +
   "    return fetch(URL, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(b) })\n" +
   "      .then(x => x.json()).then(r => (r && r.ok && r.data != null) ? r.data : fb(), fb); };\n" +
   "  w.__1770 = 1; window.api = w;\n" +
   "  const an = window.apiNow; if(typeof an === 'function') window.apiNow = apiNow = function(fn){ const a = Array.prototype.slice.call(arguments, 1);\n" +
   "    if(a[0] && body(fn, a)) return w.apply(this, arguments);\n" +
   "    return an.apply(this, arguments); };\n" +
   "})();\n</script>\n</body>\n</html>"],
]);
