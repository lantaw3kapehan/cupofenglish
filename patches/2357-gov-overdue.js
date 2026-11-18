// 2357 (QA 18 Nov): Finance Overview said "Due 15 November" on the 18th with November not paid; after the 15th it says Overdue.
const file = process.argv[2];
require('../tools/lib.js')(file, [
["(govPaid ? 'Paid' : 'Due ' + String(x.govDue || '').replace(/^([A-Z][a-z]+) (\\d{1,2})$/, '$2 $1'))", "(govPaid ? 'Paid' : (new Date(Date.now() + 8 * 36e5).getUTCDate() > 15 ? 'Overdue \u00b7 was due ' : 'Due ') + String(x.govDue || '').replace(/^([A-Z][a-z]+) (\\d{1,2})$/, '$2 $1'))"],
["'SSS, Pag-IBIG, PhilHealth and BIR are due on ' + (x.govDue", "'SSS, Pag-IBIG, PhilHealth and BIR ' + (new Date(Date.now() + 8 * 36e5).getUTCDate() > 15 ? 'were due on ' : 'are due on ') + (x.govDue"]
]);
