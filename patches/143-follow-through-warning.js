// 15 Oct · Warnings when management's feedback is ignored or "seen but nothing changed" (Misty).
// Level 1 Reminder (orange To do box) → Level 2 Warning (2+ days overdue, or a point from the last QA visit still
// "Not yet") → Level 3 Final warning (5+ days, 3+ overdue, or not fixed twice in 30 days / same area "Needs work" twice).
// Teacher: a red card at the top of Today; she writes what she changed or will do by when → sent to management.
// Management › Messages: "⚠ Not acting on feedback" with each teacher's items, her plan, and a ready Memorandum.
// Nothing is deducted automatically. Code in 143-follow-through-warning.inc.
const inc = require('fs').readFileSync(require('path').join(__dirname, '143-follow-through-warning.inc'), 'utf8');
require('../tools/lib.js')(process.argv[2], [
["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"],
]);
