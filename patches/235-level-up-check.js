// 16 Oct · Level-up check: management asks from the student page, the teacher answers in the progress check (Ready / Almost / Not yet + why).
const inc = require('fs').readFileSync(require('path').join(__dirname, '235-level-up-check.inc'), 'utf8');
require('../tools/lib.js')(process.argv[2], [
["if(r.done){ $('sheetBody').innerHTML = '<h1>Progress check</h1>", "if(r.done && !(window.lvSkipDone && lvSkipDone(P.code, r.done))){ $('sheetBody').innerHTML = '<h1>Progress check</h1>"],
["why: window._pcWhy || '' }, tot = body.r", "why: window._pcWhy || '', levelUp: window.lvBody ? lvBody(P.code, P.picks) : undefined }, tot = body.r"],
["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"],
]);
