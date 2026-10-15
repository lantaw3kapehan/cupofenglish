// 15 Oct · Trials refined: opens on the first tab with something in it, a conversion line with one bar on top, empty
// tabs dimmed, calmer rows. Code in 164-trials-best.inc.
const inc = require('fs').readFileSync(require('path').join(__dirname, '164-trials-best.inc'), 'utf8');
require('../tools/lib.js')(process.argv[2], [
["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"],
]);
