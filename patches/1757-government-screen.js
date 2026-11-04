// 1757: (Misty 4 Nov 17:56 "a separate screen for GOVERNMENT that CupOfEnglish pays") Finance › Government tab: SSS, PhilHealth,
//   Pag-IBIG, BIR & taxes, SEC & permits that CupOfEnglish paid, by month and as a list (database: coe_expenses through coe-expenses),
//   the staff contributions kept on payroll (coe_pay_people), and "+ Payment" (Add expense, category Government Contributions).
const lib = require('../tools/lib.js'), fs = require('fs'), path = require('path'), file = process.argv[2];
const inc = fs.readFileSync(path.join(__dirname, '1757-government-screen.inc.html'), 'utf8');
lib(file, [
  ["['expenses', 'Transactions'], ['money', 'Sales & costs'],", "['expenses', 'Transactions'], ['gov', 'Government'], ['money', 'Sales & costs'],"],
  ["  const has = v => v === 'expenses' || v === 'finov' ||", "  const has = v => v === 'expenses' || v === 'gov' || v === 'finov' ||"],
  ['</body>\n</html>', inc + '\n</body>\n</html>'],
]);
