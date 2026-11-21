// 2590 (audit QA-27 follow-up): one more "her" in the walk-in assessment ("Shows in her student portal once linked").
const file = process.argv[2];
require('../tools/lib.js')(file, [["Shows in her student portal once linked", "Shows in the student portal once linked"]]);
