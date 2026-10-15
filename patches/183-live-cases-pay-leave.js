// 15 Oct · Cases, Payroll and Leave (management) straight from the database, checked identical to Google first
// (142 cases, 628 payroll rows, leave). Google stays the fallback.
require('../tools/lib.js')(process.argv[2], [
["const SB_LIVE = /^(mgmt(Active|Students|Student|StuClasses|Schedule|TeacherWeek|Teacher|AvailAll|MonDay)|t(Student|Schedule|FbStatus|HwHist|Reminders|Goals|Leave)|getBootstrap)$/;", "const SB_LIVE = /^(mgmt(Active|Students|Student|StuClasses|Schedule|TeacherWeek|Teacher|AvailAll|MonDay|Actions|Payroll|Leave)|t(Student|Schedule|FbStatus|HwHist|Reminders|Goals|Leave)|getBootstrap)$/;"],
]);
