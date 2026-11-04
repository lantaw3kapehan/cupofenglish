// 1739: (Misty 4 Nov 13:29, "go ahead") changes of an existing enquiry (status, answers, note, trial link, "sent", Enrolled) go
//   through the database queue (coe-wq v6) like batches 1–3. A brand-new enquiry still goes to Google, which gives it its number.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["let on = !!FNS[fn];", "let on = !!FNS[fn] || (fn === 'mgmtEnqSave' && a[1] && a[1].id && !/^tmp/.test(String(a[1].id)));   /* 1739: enquiry changes */"],
  ["markPaid: 'Mark paid', tNotMine: 'Not my student' };", "markPaid: 'Mark paid', tNotMine: 'Not my student', mgmtEnqSave: 'Enquiry' };"],
]);
