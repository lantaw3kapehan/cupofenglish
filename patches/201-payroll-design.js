// 15 Oct night · Payroll redesigned: one search for this month and the history, filter chips, a clean list, history by month.
const inc = require('fs').readFileSync(require('path').join(__dirname,'201-payroll-design.inc'),'utf8');
require('../tools/lib.js')(process.argv[2], [
["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"],
]);
