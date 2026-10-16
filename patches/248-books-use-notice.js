// 16 Oct · Books: "for CupOfEnglish classes only" notice on the Books screen and each book list; teachers tap "I understand" once per device.
const inc = require('fs').readFileSync(require('path').join(__dirname, '248-books-use-notice.inc'), 'utf8');
require('../tools/lib.js')(process.argv[2], [
["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"],
]);
