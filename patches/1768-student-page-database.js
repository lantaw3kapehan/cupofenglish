// 1768: (Misty 5 Nov 10:04 "let us do 1-4" · "everything read directly from the database")
//   The student page (management mgmtStudent, teacher tStudent) is answered by the database (edge coe-stupage: S-NOTES, PR-DATA, TR-DATA,
//   DATABASE with app corrections, S-MONTHLY, feedback) in ~0.1 s instead of Google (~5 s). Same answer shape; checked against 477 saved
//   Google answers (all differences = data that changed after Google's answer). Google is used only if the database cannot answer.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["</body>\n</html>",
   "<script>\n/* 1768 · student page from the database (coe-stupage); Google only when the database cannot answer */\n(function(){\n" +
   "  const base = window.api; if(!base || base.__1768) return;\n" +
   "  const URL = 'https://rlxkiahqjsabopmuhern.supabase.co/functions/v1/coe-stupage', an0 = window.apiNow;\n" +
   "  const w = function(fn){ const a = Array.prototype.slice.call(arguments, 1), self = this, go = () => base.apply(self, [fn].concat(a)), fb = () => (typeof an0 === 'function' ? an0.apply(self, [fn].concat(a)) : go());\n" +
   "    if((fn === 'mgmtStudent' || fn === 'tStudent') && a[0] && a[1]){\n" +
   "      return fetch(URL, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ token: a[0], op: 'student', code: String(a[1]) }) })\n" +
   "        .then(x => x.json().then(r => ({ st: x.status, r }))).then(({ st, r }) => {\n" +
   "          if(r && r.ok && r.data) return r.data;\n" +
   "          if(st === 403 && r && r.msg) return { ok: false, msg: r.msg };\n" +
   "          return fb(); }, fb); }\n" +
   "    return base.apply(this, arguments); };\n" +
   "  w.__1768 = 1; window.api = w;\n" +
   "  /* background refreshes inside the app's saved-copy layer also come from the database */\n" +
   "  const an = window.apiNow; if(typeof an === 'function') window.apiNow = apiNow = function(fn){ const a = Array.prototype.slice.call(arguments, 1), self = this;\n" +
   "    if((fn === 'mgmtStudent' || fn === 'tStudent') && a[0] && a[1]) return w.apply(self, arguments);\n" +
   "    return an.apply(this, arguments); };\n" +
   "})();\n</script>\n</body>\n</html>"],
]);
