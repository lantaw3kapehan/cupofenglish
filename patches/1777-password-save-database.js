// 1777: (Misty 5 Nov 12:52 "okay go ahead") Management "Set / Change password" saves to the database first (coe-pw, the same rules and
//   the same hashing as Google's mgmtPwSave). Google copies it into its own store on its next sync, so both sign-ins accept it.
//   Google is used when the database answers fallback (switch sys:live.pwDb off), the session is not known there, or it cannot be reached.
//   A refusal from the database (weak password, President only, already has one) is shown as is.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["</body>\n</html>",
   "<script>\n/* 1777 · password save: database first (coe-pw), Google as fallback */\n(function(){\n" +
   "  if(window.__1777) return; window.__1777 = 1;\n" +
   "  const URL = 'https://rlxkiahqjsabopmuhern.supabase.co/functions/v1/coe-pw', an = window.apiNow; if(typeof an !== 'function') return;\n" +
   "  window.apiNow = apiNow = function(fn){ const a = Array.prototype.slice.call(arguments, 1), self = this;\n" +
   "    if(fn !== 'mgmtPwSave' || !a[0]) return an.apply(this, arguments);\n" +
   "    const g = () => an.apply(self, [fn].concat(a));\n" +
   "    return fetch(URL, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ op: 'set', token: a[0], name: a[1], password: a[2], change: !!a[3] }) })\n" +
   "      .then(x => x.json().catch(() => null)).then(r => { if(r && r.ok && r.email) return r; if(r && r.ok === false && r.msg && !r.fallback) return r; return g(); }, g); };\n" +
   "})();\n</script>\n</body>\n</html>"],
]);
