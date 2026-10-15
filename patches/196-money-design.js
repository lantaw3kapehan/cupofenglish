// 15 Oct night · Sales & costs screen redesigned (this month first with month-end pace, last full month, cleaner chart,
// years, partners, expenses, government dues and checks as cards). Same MONEY data; unknown layout → the sheet grid.
const inc = require('fs').readFileSync(require('path').join(__dirname,'196-money-design.inc'),'utf8');
require('../tools/lib.js')(process.argv[2], [
["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"],
]);
