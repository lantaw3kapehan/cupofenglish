// 15 Oct · Stage 1 · The teachers' monthly-feedback list comes from the database (Google took 25–48 s).
// Checked for Kat, Pam, Dezza, Ara and April: the same students, forms, done and returned reports; the only differences are
// whose turn it is on 3 shared students, where Google's own feedback history was not loaded and it fell back to the main
// teacher (the database always has the history and applies the take-turns rule).
require('../tools/lib.js')(process.argv[2], [
["const SB_LIVE = /^(mgmt(Active|Students|Student|StuClasses|Schedule|TeacherWeek)|t(Student|Schedule)|getBootstrap)$/;",
 "const SB_LIVE = /^(mgmt(Active|Students|Student|StuClasses|Schedule|TeacherWeek)|t(Student|Schedule|FbStatus)|getBootstrap)$/;"],
]);
