// 20 Oct · Performance: rank-coloured career ladder with each teacher's progress, team QA domains chart, compact teacher rows with compliance mini-bars.
const inc = require('fs').readFileSync(require('path').join(__dirname, '452-performance-visual.inc'), 'utf8');
require('../tools/lib.js')(process.argv[2], [["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"]]);
