// 15 Oct · Students (management): one compact row per student with columns Level · Lessons left · Valid until (with the
// year), sortable by name, lessons left or deadline; each student's source (partner / referral / CupOfEnglish / not set)
// under the name and at the top of the student's page. Phones keep the card list. Code in 157-students-table.inc.
const inc = require('fs').readFileSync(require('path').join(__dirname, '157-students-table.inc'), 'utf8');
require('../tools/lib.js')(process.argv[2], [
["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"],
]);
