// 1606 · Finance › Payroll from the database (coe-payroll) instead of Google. Since 28 Oct (1367) the payroll screen asked
//   Google every time (15 times in an hour this morning, ~5 s each) because the database's own payroll left out rows with
//   ₱0 net (Katherine, Rose). PAYROLL is now copied every minute (PAYROLL28) and coe-payroll applies Google's new rule (any
//   row with units, lesson pay, base, bonus, gross or net) and Google's exact formats. Checked against Google's answer of
//   29 Oct 10:06: 633 rows, 0 differences. Management only. Google is used when the copy is older than 15 min or on any error.
//   (Placed after 1367 in the page so it runs before 1367's route to Google.)
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["</script>\n<script>\n/* 1366 · each person sees only",
   "</script>\n<script>\n/* 1606 · Finance › Payroll from the database (coe-payroll); Google when the copy is old or on any error */\n(function(){\n" +
   "  const base = window.api; if(!base || base.__1606) return;\n" +
   "  const URL_ = 'https://rlxkiahqjsabopmuhern.supabase.co/functions/v1/coe-payroll';\n" +
   "  const w = function(fn){ const a = Array.prototype.slice.call(arguments, 1), self = this, g = () => base.apply(self, [fn].concat(a));\n" +
   "    if(fn === 'mgmtPayroll' && typeof LIVE !== 'undefined' && LIVE && typeof D !== 'undefined' && D && D.mgr && a[0] === TOKEN){\n" +
   "      const ac = window.AbortController ? new AbortController() : null, tid = ac ? setTimeout(() => ac.abort(), 6000) : 0;\n" +
   "      return fetch(URL_, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ token: TOKEN }), signal: ac ? ac.signal : undefined }).then(x => x.json()).finally(() => clearTimeout(tid))\n" +
   "        .then(r => (r && r.ok && r.data && Array.isArray(r.data.rows)) ? r.data : g(), g); }\n" +
   "    return base.apply(this, arguments); };\n" +
   "  w.__1606 = 1; for(const k in base) try{ w[k] = base[k]; }catch(e){} window.api = w;\n" +
   "})();\n" +
   "</script>\n<script>\n/* 1366 · each person sees only"],
]);
