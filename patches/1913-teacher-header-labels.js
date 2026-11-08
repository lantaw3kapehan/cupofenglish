// 1913: (Misty 8 Nov 15:02 "also designs and all, interface, UI and related")
//   Header: on phones/narrow screens the "Teacher of the Month" badge sat in a 0-height row,
//     so the "Time in opens" pill was drawn on top of it → the badge row now takes its own height.
//   Schedule / My schedule: "· from the CupOfEnglish calendar" → "· live from the app" (Google Calendar is off since 1907).
//   Pay / rank: "since Before 2026" → "since before 2026".
const lib = require('../tools/lib.js'), file = process.argv[2];
lib(file, [
  ["'body.role-t header .hd #tinNag{order:4}' +",
   "'body.role-t header .hd #tinNag{order:4}' +\n    'header .hd .sp:has(#cmHead){height:auto!important;text-align:center;margin:2px 0}' +"],
  ["body.is-mgr header .hd #onlN{order:4} body.is-mgr header .hd #tinNag{order:5}}",
   "body.is-mgr header .hd #onlN{order:4} body.is-mgr header .hd #tinNag{order:5} header .hd .sp:has(#cmHead){height:auto!important;text-align:center;margin:2px 0}}"],
  ["year:'numeric'}))} · from the CupOfEnglish calendar</div>",
   "year:'numeric'}))} · live from the app</div>"],
  [".replace('from the CupOfEnglish calendar</div>', 'from the CupOfEnglish calendar</div></div>')",
   ".replace('live from the app</div>', 'live from the app</div></div>')"],
  ["year: 'numeric' }))} · from the CupOfEnglish calendar</div>",
   "year: 'numeric' }))} · live from the app</div>"],
  ["${me.rankDate?' · since '+esc(me.rankDate):''}</div>",
   "${me.rankDate?' · since '+esc(String(me.rankDate).replace(/^Before /,'before ')):''}</div>"],
  ["${m.rankDate?' · since '+esc(m.rankDate):''}</span>",
   "${m.rankDate?' · since '+esc(String(m.rankDate).replace(/^Before /,'before ')):''}</span>"],
]);
