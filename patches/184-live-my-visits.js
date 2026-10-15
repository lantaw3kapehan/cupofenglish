// 15 Oct · Teachers' "My QA visits" straight from the database (checked identical to Google; BUDGET6 makes "Seen"
// work on a visit newer than Google's last copy). Google stays the fallback.
require('../tools/lib.js')(process.argv[2], [
["t(Student|Schedule|FbStatus|HwHist|Reminders|Goals|Leave)|getBootstrap)$/;", "t(Student|Schedule|FbStatus|HwHist|Reminders|Goals|Leave|MyVisits)|getBootstrap)$/;"],
]);
