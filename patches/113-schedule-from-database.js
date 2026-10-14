// 14 Oct night · Schedule: tomorrow and every later day (up to 6 weeks) are worked out by the database from the class table
// (checked against Google for 9 days: every class identical). Today and earlier days still keep Google's check-ins and
// videos, so they work as before. A calendar change reaches the class table within about a minute.
require('../tools/lib.js')(process.argv[2], [
["const SB_LIVE = /^(mgmt(Active|Students|Student|StuClasses)|tStudent)$/;",
 "const SB_LIVE = /^(mgmt(Active|Students|Student|StuClasses|Schedule)|tStudent)$/;"],
]);
