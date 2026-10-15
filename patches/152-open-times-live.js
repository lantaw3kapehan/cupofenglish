// 15 Oct · Stage 1 · Open times (mgmtAvailAll) come from the database: teaching hours (T-AVAIL, copied at once on save)
// and the next 21 days of classes. Checked for all 16 teachers: the same hours and the same classes (6–172 each).
require('../tools/lib.js')(process.argv[2], [
["const SB_LIVE = /^(mgmt(Active|Students|Student|StuClasses|Schedule|TeacherWeek|Teacher)|t(Student|Schedule|FbStatus)|getBootstrap)$/;",
 "const SB_LIVE = /^(mgmt(Active|Students|Student|StuClasses|Schedule|TeacherWeek|Teacher|AvailAll)|t(Student|Schedule|FbStatus)|getBootstrap)$/;"],
]);
