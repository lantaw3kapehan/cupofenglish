// 2561 (Misty 21 Nov 09:49, Una: "it's still Celine who is clicking wrong"): on Cancel class, "Teacher" says plainly what it
// costs and when to choose Parent instead, so a parent's decision is not recorded as the teacher's.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["n.textContent = v === 'teacher' ? 'Counts as teacher-initiated: the teacher loses this month\\'s Perfect Attendance incentive.'",
   "n.textContent = v === 'teacher' ? 'Only when the teacher cancels the class herself. It counts against her: a Missed lesson to decide (penalty) and no Perfect Attendance incentive this month. If the teacher only told us and the parent chose to cancel or move the class, choose Parent.'"],
]);
