// 15 Oct · Enquiries refined: the 12 picture/message cards become a compact toolkit in three stages (Before the trial ·
// Trial booked · Enrolling), the list opens on the first tab with someone, empty tabs dimmed. Code in the .inc.
const inc = require('fs').readFileSync(require('path').join(__dirname, '165-enquiries-best.inc'), 'utf8');
require('../tools/lib.js')(process.argv[2], [
["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"],
]);
