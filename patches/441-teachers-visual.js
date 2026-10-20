// 20 Oct · Teachers screen: a team summary with units by rank, rank grouping, tighter rows, attendance without empty months.
const inc = require('fs').readFileSync(require('path').join(__dirname, '441-teachers-visual.inc'), 'utf8');
require('../tools/lib.js')(process.argv[2], [["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"]]);
