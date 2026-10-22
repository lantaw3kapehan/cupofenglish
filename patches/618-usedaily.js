// 618: useDaily — DL[code] can be the string 'busy' while loading; only arrays are used (fixes "d.forEach is not a function").
const lib = require('../tools/lib.js');
lib(process.argv[2], [
  ["function useDaily(code){ const d = DL[code]; if(!d || !(typeof STU",
   "function useDaily(code){ const d = DL[code]; if(!Array.isArray(d) || !(typeof STU"]
]);
