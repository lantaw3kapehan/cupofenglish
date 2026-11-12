// 2124 (12 Nov audit): Payroll header said "15 of 17 paid" a third time (Disbursed and the Paid tab already say it), and when all were paid
// it spoke of "PAYROLL rows" (a sheet name). Now: "Showing October 2026 pay" · "November 2026 pay is not worked out yet".
const lib = require("../tools/lib.js"), file = process.argv[2];
lib(file, [
  ["per = 'Showing <b>' + esc(pm) + ' pay</b> · ' + paid + ' of ' + P.length + ' paid';", "per = 'Showing <b>' + esc(pm) + ' pay</b>';"],
  ["per += PLx ? ' · no ' + esc(cl) + ' rows in PAYROLL yet' : ' · checking PAYROLL for ' + esc(cl) + ' so far…';", "per += PLx ? ' · ' + esc(cl) + ' pay is not worked out yet' : ' · checking ' + esc(cl) + ' so far…';"],
]);
