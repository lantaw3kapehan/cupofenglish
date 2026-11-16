// 2281 (Misty 16 Nov 19:45): Lehan's report still showed A1 — the app had kept the PDF it made at 19:35 (before the CEFR fix).
// The saved-report key changes (v7), so every trial report is made again with the right level and starting point.
const lib = require("../tools/lib.js"), file = process.argv[2];
lib(file, [
 ["(t.commZh ? 1 : 0) + '|' + (extra || '') + '|v6';", "(t.commZh ? 1 : 0) + '|' + (extra || '') + '|v7';"],
]);
