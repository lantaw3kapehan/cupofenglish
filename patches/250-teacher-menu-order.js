// 16 Oct · teacher menu order with headings: Classes · Team · My growth · Money.
const inc = require('fs').readFileSync(require('path').join(__dirname, '250-teacher-menu-order.inc'), 'utf8');
require('../tools/lib.js')(process.argv[2], [
["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"],
]);
