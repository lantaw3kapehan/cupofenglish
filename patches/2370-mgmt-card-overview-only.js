// 2370 (QA, steady screens): the Management card stays on Celine's Overview only; inside the Ops Desk it was removed and put back each minute (154 px jumps on To do).
const file = process.argv[2];
require('../tools/lib.js')(file, [
["[['om2344', '.tiles'], ['od2341', null]].forEach(function(p){", "[['om2344', '.tiles']].forEach(function(p){"]
]);
