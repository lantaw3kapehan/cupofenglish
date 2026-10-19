// 19 Oct · 310 · Teacher Excellence charts use the space: the scale starts just below the Bronze line (or the lowest score), not at 40,
// so the Bronze / Silver / Gold lines and the dots spread out instead of sitting in a thin band at the top.
require('../tools/lib.js')(process.argv[2], [
  ["W = Math.min(600, Math.max(360, H.length * 130)), HH = 150, lo = Math.max(0, Math.min(40, ...H.map(x => Number(x.me.total) - 5)))",
   "W = Math.min(600, Math.max(360, H.length * 130)), HH = 130, lo = Math.max(0, Math.min(58, ...H.map(x => Number(x.me.total) - 6)))"],
  ["W = 180, HH = 44, lo = 40", "W = 180, HH = 44, lo = Math.max(0, Math.min(58, ...H.map(x => Number(x.me.total) - 6)))"]]);
