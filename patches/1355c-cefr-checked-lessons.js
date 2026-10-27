// 1355c: a journey step without a confirmed date (日期核对中 · being checked) hands its lessons to the nearest CONFIRMED step before it
//   (Nico ST-2025-127 had two such steps; 39.5 lessons stayed on the first). Management still shows these steps; the Student portal hides them.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["const k = DT.indexOf(x), pr = k > 0 ? DT[k - 1] : null;",
   "const k = DT.indexOf(x), pr = DT.slice(0, Math.max(0, k)).reverse().find(y => !y.chk && !(y.d && y.d.slice(0, 7) === f07 && !y.start && !y.dd && !y.cal && /^(Level|Book)/.test(y.en))) || null;"],
]);
