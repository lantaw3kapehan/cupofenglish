// 20 Oct · Sales & costs, executive view: the picture, what to do next, this month, clickable 12 months with break-even, years, sources, spending, dues, checks.
const inc = require('fs').readFileSync(require('path').join(__dirname, '473-money-executive.inc'), 'utf8');
require('../tools/lib.js')(process.argv[2], [["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"]]);
