// 1727: (Misty 3 Nov 21:54, 4 Nov 10:28 "for Joy like this") Lesson summary: the referral incentive was read only from the package's first
//   ACTIVE row. When a student has two teacher rows (Joy: Ara + Julia) the sheet puts INCENTIVE on one of them, so the summary showed none.
//   Now it takes the highest incentive among the student's rows of this package (same student code), so shared and two-teacher packages show it.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["incRaw = C.incentive != null ? o[C.incentive] : '', inc = +incRaw || 0,",
   "incRaw = C.incentive != null ? (rows0.concat([o]).map(x => x[C.incentive]).filter(v => v !== '' && v != null).sort((a, b) => (+b || 0) - (+a || 0))[0] ?? o[C.incentive]) : '', inc = +incRaw || 0,   /* 1727: any row of the package */"]
]);
