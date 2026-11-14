// 2237: 2235 follow-up. The due date arrives as "November 15" (full month), so it now turns into "15 November" too.
const lib = require("../tools/lib.js"), file = process.argv[2];
lib(file, [
 ["'Due ' + String(x.govDue || '').replace(/^([A-Z][a-z]{2}) (\\d{1,2})$/, '$2 $1')", "'Due ' + String(x.govDue || '').replace(/^([A-Z][a-z]+) (\\d{1,2})$/, '$2 $1')"],
 ["(x.govDue ? String(x.govDue).replace(/^([A-Z][a-z]{2}) (\\d{1,2})$/, '$2 $1') : 'the 15th')", "(x.govDue ? String(x.govDue).replace(/^([A-Z][a-z]+) (\\d{1,2})$/, '$2 $1') : 'the 15th')"]
]);
