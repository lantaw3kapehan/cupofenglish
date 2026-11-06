// 1796: (Misty 6 Nov 15:16, Dezza's emergency leave shows "Cancelled": "celine just cancelled, it should be declined too right?
//   she should be allowed to decline and attach comments too") Operations can now set a pending (or cancelled) leave to Declined,
//   with a comment the teacher sees (at least a few words). The database handler (coe_dbf_h_leave) and Google's mgmtLeaveSave allow it
//   for Operations only with that comment; approving stays with the President.
const lib = require('../tools/lib.js'), file = process.argv[2];
lib(file, [
  ["const stOpts = P ? ['Approved','Pending','Declined','Cancelled'] : ['Pending','Cancelled'].concat(x && stOpts0(x) ? [x.status] : []);",
   "const stOpts = P ? ['Approved','Pending','Declined','Cancelled'] : ['Pending','Declined','Cancelled'].concat(x && stOpts0(x) ? [x.status] : []);   /* 1796: Operations may decline, with a comment */"],
  ["<label>Cover plan / note${P ? ' (the teacher sees it)' : ''}</label>",
   "<label>Comment / cover plan (the teacher sees it · needed to decline)</label>"],
  ["if(!remove){ if(!f.id && !f.teacher) return toast('Choose the teacher');",
   "if(!remove && f.status === 'Declined' && String(f.note || '').trim().length < 5) return toast('Write why it is declined in the comment · the teacher sees it');\nif(!remove){ if(!f.id && !f.teacher) return toast('Choose the teacher');"],
]);
