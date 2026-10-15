// 15 Oct · Teachers' Schedule (week and months) and management's teacher week come from the database (checked against
// Google: Pam 41/41, Dezza 33/33, Kat 44/44 classes identical). Google stops rebuilding the months every 10 minutes.
require('../tools/lib.js')(process.argv[2], [
["const SB_LIVE = /^(mgmt(Active|Students|Student|StuClasses|Schedule)|tStudent)$/", "const SB_LIVE = /^(mgmt(Active|Students|Student|StuClasses|Schedule|TeacherWeek)|t(Student|Schedule))$/"],
]);
