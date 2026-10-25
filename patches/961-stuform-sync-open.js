// 961 (R1, found while testing 960): fixes a regression of patch 841 — the second "Edit student" opens on a loading card
// that never finishes (grey bars, no form, no Save).
// Cause: 841 stamps the loading card (data-sf841) AFTER stuForm returns, and only lets the form replace a stamped card.
// When the form lists are already known (DBL, kept in localStorage "coe.dbl") and the student's row is in DATABASE (DB),
// stuForm draws the loading card AND the form in the same step, with no wait in between — before the stamp exists —
// so 841 treated the form as stale and dropped it. Reproduced in the preview: 1st open OK, 2nd open stuck
// (live app.html without 841: both open). Every Edit after the first in a session was affected.
// Change: while stuForm itself is still running its first (synchronous) step, the form it draws is its own and may
// replace the loading card it has just drawn. A form that arrives later still needs the stamp, exactly as 841 intended.
// (Better folded into 841 itself; kept separate because 841 is not in R1's patch range.)
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["let GEN = 0, SFN = 0, opener = null, ALLOW = 0;",
   "let GEN = 0, SFN = 0, opener = null, ALLOW = 0, INSF961 = 0;"],
  ["try{ if(!ALLOW && isForm(h) && !isSkel(h)){ const b = bd();",
   "try{ if(!ALLOW && !INSF961 && isForm(h) && !isSkel(h)){ const b = bd();"],
  ["if(typeof sf0 === 'function') window.stuForm = function(row, code){ const p = sf0.apply(this, arguments);",
   "if(typeof sf0 === 'function') window.stuForm = function(row, code){ let p; INSF961++; try{ p = sf0.apply(this, arguments); } finally { INSF961--; }"]
]);
