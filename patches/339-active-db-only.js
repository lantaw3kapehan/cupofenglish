// 19 Oct · Active only from the database (no Google backup); after a package save it is read again at 1, 3 and 6 minutes.
const inc = require('fs').readFileSync(require('path').join(__dirname, '339-active-db-only.inc'), 'utf8');
require('../tools/lib.js')(process.argv[2], [["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"]]);
