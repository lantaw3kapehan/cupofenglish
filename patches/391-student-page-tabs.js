// 20 Oct · Student page: calm header, one grouped action bar (Send to parent · Manage), tabs Overview / Progress / Notes / Profile.
const inc = require('fs').readFileSync(require('path').join(__dirname, '391-student-page-tabs.inc'), 'utf8');
require('../tools/lib.js')(process.argv[2], [["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"]]);
