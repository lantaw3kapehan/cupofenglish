// 1472 · Operations QA 28 Oct (Misty's priority 5: "show each role only the controls its permissions allow"; clear next action).
//   Finance › Payroll told Operations "tap a teacher for the breakdown, payslip and Mark paid", but Mark paid is not on her
//   teacher card (it is the President account's step; Operations sends the payslip). The hint now names only what that person
//   can do: "tap a teacher for the breakdown and payslip" for Operations; unchanged for the President. Display only —
//   who can mark pay as paid is unchanged.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["<span>tap a teacher for the breakdown, payslip and Mark paid</span>",
   "<span>tap a teacher for the breakdown${typeof isPres === 'function' && isPres() ? ', payslip and Mark paid' : ' and payslip'}</span>"]
]);
