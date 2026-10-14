// 14 Oct night · Teachers' student pages are also worked out by the database (the same page as management sees, with
// the money and contact columns emptied as before). A teacher only gets her own students: the database checks the
// teacher column in ACTIVE (otherwise it falls back to Google, as now).
require('../tools/lib.js')(process.argv[2], [
["const SB_LIVE = /^mgmt(Active|Students|Student|StuClasses)$/;",
 "const SB_LIVE = /^(mgmt(Active|Students|Student|StuClasses)|tStudent)$/;"],
]);
