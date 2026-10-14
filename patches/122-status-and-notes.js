// 14 Oct night · Status & notes in one place (Misty: trial or student, active or not, when they renew, pause or stop we can
// always make a note; simple, no repetition, use what we built).
// · The student page (management) gets a "Status" box at the top: trial · active · not active, the current status, the
//   latest notes, and one button "Update · add a note" (trial → the trial follow-up card; otherwise the renewal card),
//   plus Enrolled · paid (trial) or Renewed · paid.
// · Those two cards (also opened from To do and Trials) get a bigger note box, "Save note only · status stays" and the
//   student's history. The trial card gets "Enrolled · paid" when the student code is known.
// · History = S-LOG tab (server paste SERVER-STATUSLOG): every status change, enrolment, renewal and note, newest first.
// The new screen code is in 122-status-and-notes.inc (same folder).
const inc = require('fs').readFileSync(require('path').join(__dirname, '122-status-and-notes.inc'), 'utf8');
require('../tools/lib.js')(process.argv[2], [
["function fuSheet(i){ const x = TDF[i]; if(!x) return; FUS = { k: x.k, name: x.name, st: null };",
 "function fuSheet(i){ const x = typeof i === 'object' ? i : TDF[i]; if(!x) return; FUS = { k: x.k, name: x.name, st: null, code: x.code || '', teacher: x.teacher || '' };"],
["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"],
]);
