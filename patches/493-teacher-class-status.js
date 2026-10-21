// 21 Oct · Teacher Today: In · Homework · Note · Video status pills on each class (done ✓ green · due ! coral · later ○ grey); done boxes fold into them.
const inc = require('fs').readFileSync(require('path').join(__dirname, '493-teacher-class-status.inc'), 'utf8');
require('../tools/lib.js')(process.argv[2], [["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"]]);
