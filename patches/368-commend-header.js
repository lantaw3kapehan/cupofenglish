// 20 Oct · The Teacher of the Month / Gold / "leading the team" message in the header beside the teacher's name, on every screen.
const inc = require('fs').readFileSync(require('path').join(__dirname, '368-commend-header.inc'), 'utf8');
require('../tools/lib.js')(process.argv[2], [["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"]]);
