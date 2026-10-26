// 1144: management Performance teacher rows: the number under the "Progress checks" column counts progress checks done this
//      month (t.feedback, as found in 1109), but the cell still said "feedback written". It now says "progress checks".
require('../tools/lib.js')(process.argv[2], [
  ["<span>feedback written · ${esc(String(PF.month || '').slice(0, 3))} so far</span>",
   "<span>progress checks · ${esc(String(PF.month || '').slice(0, 3))} so far</span>"]]);
