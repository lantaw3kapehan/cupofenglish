// 1997: (Misty 9 Nov sign-off · lower-privilege check) A teacher could open the empty management screens by typing their address
//   (#home, #payroll, #money, #actions …). No data came with them — every management request is refused by the server for a teacher
//   (checked 9 Nov with Pam's sign-in: payroll, money, cases, staff, overview, other teachers' pages, other students' forms) — but the screens
//   should not open at all. A teacher sent to a management screen now lands on Today.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["function go(v){\nVIEW = v;",
   "const MGMT_ONLY1997 = /^(home|monitor|mtoday|schedule|msgs|astudents|reports|assess|enquiry|trials|teachers|perf|leave|payroll|money|mypay|actions|db|team|active|expenses|finov|wallets|forecast|gov|act)$/;\nfunction go(v){\nif(typeof D !== 'undefined' && D && !D.mgr && MGMT_ONLY1997.test(String(v || ''))) v = 'today';   /* 1997: teachers never open management screens */\nVIEW = v;"],
]);
