// 2473 · a saved copy of the Management card (Celine) or From Operations (President) is replaced by the real one within 2.5 s,
//   not left until the next load (seen 19 Nov: Celine's Overview kept the old Management card after 2472).
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["if(MR && !document.getElementById('my2360')) mpaint();", "if(MR && (!document.getElementById('my2360') || document.querySelector('#my2360[data-c2363]'))) mpaint();"],
  ["if(PD && !document.getElementById('pd2360')) ppaint();", "if(PD && (!document.getElementById('pd2360') || document.querySelector('#pd2360[data-c2363]'))) ppaint();"]
]);
