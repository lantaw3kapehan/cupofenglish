// 21 Oct · Teacher Today: "Your day" line and day strip, two-line class notes, coloured time-in, sound and reminders in one small card.
const inc = require('fs').readFileSync(require('path').join(__dirname, '492-teacher-today.inc'), 'utf8');
require('../tools/lib.js')(process.argv[2], [["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"]]);
