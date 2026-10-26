// 1140: (Misty, 26 Oct 14:22) "Christian was done with the trial report with Eric but it still shows on his Today".
//      Eric's trial was logged three times in TC&SUB (11, 18 and 19 Oct, all "Trial"); the report is dated 12 Oct. The 364 rule
//      only accepted a report from 3 days BEFORE to 30 days after each logged date, so the 18 and 19 Oct entries kept asking for
//      a report. A trial now counts as reported when the same student (code or name) has a trial report from 14 days before to
//      30 days after the logged date — one report covers the repeated entries of the same trial. No records change.
require('../tools/lib.js')(process.argv[2], [
  ["const lo = add(x.date, -3), hi = add(x.date, 30), c = String(x.code || '').trim().toUpperCase()",
   "const lo = add(x.date, -14), hi = add(x.date, 30), c = String(x.code || '').trim().toUpperCase()"]
]);
