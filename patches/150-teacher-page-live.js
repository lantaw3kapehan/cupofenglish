// 15 Oct · Stage 1 · A teacher's page on the management side comes from the database (Google took up to 70 s when busy).
// Checked for Kat, Pam, Dezza and Ara: the same students, schedule, pay, cases, last 30 time-ins and last 40 class notes;
// the only difference is whose turn the monthly feedback is on 3 shared students (as for the home screen).
require('../tools/lib.js')(process.argv[2], [
["const SB_LIVE = /^(mgmt(Active|Students|Student|StuClasses|Schedule|TeacherWeek)|t(Student|Schedule|FbStatus)|getBootstrap)$/;",
 "const SB_LIVE = /^(mgmt(Active|Students|Student|StuClasses|Schedule|TeacherWeek|Teacher)|t(Student|Schedule|FbStatus)|getBootstrap)$/;"],
]);
