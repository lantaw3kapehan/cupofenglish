// 1741: (Misty 4 Nov 15:26 "do it now") Shares a package (mgmtEnrolShared) and Record refund (mgmtRefund, not the dry look-up) go through
//   the database queue (coe-wq v8): the database makes the sibling's shared row / closes the refunded package and makes the SALES minus line
//   at once (coe_shared_db / coe_refund_db); Google does its full save in the background. A refusal shows in the failed-saves notice.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["mgmtTrialReturn: 1, mgmtPayReply: 1 };", "mgmtTrialReturn: 1, mgmtPayReply: 1, mgmtEnrolShared: 1 };   /* 1741 */"],
  ["mgmtPayReply: 'Pay reply', tLeaveReply: 'Leave answer' };", "mgmtPayReply: 'Pay reply', tLeaveReply: 'Leave answer', mgmtEnrolShared: 'Shared package', mgmtRefund: 'Refund (sheet)' };"],
  ["    if(fn === 'tLeaveReply') return { ok: true, queued: true, files: 0, note: 'Sent · Operations will check it' };",
   "    if(fn === 'tLeaveReply') return { ok: true, queued: true, files: 0, note: 'Sent · Operations will check it' };\n" +
   "    if(fn === 'mgmtEnrolShared') return { ok: true, queued: true, name: String(f.name || ''), ownerName: String(f.owner || ''), row: '(new)' };   /* 1741 */\n" +
   "    if(fn === 'mgmtRefund') return { ok: true, queued: true, saleRow: null, note: 'Saved · the package is closed now · Google updates the sheet in the background' };"],
  ["      || (fn === 'tLeaveReply' && !(Array.isArray(a[3]) && a[3].length));   /* 1740: a written leave answer (with a file → Google) */",
   "      || (fn === 'tLeaveReply' && !(Array.isArray(a[3]) && a[3].length))   /* 1740: a written leave answer (with a file → Google) */\n" +
   "      || (fn === 'mgmtRefund' && a[1] && !a[1].dry);   /* 1741: the refund itself (the look-up stays with Google) */"],
]);
