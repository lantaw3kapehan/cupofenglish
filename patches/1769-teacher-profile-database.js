// 1769: (Misty 5 Nov "let us do 1-4" · "everything read directly from the database")
//   Management › teacher profile (mgmtTeacher) is answered by the database (edge coe-tchpage: classes, ACTIVE mirror, S-NOTES/T-TIMEIN logs,
//   TC&SUB/ACTIONS records, T-PEER, database rank and pay) in ~0.3 s instead of Google (~18 s). Same answer shape; checked against all 18
//   saved Google answers. Google only if the database cannot answer.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["async function tch1767(name, p){ try{ ",
   "async function tch1767(name, p){ try{ if(p && p._src && p._src.db) return p;   /* 1769: the database answer already has the database rank and pay */ "],
  ["</body>\n</html>",
   "<script>\n/* 1769 · teacher profile from the database (coe-tchpage); Google only when the database cannot answer */\n(function(){\n" +
   "  const base = window.api; if(!base || base.__1769) return;\n" +
   "  const URL = 'https://rlxkiahqjsabopmuhern.supabase.co/functions/v1/coe-tchpage', an0 = window.apiNow;\n" +
   "  const w = function(fn){ const a = Array.prototype.slice.call(arguments, 1), self = this, go = () => base.apply(self, [fn].concat(a)), fb = () => (typeof an0 === 'function' ? an0.apply(self, [fn].concat(a)) : go());\n" +
   "    if(fn === 'mgmtTeacher' && a[0] && a[1]){\n" +
   "      return fetch(URL, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ token: a[0], op: 'teacher', name: String(a[1]) }) })\n" +
   "        .then(x => x.json()).then(r => (r && r.ok && r.data) ? Object.assign(r.data, { _src: Object.assign({ db: true }, r.data._src || {}) }) : fb(), fb); }\n" +
   "    return base.apply(this, arguments); };\n" +
   "  w.__1769 = 1; window.api = w;\n" +
   "  const an = window.apiNow; if(typeof an === 'function') window.apiNow = apiNow = function(fn){ const a = Array.prototype.slice.call(arguments, 1);\n" +
   "    if(fn === 'mgmtTeacher' && a[0] && a[1]) return w.apply(this, arguments);\n" +
   "    return an.apply(this, arguments); };\n" +
   "})();\n</script>\n</body>\n</html>"],
]);
