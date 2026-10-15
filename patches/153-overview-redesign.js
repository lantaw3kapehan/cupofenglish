// 15 Oct · Management Overview redesigned (Misty: "improve the visual design … the best way possible"). Same numbers and
// buttons; calmer header with three status tiles, four equal KPI cards, Decide now + Waiting on teachers side by side,
// App check moved to a quiet line at the bottom, Business wide with Quality beside it. Code in 153-overview-redesign.inc.
const inc = require('fs').readFileSync(require('path').join(__dirname, '153-overview-redesign.inc'), 'utf8');
require('../tools/lib.js')(process.argv[2], [
["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"],
]);
