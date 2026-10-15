// 15 Oct night · Payroll: when last month is all paid, it folds down and the month now running comes to the top.
const inc = require('fs').readFileSync(require('path').join(__dirname,'204-payroll-current-month.inc'),'utf8');
require('../tools/lib.js')(process.argv[2], [
["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"],
]);
