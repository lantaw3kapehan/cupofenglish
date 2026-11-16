// 2265 (Misty 16 Nov 17:21 "for all books with audio, it has been fixed right?"): the other book with audio, Oxford Discover Futures 1
// (Student's Book audio 65 · Workbook audio 15), now reads like DK: rows by unit, tracks as printed in the book ("Unit 1  ▶ 1.01 ▶ 1.02 …")
// instead of file names (ODF_SB1_1.01), and the folders read "Student's Book audio" / "Workbook audio".
const lib = require("../tools/lib.js"), file = process.argv[2];
lib(file, [
 ["/i.exec(base); if(!m) return null;",
  "/i.exec(base); if(!m){ const q = /(?:^|_)(?:SB|WB)\\d*_(\\d+)\\.(\\d+)$/i.exec(base); return q ? { u: +q[1], x: 0, k: 'Unit ' + q[1], t: q[1] + '.' + q[2], acc: '', o: 1 } : null; }   /* 2265: ODF_SB1_1.01 */"],
 ["const k = f.p.u + '.' + f.p.x;", "const k = f.p.k || (f.p.u + '.' + f.p.x);"],
 ["'Exercise ' + k + (f.p.t === 'Play' ? '' : ' · ' + f.p.t)", "(f.p.k ? 'Track ' + f.p.t : 'Exercise ' + k + (f.p.t === 'Play' ? '' : ' · ' + f.p.t))"],
 ["if(sb && /^\\d+$/.test(g)) sb.textContent = 'Unit ' + g;",
  "if(sb && /^\\d+$/.test(g)) sb.textContent = 'Unit ' + g; else if(sb && /work[_\\s-]*book[_\\s-]*audio/i.test(g)) sb.textContent = 'Workbook audio'; else if(sb && /student'?s?[_\\s-]*book[_\\s-]*audio/i.test(g)) sb.textContent = \"Student's Book audio\";   /* 2265 */"],
]);
