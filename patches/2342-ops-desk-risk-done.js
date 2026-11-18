// 2342: Ops Desk "Done" on an at-risk / trial follow-up item first records it as contacted (coe-ops ok), then checks again.
const file = process.argv[2];
require('../tools/lib.js')(file, [
["  window.od2341Done = function(i){ var x = item(i); if(!x) return; say('Checking it again\u2026');\n    call({ op: 'done', ref: x.ref, title: x.title })", "  window.od2341Done = function(i){ var x = item(i); if(!x) return; say('Checking it again\u2026');\n    (/^(risk|tfu):/.test(x.ref) ? call({ op: 'ok', ref: x.ref }).catch(function(){}) : Promise.resolve()).then(function(){ return call({ op: 'done', ref: x.ref, title: x.title }); })   /* contacted (the same as To do's button), then checked again */"]
]);
