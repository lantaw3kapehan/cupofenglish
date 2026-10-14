// 14 Oct · CEFR journey (Misty): under each step the newest date is on top (e.g. Sept 2026 Renewed above Dec 2023 Start),
// on the student page and on the picture to send.
require('../tools/lib.js')(process.argv[2], [
["function cjHtml(S){ try{",
 "function cjNewest(a, b){ return String(b.d || '').localeCompare(String(a.d || '')); }   /* newest first, undated last */\nfunction cjHtml(S){ try{"],
["T.filter(x => at(x) === k).map(x => '<i>'",
 "T.filter(x => at(x) === k).sort(cjNewest).map(x => '<i>'"],
["J.T.filter(x => (/^Trial/.test(x.en) && st ? J.mk(st.i) : J.mk(x.i)) === k).forEach(",
 "J.T.filter(x => (/^Trial/.test(x.en) && st ? J.mk(st.i) : J.mk(x.i)) === k).sort(cjNewest).forEach("],
]);
