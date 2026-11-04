// 1749: (Misty 4 Nov 16:42 "add the payment method, it's fixed Bank Transfer (UnionBank) like in the old payslip") every database
//   payslip shows "Payment method: Bank Transfer (UnionBank)" unless a different method is saved for that payslip (✎ Edit this payslip).
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["(sl.method ? ' · Payment method: ' + esc(sl.method) : '')", "' · Payment method: ' + esc(sl.method || 'Bank Transfer (UnionBank)')"],
  ["value=\"' + esc(sl.method || '') + '\"", "value=\"' + esc(sl.method || 'Bank Transfer (UnionBank)') + '\""],
]);
