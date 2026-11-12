// 2130 (12 Nov audit): student page cards in plain words.
// · Lessons left picture: "from the ACTIVE tab … since the sheet’s last update" → "from the package … since the last update".
// · Class notice: "filled from ACTIVE and the calendar" → "filled from the package and the calendar".
// · Edit student: "saves into this row of DATABASE" → "saves to this student’s record"; "New row … at the top of DATABASE" → "New record".
// · Lesson summary: "Incentive 奖励: 0" no longer shows when there are no free lessons.
const lib = require("../tools/lib.js"), file = process.argv[2];
lib(file, [
  ["'from the ACTIVE tab' + (CXP.bal && CXP.bal.today ? ' + ' + CXP.bal.today + ' lesson(s) finished since the sheet’s last update' : '')", "'from the package' + (CXP.bal && CXP.bal.today ? ' + ' + CXP.bal.today + ' lesson(s) finished since the last update' : '')"],
  ["purchase date and cancellation policy · filled from ACTIVE and the calendar.'", "purchase date and cancellation policy · filled from the package and the calendar.'"],
  ["For the WeChat group when they enrol or renew · filled from ACTIVE and the calendar · change anything before copying.", "For the WeChat group when they enrol or renew · filled from the package and the calendar · change anything before copying."],
  ["esc(code)+' · saves into this row of DATABASE'", "esc(code)+' · saves to this student’s record'"],
  ["'New row for '+esc(code)+' at the top of DATABASE (e.g. trial → enrolled)'", "'New record for '+esc(code)+' (e.g. trial → enrolled)'"],
  ["incTx = !inc && incRaw !== '' && incRaw != null ? String(incRaw) : '';", "incTx = !inc && incRaw !== '' && incRaw != null && !/^\\s*0*(\\.0+)?\\s*$/.test(String(incRaw)) ? String(incRaw) : '';   /* 2130: not \"0\" */"],
]);
