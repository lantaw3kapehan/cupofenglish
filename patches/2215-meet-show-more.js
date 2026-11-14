// 2215: the meeting-ID list's toggle says "Show 16 more" (it already shows 6), not "Show all 22".
const lib = require("../tools/lib.js"), file = process.argv[2];
lib(file, [["'<details><summary>Show all ' + n + '</summary>'", "'<details><summary>Show ' + (n - 6) + ' more</summary>'"]]);
