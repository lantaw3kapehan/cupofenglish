// 20 Oct · Overview › Business: four small numbers and one profit-per-month chart around a zero line (teal profit, coral loss, this month dashed).
const inc = require('fs').readFileSync(require('path').join(__dirname, '407-business-card.inc'), 'utf8');
require('../tools/lib.js')(process.argv[2], [["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"]]);
