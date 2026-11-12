// 2116 (12 Nov 13:42, Misty: Zane & Apple "59 + 6.5 = 65.5 + 2 incentive = 67.5 total · 55 used · 12.5 remaining"; of the 33 enrolled only 6.5 was left, then 59 were transferred in: 6.5 + 59 + 2 = 67.5).
// The package keeps "Lessons enrolled 33"; the database leaves the 33 out of what is left (coe_packages.avail_adj = −33, so 12.5 left).
// The shared lesson summary now says so instead of adding 33 on top: "67.5 (6.5 left of the 33 enrolled + 59 transferred + 2 free)".
// It is only used when the lessons left from the database match "total without the enrolled lessons", so other packages are unchanged.
const lib = require("../tools/lib.js"), file = process.argv[2];
lib(file, [
  ["tot = n1(enrolled + carry + trf + inc + rt1974), done", "tot0 = n1(enrolled + carry + trf + inc + rt1974), done"],
  ["left = shLeft(G, C);   /* 14 Oct: total includes carried / transferred / free */",
   "left = shLeft(G, C);   /* 14 Oct: total includes carried / transferred / free */\nconst in2116 = enrolled > 0 && trf >= enrolled && Math.abs(tot0 - enrolled - done - left) < 0.05 && Math.abs(tot0 - done - left) >= 0.05, tot = in2116 ? n1(tot0 - enrolled) : tot0;   /* 2116: the enrolled lessons are inside the transferred ones */"],
  ["const totX = (carry || trf || inc || rt1974) ? ' ('",
   "const totX = in2116 ? ' (' + (carry ? carry + ' left of the ' + enrolled + ' enrolled + ' : '') + trf + ' transferred' + (inc ? ' + ' + inc + ' free' : '') + ')' : (carry || trf || inc || rt1974) ? ' ('"],
]);
