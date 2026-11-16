// 2266 (Misty 16 Nov 17:22 "these unit videos for RE can't be opened"): the 2035 guard that keeps teachers out of class-recording
// videos also caught course-book videos (their links start with ▶), and showed "class videos are kept by CupOfEnglish".
// Links inside the Books screens (book sheet, student's Course book card, Books library, class-card book link) now always open.
const lib = require("../tools/lib.js"), file = process.argv[2];
lib(file, [["  if(/watch|training|coach|peer|review|recording/i.test(t) || (typeof PRF",
  "  if(a.closest('#bkBody, #stuBk, #v-books') || a.classList.contains('bkb')) return;   /* 2266: course-book videos always open */\n  if(/watch|training|coach|peer|review|recording/i.test(t) || (typeof PRF"]]);
