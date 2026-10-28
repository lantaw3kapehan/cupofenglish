// 1473 · Operations QA 28 Oct (Misty: "lessons-left accuracy is critical — show 核对中 rather than guess").
//   Students › a student › + Record renewal (Renewed · paid) waits for the package check (mgmtRenewPaid, dry run) and then shows
//   "<left> left + <new> new = <total> lessons", the valid-until date, and enables Save. If that check answered "ok" without a
//   lessons-left number, the form showed "ACTIVE row undefined", "undefined left + 33 new = NaN lessons", a valid-until date worked
//   out from 0 carried lessons, and an enabled Save renewal (seen in the Operations preview). Google's answer always carries the
//   number, so real renewals are unchanged; but any other answer shape (a database-first answer, a queued answer) must never be
//   shown as a count. Now such an answer is treated like a failed check: "Lessons left are still being checked (核对中), so nothing can
//   be saved yet. Try again in a minute." with the same Try again button. No calculation, save or permission changes.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["if(!r || !r.ok){ delete RP_PRE[String(code).toUpperCase()]; const h = $('rpH'); if(h) h.innerHTML = esc(code) + ' · <span style=\"color:#C0533D\">' + esc((r && r.msg) || 'Could not read the package.') + '</span>';",
   "const noLeft1473 = !!(r && r.ok) && (r.left == null || r.left === '' || !isFinite(+r.left));   /* 1473: never show a count we do not have */\n" +
   "if(!r || !r.ok || noLeft1473){ delete RP_PRE[String(code).toUpperCase()]; const h = $('rpH'); if(h) h.innerHTML = esc(code) + ' · <span style=\"color:#C0533D\">' + esc(noLeft1473 ? 'Lessons left are still being checked (核对中), so nothing can be saved yet. Try again in a minute.' : (r && r.msg) || 'Could not read the package.') + '</span>';" +
   " if(noLeft1473){ const P = $('rpP'); if(P) P.innerHTML = '<div class=\"small\">Lessons left: <b>checking (核对中)</b></div>'; }"]
]);
