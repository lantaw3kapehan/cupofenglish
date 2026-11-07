// 1873: (Misty 7 Nov "yes, let us do all now") payslips come from the database (1870); the "Old Google payslip" button is removed.
const lib = require('../tools/lib.js'), file = process.argv[2];
lib(file, [
  [`<button class="btn ghost block" style="margin-top:8px" onclick="tabSheet('PAYSLIP','Payslip',$('psN').value,$('psP').value)">Old Google payslip</button>`, ``],
]);
