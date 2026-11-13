// 2165 (13 Nov · Misty 18:09 "we can do 4" · 18:12 "make these live now"): To do › Fix these › "At risk · …" items (coe_at_risk in
// coe_ops_check, kind risk: parent cancellations, classes dropping, nothing booked ahead, renewal reminder unanswered, teacher change).
// Open = the student; "Called ✓" hides it until next week (coe-ops v5 takes risk: refs). Management only (Fix these is management).
const lib = require("../tools/lib.js"), file = process.argv[2];
lib(file, [
  ["(x.kind === 'renew' ? 'Done today' : 'It\\'s correct')", "(x.kind === 'renew' ? 'Done today' : x.kind === 'risk' ? 'Called ✓' : 'It\\'s correct')"],
  ["if(x.kind === 'renew'){ var cd2163", "if(x.kind === 'renew' || x.kind === 'risk'){ var cd2163"],
  ["toast(x.kind === 'renew' ? '✓ Recorded as done today", "toast(x.kind === 'risk' ? '✓ Noted · it comes back next week only if still at risk' : x.kind === 'renew' ? '✓ Recorded as done today"],
]);
