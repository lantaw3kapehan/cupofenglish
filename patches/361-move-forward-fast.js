// 20 Oct · "Move this and the later classes" saved in the database at once (Google Calendar follows in the background), like Stop this schedule.
require('../tools/lib.js')(process.argv[2], [
  ["(!f.forward || f.action === 'cancel') && !(f.action === 'cancel' && f.makeup)){   /* 353: Stop this schedule too */",
   "(!f.forward || f.action === 'cancel' || f.action === 'move') && !(f.action === 'cancel' && f.makeup)){   /* 353: Stop this schedule too · 361: move the later classes too */"],
  ["note: r.note + ' · Google Calendar follows in a few seconds', fwd: null, queued: r.queued }; })",
   "note: r.note + ' · Google Calendar follows in a few seconds', fwd: r.fwd || null, queued: r.queued }; })"]
]);
