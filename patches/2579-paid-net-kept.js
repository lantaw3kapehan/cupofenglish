// 2579 (audit QA-01 follow-up, verified 21 Nov): the payroll database layer (1743) replaced each teacher's net with today's calculation,
// so a paid teacher showed ₱24,220 (Julia) though ₱24,130 was paid. A paid teacher now keeps the recorded paid net; today's
// calculation goes in calcNet, which the 2569 card shows as the difference. Unpaid teachers are unchanged.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["deduct: +r.deduct, gov: gid ? 0 : +r.sss + +r.pagibig + +r.philhealth, net: +r.net, _db: 1, _edits: (r.edited || []).length });",
   "deduct: +r.deduct, gov: gid ? 0 : +r.sss + +r.pagibig + +r.philhealth, net: (r.paid && x._sheet && x._sheet.net != null && +x._sheet.net > 0) ? +x._sheet.net : +r.net, calcNet: +r.net, _db: 1, _edits: (r.edited || []).length });   /* 2579: paid = the recorded amount */"],
]);
