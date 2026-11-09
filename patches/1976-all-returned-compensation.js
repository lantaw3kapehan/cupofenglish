// 1976: (Misty 9 Nov 13:44 "change those to compensation") every RETURNED lesson on a package, including the 11 entered by hand before
//   9 Nov (e.g. ST-2023-016 2, ST-2025-028 1), shows as "compensation / 补偿" on the Lesson Summary pictures.
const file = process.argv[2];
const CMP = "(() => { try{ return window.retList1972 ? Math.round(retList1972(G, C, code, null).reduce((a, x) => a + (+x.u || 0), 0) * 10) / 10 : 0; }catch(e){ return 0; } })()";
require('../tools/lib.js')(file, [
  ["cp1975 = Math.min(rt1974, " + CMP + "), ro1975 = Math.round((rt1974 - cp1975) * 10) / 10,", "cp1975 = rt1974, ro1975 = 0,"],
  ["(rt => { const cp = Math.min(rt, " + CMP + "), ro = Math.round((rt - cp) * 10) / 10; return `Current package total", "(rt => { const cp = rt, ro = 0; return `Current package total"],
]);
