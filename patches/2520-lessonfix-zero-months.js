// 2520 (Misty 14:57, Sunny ST-2025-011: Mayi's classes on 1–2 March were not counted): "Correct a month" now lists every month
//   from the package start, including months that show 0 (before, only months with lessons or an earlier correction).
const file = process.argv[2];
require('../tools/lib.js')(file, [[
  "return x.ym && (x.v > 0 || F.some(function(f){ return f.ym === x.ym; })) && (!st || x.ym >= st); }).reverse();",
  "return x.ym && (!st || x.ym >= st); }).reverse();"]]);
