// 2662: teachers' class reminders (tReminders) also come from the database first (April: 3 × ~12 s through Google this morning).
const fs = require('fs'); const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["const FRESH2660 = /^(getBootstrap|tMyVisits|tMyComments|tLeave|tFbStatus|mgmtMonDay|mgmtPayroll|mgmtLeave|mgmtActions)$/;", "const FRESH2660 = /^(getBootstrap|tMyVisits|tMyComments|tLeave|tFbStatus|tReminders|mgmtMonDay|mgmtLeave|mgmtActions)$/;"],
  ["var F = /^(getBootstrap|tMyVisits|tMyComments|tLeave|tFbStatus|mgmtMonDay|mgmtPayroll|mgmtLeave|mgmtActions)$/, FAIL = {};", "var F = /^(getBootstrap|tMyVisits|tMyComments|tLeave|tFbStatus|tReminders|mgmtMonDay|mgmtLeave|mgmtActions)$/, FAIL = {};"],
]);
