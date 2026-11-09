// 1975: (Misty 9 Nov 13:42 "so is it returned or added? whats the right and best-fitting term?" → "compensation" · "yes I think thats better")
//   Parent-facing wording on the Lesson Summary pictures: the extra lesson given when the teacher cancels within 2 hours (1973) is
//   "compensation / 补偿", not "returned / 退回" (nothing was deducted). Total line: "(68 + 3.5 carried + 0.5 compensation)
//   共享课程包总课时（含补偿 0.5 课时）"; dated line: "Compensation: 0.5 (Penny, Nov 8; the class was not held by the teacher)
//   补偿 0.5 课时（吴佩优，11月8日；因老师原因未能上课）". Other RETURNED lessons entered by hand stay "returned / 退回".
const file = process.argv[2];
const CMP = "(() => { try{ return window.retList1972 ? Math.round(retList1972(G, C, code, null).reduce((a, x) => a + (+x.u || 0), 0) * 10) / 10 : 0; }catch(e){ return 0; } })()";
require('../tools/lib.js')(file, [
  ["rt1974 = (() => { try{ return window.retTot1974 ? retTot1974(G, C, code) : 0; }catch(e){ return 0; } })(),",
   "rt1974 = (() => { try{ return window.retTot1974 ? retTot1974(G, C, code) : 0; }catch(e){ return 0; } })(), cp1975 = Math.min(rt1974, " + CMP + "), ro1975 = Math.round((rt1974 - cp1975) * 10) / 10,"],
  ["(rt1974 ? ' + ' + rt1974 + ' returned' : '')", "(cp1975 ? ' + ' + cp1975 + ' compensation' : '') + (ro1975 ? ' + ' + ro1975 + ' returned' : '')"],
  ["${rt1974 ? '（含退回 ' + rt1974 + ' 课时）' : ''}", "${cp1975 ? '（含补偿 ' + cp1975 + ' 课时）' : ''}${ro1975 ? '（含退回 ' + ro1975 + ' 课时）' : ''}"],
  ["(rt => `Current package total", "(rt => { const cp = Math.min(rt, " + CMP + "), ro = Math.round((rt - cp) * 10) / 10; return `Current package total"],
  ["(rt ? ' + ' + rt + ' returned' : '')", "(cp ? ' + ' + cp + ' compensation' : '') + (ro ? ' + ' + ro + ' returned' : '')"],
  ["${rt ? '（含退回 ' + rt + ' 课时）' : ''}`)", "${cp ? '（含补偿 ' + cp + ' 课时）' : ''}${ro ? '（含退回 ' + ro + ' 课时）' : ''}`; })"],
  ["<b>Returned: ' + tot + '</b> (' + e(L.map(en).join('; ')) + '; class not held by the teacher)<br>已退回 ' + tot + ' 课时（' + e(L.map(zh).join('；')) + '；因老师原因未能上课）</div>'",
   "<b>Compensation: ' + tot + '</b> (' + e(L.map(en).join('; ')) + '; the class was not held by the teacher)<br>补偿 ' + tot + ' 课时（' + e(L.map(zh).join('；')) + '；因老师原因未能上课）</div>'"],
]);
