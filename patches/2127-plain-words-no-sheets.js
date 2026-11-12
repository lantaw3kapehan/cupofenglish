// 2127 (12 Nov audit · "everything is moved to the database"): payment and enrolment screens still spoke of Google sheet tabs
// (SALES, ACTIVE, DATABASE, "calculated by the sheet", "saved to Google Drive"). Those are no longer where things are saved.
// Plain words now, the same actions.
const lib = require("../tools/lib.js"), file = process.argv[2];
lib(file, [
  ["note: 'Sale saved · in SALES within a minute' }", "note: 'Sale saved' }"],
  ["'The ENROLLED invoice in SALES is newer than the package start'", "'The payment is newer than the package start'"],
  ["Could not read SALES for the renewal check · try again", "Could not read the payments for the renewal check · try again"],
  ["<div class=\"mute small\">Goes into SALES · RMB and PHP are calculated by the sheet</div>", "<div class=\"mute small\">Saved to Sales · RMB and PHP are worked out from the price list</div>"],
  ["Tap to choose, or drop it here · saved to Google Drive and linked in SALES", "Tap to choose, or drop it here · saved with the sale"],
  ["' · first package · SALES, ACTIVE and DATABASE in one save</div>", "' · first package · payment, package and student record in one save</div>"],
  ["' · first package · adds the ACTIVE row for you</div>'", "' · first package · adds the package for you</div>'"],
  ["· looking for payments in SALES…</span>", "· looking for payments…</span>"],
  ["<b>New payment</b><span>add it to SALES now</span>", "<b>New payment</b><span>record it now</span>"],
  ["Same as doing it by hand: the payment in SALES · a new ACTIVE row near the top (formulas copied, ACTIVE ticked, ENROLLED = that SALES row) · DATABASE › first class and lessons if empty. The calendar is not changed.",
   "Saves the payment, the new package and the student’s first class and lessons (if empty). The calendar is not changed."],
  ["(ENS.sale ? 'payment already in SALES (row ' + ENS.sale + ')' : 'new SALES row')", "(ENS.sale ? 'payment already recorded' : 'new payment')"],
  ["'The new package in SALES, ACTIVE and DATABASE in one save'", "'The payment and the new package in one save'"],
]);
