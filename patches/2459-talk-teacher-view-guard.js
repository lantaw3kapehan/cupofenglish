// 2459 · with 2458: a teacher whose app remembered the in-app Talk screen goes back to Today on the next start (the library is a tab for teachers).
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["var _g = go; go = function(v){ if(v === 'talk') ensure();", "var _g = go; go = function(v){ if(v === 'talk' && !(typeof D !== 'undefined' && D && D.mgr)) v = 'today'; if(v === 'talk') ensure();"]
]);
