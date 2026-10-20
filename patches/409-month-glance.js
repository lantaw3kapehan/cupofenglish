// 20 Oct · Overview: "Month at a glance" sentence at the top; payroll as a small card at the top of the right column.
const inc = require('fs').readFileSync(require('path').join(__dirname, '409-month-glance.inc'), 'utf8');
require('../tools/lib.js')(process.argv[2], [["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"]]);
