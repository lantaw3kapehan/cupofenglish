// 21 Oct · Teacher Messages: status tiles, Needs you first, grouped by day, one tidy row per message with a coloured symbol for its kind.
const inc = require('fs').readFileSync(require('path').join(__dirname, '508-teacher-messages.inc'), 'utf8');
require('../tools/lib.js')(process.argv[2], [["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"]]);
