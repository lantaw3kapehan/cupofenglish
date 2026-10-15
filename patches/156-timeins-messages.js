// 15 Oct · Time-ins: each teacher without a time-in shows her deadline (30 min before her first class) and the time left,
// plus "x of y timed in · next due" at the top. Messages: App health reports get their own tab (out of All and the
// counts), the screen opens on "Needs you" when something waits, unread rows have a coral edge. Code in the .inc.
const inc = require('fs').readFileSync(require('path').join(__dirname, '156-timeins-messages.inc'), 'utf8');
require('../tools/lib.js')(process.argv[2], [
["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"],
]);
