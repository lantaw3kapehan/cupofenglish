// 2114 (12 Nov 13:25, Misty: Anna's email still shows "348699202@qq.co" on the student card).
// 1597 keeps each line of the student card header on one row on a laptop (flex-wrap:nowrap, overflow hidden), so the email at the end
// of the second line was cut off when the line was full (2112 only stopped it shrinking). Now the second line may wrap: the email moves
// down whole onto its own line when it does not fit, and is never cut. The first line (code, age, city) is unchanged.
const lib = require("../tools/lib.js"), file = process.argv[2];
lib(file, [
  ['<script id="t2060">', '<style id="d2114">\n/* 2114: the parent email on the student card is never cut: the second header line wraps, the email moves down whole */\n@media(min-width:621px){#sheet #sheetBody.stu2 .shero.h1589 .grow>.h-learn:not(#z1597):not(#z2114){flex-wrap:wrap!important}#sheet #sheetBody.stu2 .shero.h1589 .grow>.h-learn:not(#z1597):not(#z2114)>.em-chip{flex:none!important;overflow:visible!important;text-overflow:clip!important;max-width:none!important}}\n</style>\n<script id="t2060">'],
]);
