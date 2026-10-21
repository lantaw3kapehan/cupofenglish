// 21 Oct · Teacher screens on phones: Growth no longer slides sideways, milestones as a list, chips in one scrolling row, student tabs on one row.
const inc = require('fs').readFileSync(require('path').join(__dirname, '511-teacher-phone-polish.inc'), 'utf8');
require('../tools/lib.js')(process.argv[2], [["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"]]);
// 511b · teal buttons (Time in, Turn on…) a shade deeper so the white text reads clearly (contrast 2.6 → about 4).
require('../tools/lib.js')(process.argv[2], [["  #sheetBody.stu2 .stu-tabs button svg{width:14px;height:14px}\n}`;",
"  #sheetBody.stu2 .stu-tabs button svg{width:14px;height:14px}\n}\nbody:not(.mgr) .btn.teal{background:linear-gradient(180deg,#079AA2,#007C85)!important}`;"]]);
