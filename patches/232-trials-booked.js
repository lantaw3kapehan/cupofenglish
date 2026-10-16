// 16 Oct · Trials starts with "Booked trial classes" straight from Schedule (no report yet), so a trial added in Schedule shows at once.
const inc = require('fs').readFileSync(require('path').join(__dirname, '232-trials-booked.inc'), 'utf8');
require('../tools/lib.js')(process.argv[2], [
["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"],
]);
