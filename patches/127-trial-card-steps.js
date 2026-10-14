// 14 Oct night · Trial card in clear steps (Misty: the buttons are confusing; once enrolled, Enrolled · paid should go).
// 1 Send the report · 2 Help the parent decide (price / CEFR / course plan) · 3 Follow up · 4 Enrol · 5 Get started
// (class schedule, agreement, class notice). Each step shows ✓ when done. Once the student has a package in ACTIVE (or
// the enrolment was just saved), step 4 shows "✓ Enrolled · N lessons left · ACTIVE row" instead of the form button.
// Same buttons as before, only grouped. The code is in 127-trial-card-steps.inc.
const inc = require('fs').readFileSync(require('path').join(__dirname, '127-trial-card-steps.inc'), 'utf8');
require('../tools/lib.js')(process.argv[2], [
["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"],
]);
