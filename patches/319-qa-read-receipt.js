// 19 Oct · QA read receipts: teachers must open and confirm each new QA (full-screen notice until confirmed); management sees who has read it on Performance.
const inc = require('fs').readFileSync(require('path').join(__dirname, '319-qa-read-receipt.inc'), 'utf8');
require('../tools/lib.js')(process.argv[2], [["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"]]);
