// 1093: (Misty, 25 Oct 21:46) the parent-report PDF made in the app still said "November 2026" (report line, MONTH box,
//      2026年11月) and the progress chart labelled September's score "Oct" and this one "Nov". The app's PDF now names the
//      month of the classes, like the rest of Parent reports (1090): "October 2026 report · 2026年10月学习报告", MONTH
//      October 2026, chart Sep · Oct. Only the words on the page change; the record keys and the file stay as they are.
require('../tools/lib.js')(process.argv[2], [
  ["  const mLab = m => { try{ return new Date(m + '-15T12:00:00')",
   "  const cK = m => (window.fbClsKey ? fbClsKey(m) : m);\n  const mLab = m => { m = cK(m); try{ return new Date(m + '-15T12:00:00')"],
  ["  const mZh = m => { const p = String(m).split('-');",
   "  const mZh = m => { m = cK(m); const p = String(m).split('-');"],
  ["  const mShort = m => { try{ return new Date(m + '-15T12:00:00')",
   "  const mShort = m => { m = cK(m); try{ return new Date(m + '-15T12:00:00')"]
]);
