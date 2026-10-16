// 16 Oct · A cancelled class's time shows as open for that teacher that day (card + her open slots).
const inc = require('fs').readFileSync(require('path').join(__dirname, '221-cancelled-open.inc'), 'utf8');
require('../tools/lib.js')(process.argv[2], [
["    const B = Object.keys(best)",
 "    try{ if(typeof SC !== 'undefined' && SC && SC.date === ymd) SC.events.filter(e => e.cancelled && key(e.teacher) === k && (typeof scFreed !== 'function' || scFreed(e))).forEach(e => { const s = +new Date(e.start); blocks.push([s, Math.max(+new Date(e.end), s + L)]); if(ok(s)) best[s] = 'freed · ' + (e.student || 'a class') + ' cancelled'; }); }catch(err){}\n    const B = Object.keys(best)"],
["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"],
]);
