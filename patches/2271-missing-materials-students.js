// 2271 (16 Nov): Missing materials · the "Students" count read the student list the wrong way and showed — for every book.
// Now: students on the list (no trial classes), each counted once, so books in use come first.
const lib = require("../tools/lib.js"), file = process.argv[2];
lib(file, [["function inUse(){ const L = (window.SL && SL.students) || (D && D.students) || [], m = {}; L.forEach(s => codes(s.book).forEach(c => { m[c] = (m[c] || 0) + 1; })); return m; }",
  "function inUse(){ const L = (typeof SL !== 'undefined' && SL && SL.students) || (D && D.students) || [], m = {}, seen = {}; L.filter(s => !s.trial && s.code && !seen[s.code] && (seen[s.code] = 1)).forEach(s => codes(s.book).forEach(c => { m[c] = (m[c] || 0) + 1; })); return m; }   /* 2271 */"]]);
