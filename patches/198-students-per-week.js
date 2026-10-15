// 15 Oct night · Students (management): classes a week from each student's history, at a glance, sortable.
const inc = require('fs').readFileSync(require('path').join(__dirname,'198-students-per-week.inc'),'utf8');
require('../tools/lib.js')(process.argv[2], [
["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"],
]);
