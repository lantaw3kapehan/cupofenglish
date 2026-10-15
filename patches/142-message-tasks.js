// 15 Oct · Messages can be a TASK (Misty: "make it best" — a teacher opening a message is not the same as doing it).
// Management › New message › "What should they do?": Reply with one tap · 📌 A task to do · Just for reading.
//  · A task starts with "📌 Task ·" and stays on the teacher's To do (and the "Before you start" pop-up) until they tap
//    ✅ Done · I did it (👍 On it / 🙋 Question keep it open, and management sees the answer).
//  · Management: the notice shows "x of y done", "Remind the n who have not done it", and Messages has a
//    "📌 Tasks not done yet" card by person. Works for every teacher; no server change (uses the existing reply column).
// Code in 142-message-tasks.inc.
const inc = require('fs').readFileSync(require('path').join(__dirname, '142-message-tasks.inc'), 'utf8');
require('../tools/lib.js')(process.argv[2], [
["  const KINDS = [\n", "  const KINDS = [\n    [/^Task$/i, 'Open · mark done'],\n"],
["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"],
]);
