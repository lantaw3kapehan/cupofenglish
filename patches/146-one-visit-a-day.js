// 15 Oct · One class visit per teacher per day (Misty: "she can QA 1 teacher 1 lesson daily").
// Opening a class visit for a teacher who already had one that day shows who/when, suggests the teachers not visited the
// longest (with their next class), and the save button becomes "Save anyway · 2nd visit on this day".
// Code in 146-one-visit-a-day.inc.
const inc = require('fs').readFileSync(require('path').join(__dirname, '146-one-visit-a-day.inc'), 'utf8');
require('../tools/lib.js')(process.argv[2], [
["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"],
]);
