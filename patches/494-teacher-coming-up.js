// 21 Oct · Teacher Today › Coming up as a week strip: a tile per day (classes as a bar, teaching hours); tap a day for its classes.
const inc = require('fs').readFileSync(require('path').join(__dirname, '494-teacher-coming-up.inc'), 'utf8');
require('../tools/lib.js')(process.argv[2], [["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"]]);
