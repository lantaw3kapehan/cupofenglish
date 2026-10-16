// 16 Oct · management: Change book on the student page (upcoming classes from a day on; no classes added).
const inc = require('fs').readFileSync(require('path').join(__dirname, '258-change-book.inc'), 'utf8');
require('../tools/lib.js')(process.argv[2], [["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"]]);
