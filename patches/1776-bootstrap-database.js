// 1776: (Misty 5 Nov; the management start screen comparison came back identical: sys:shadow:getBootstrap 1/1 same, 112 ms)
//   The management start-up answer (getBootstrap: people, managers, shift, today's time-in) comes from the database (coe-lists op bootstrap)
//   instead of Google. Google is still asked in the background at most every 10 minutes and compared (shadow, 1773), so any difference shows in
//   docs sys:shadow:getBootstrap. Teachers' start-up is unchanged (database copy as before). Google only if the database cannot answer.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["</body>\n</html>",
   "<script>\n/* 1776 · management start-up from the database (coe-lists bootstrap); Google compared in the background */\n(function(){\n" +
   "  if(window.__1776) return; window.__1776 = 1;\n" +
   "  const URL = 'https://rlxkiahqjsabopmuhern.supabase.co/functions/v1/coe-lists', an = window.apiNow; if(typeof an !== 'function') return; let bgAt = 0;\n" +
   "  window.apiNow = apiNow = function(fn){ const a = Array.prototype.slice.call(arguments, 1), self = this;\n" +
   "    if(fn !== 'getBootstrap' || !a[0] || (typeof D !== 'undefined' && D && D.me && !D.mgr)) return an.apply(this, arguments);\n" +
   "    return fetch(URL, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ token: a[0], op: 'bootstrap' }) }).then(x => x.json()).then(r => {\n" +
   "      if(!(r && r.ok && r.data && r.data.mgr)) return an.apply(self, [fn].concat(a));\n" +
   "      if(Date.now() - bgAt > 10 * 6e4){ bgAt = Date.now(); setTimeout(() => { try{ Promise.resolve(an.apply(self, [fn].concat(a))).catch(() => {}); }catch(e){} }, 20000); }   /* background compare (1773 sends it) */\n" +
   "      return r.data; }, () => an.apply(self, [fn].concat(a))); };\n" +
   "})();\n</script>\n</body>\n</html>"],
]);
