// 20 Oct · Trial report made in the app the moment the teacher sends it (two pages, English + Chinese, PDF + picture), no hourly wait.
const inc = require('fs').readFileSync(require('path').join(__dirname, '360-trial-instant.inc'), 'utf8');
require('../tools/lib.js')(process.argv[2], [["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"]]);
