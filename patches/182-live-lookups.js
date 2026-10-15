// 15 Oct · More screens straight from the database (checked against Google first): a student's homework history,
// reminders sent today, goals, management's QA visits of a day. Google stays the fallback.
require('../tools/lib.js')(process.argv[2], [
["const SB_LIVE = /^(mgmt(Active|Students|Student|StuClasses|Schedule|TeacherWeek|Teacher|AvailAll)|t(Student|Schedule|FbStatus)|getBootstrap)$/;", "const SB_LIVE = /^(mgmt(Active|Students|Student|StuClasses|Schedule|TeacherWeek|Teacher|AvailAll|MonDay)|t(Student|Schedule|FbStatus|HwHist|Reminders|Goals|Leave)|getBootstrap)$/;"],
]);
