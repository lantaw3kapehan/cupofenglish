// 1874: (Misty 7 Nov 19:48, Virgo October "1550 this is correct") when management SETS the month's incentives or deductions
// (coe_pay_edits how 'set'), the payslip no longer lists the ACTIONS lines that the set value replaced.
const lib = require('../tools/lib.js'), file = process.argv[2];
lib(file, [
  [`const inc = cs.filter(c => c.incentive), ded = cs.filter(c => c.deduction);
    const gross = +r.gross || 0,`,
   `const set1874 = f => E.some(e => e.field === f && e.how === 'set');   /* 1874: a set value replaces the ACTIONS lines */
    const inc = set1874('bonus') ? [] : cs.filter(c => c.incentive), ded = set1874('deduct') ? [] : cs.filter(c => c.deduction);
    const gross = +r.gross || 0,`],
]);
