// 19 Oct · CEFR journey: a book change that is only in the calendar so far (Lily: OD2 from 25 Oct) no longer takes this month's lessons
// from the book before it (it showed "1.5 课时" for OD2 although those lessons were OD1). Its lessons count once they appear in the monthly records.
require('../tools/lib.js')(process.argv[2], [
  ["const DT = T.filter(x => x.d && !/^Trial/.test(x.en)).sort", "const DT = T.filter(x => x.d && !/^Trial/.test(x.en) && !x.cal).sort"]
]);
