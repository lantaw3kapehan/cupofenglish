// 19 Oct · Teacher Excellence for all teachers: header badge, My growth card + monthly timeline, Teacher of the Month on Today.
const inc = require('fs').readFileSync(require('path').join(__dirname, '292-teacher-excellence-teachers.inc'), 'utf8');
require('../tools/lib.js')(process.argv[2], [["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"]]);
