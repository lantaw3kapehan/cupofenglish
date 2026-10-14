// 14 Oct pm · Tapping a student opens at once (Misty: "in To do … when I click other buttons, too slow" — Rock's page took ≈ 8 s).
// Student pages are the same for every manager, so the app now reads the one shared copy (scope 'mgmt') that the server keeps
// up to date in the database for every student (server paste SERVER-STUDENTS). A student page copy up to 7 days old is shown
// at once while the fresh page loads in the background (it redraws by itself if anything changed).
require('../tools/lib.js')(process.argv[2], [
["const SB_SH = /^mgmt(Health|Night|PayReady|AvailAll|Performance|TeacherCard|Peer|Hours|Trials|Reports|PayChecks|Active|Renewals|Overview|Schedule|Teacher)$/;",
 "const SB_SH = /^mgmt(Health|Night|PayReady|AvailAll|Performance|TeacherCard|Peer|Hours|Trials|Reports|PayChecks|Active|Renewals|Overview|Schedule|Teacher|Student|StuClasses)$/;\nconst SB_UIAGE = { mgmtStudent: 7 * 864e5, tStudent: 7 * 864e5, mgmtStuClasses: 864e5, tStuClasses: 864e5 };"],
["if(!d || age(d) > 6 * 3600e3) return rp;",
 "if(!d || age(d) > (SB_UIAGE[fn] || 6 * 3600e3)) return rp;"],
]);
