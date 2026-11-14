// 2235: Finance Government card. "November 2026 · Due Nov 15" read as one confusing line.
// Not paid yet: the big line says "Next payment: November" and the pill says "Due 15 Nov". Paid: unchanged ("Paid", the month).
const lib = require("../tools/lib.js"), file = process.argv[2];
lib(file, [
 ["(govPaid ? 'Paid' : 'Due ' + (x.govDue || '')) + '</span></div><div class=\"big\">' + (gov.month || ML(x.month)) + '</div>",
  "(govPaid ? 'Paid' : 'Due ' + String(x.govDue || '').replace(/^([A-Z][a-z]{2}) (\\d{1,2})$/, '$2 $1')) + '</span></div><div class=\"big\">' + (govPaid ? (gov.month || ML(x.month)) : 'Next payment: ' + String(gov.month || ML(x.month) || '').split(' ')[0]) + '</div>"],
 ["'SSS, Pag-IBIG, PhilHealth and BIR are due on ' + (x.govDue || 'the 15th')", "'SSS, Pag-IBIG, PhilHealth and BIR are due on ' + (x.govDue ? String(x.govDue).replace(/^([A-Z][a-z]{2}) (\\d{1,2})$/, '$2 $1') : 'the 15th')"]
]);
