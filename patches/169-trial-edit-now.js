// 15 Oct · Trial details: add the Edit details button while the trial is still loading (the opener waits for slow
// parts, so the button never appeared).
require('../tools/lib.js')(process.argv[2], [
["tlOpen = async function(){ const r = await _tl.apply(this, arguments);\n      const add = () =>", "tlOpen = async function(){ const _p = _tl.apply(this, arguments);\n      const add = () =>"],
["[0, 300, 900, 2000, 4000].forEach(t => setTimeout(add, t));", "[0, 300, 900, 2000, 4000, 7000].forEach(t => setTimeout(add, t)); const r = await _p;"],
]);
