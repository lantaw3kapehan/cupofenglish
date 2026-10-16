// 16 Oct · Schedule: choosing a teacher shows her open slots for the day shown (tap a time to book it).
const fs = require('fs'), inc = fs.readFileSync(__dirname + '/217-schedule-open-slots.inc', 'utf8');
require('../tools/lib.js')(process.argv[2], [
["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"],
]);
