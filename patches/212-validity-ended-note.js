// 16 Oct · Validity ended · extended N days, on the student name (class cards, Students list, student page).
const inc = require('fs').readFileSync(require('path').join(__dirname,'212-validity-ended-note.inc'),'utf8');
require('../tools/lib.js')(process.argv[2], [
["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"],
]);
