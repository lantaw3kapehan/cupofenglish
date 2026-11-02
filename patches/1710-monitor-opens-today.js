// 1710: (QA 2 Nov 12:15) Management › Monitor opened on an old day.
//   The Monitor kept its last copy in coe.mon and, on opening, took the DAY from that copy and asked the server for that day again.
//   It only saves a new copy when the day shown is today, so once a copy was a day old it never refreshed by itself:
//   on 2 Nov the President's laptop still showed 29 Oct (94 classes, Celine's 29 Oct student records) as if it were today.
//   · The saved copy is now used only when it is today's (Manila date); otherwise the Monitor opens on today as normal.
//   Today / Yesterday buttons and everything else unchanged.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["if(k && k.data){ M.data = k.data; M.day = k.data.day; }",
   "if(k && k.data && k.data.day === new Date(Date.now() + 8 * 3600e3).toISOString().slice(0, 10)){ M.data = k.data; M.day = k.data.day; }   /* 1710: an old day's copy never reopens as today */"]
]);
