// 2592 (audit QA-19/20, 21 Nov): on phones the "Not acting on feedback" names could run into "4 teachers"; the notice filters and the
// Schedule view switch (List · Timeline · Month · Open slots) were cut off at the right edge with a hidden sideways scroll.
// Now: the names get their own line under the title with the count and arrow kept apart; filters and the view switch wrap onto a second
// line instead of hiding. CSS only, no other change.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["<style id=\"css1592\">",
   "<style id=\"s2592\">\n@media(max-width:620px){\n  #v-msgs details.ft22>summary{flex-wrap:wrap;row-gap:8px}\n  #v-msgs details.ft22>summary .who{order:3;flex:1 1 100%;min-width:0}\n  #v-msgs details.ft22>summary em{margin-left:auto}\n  #v-msgs .tb22{flex-wrap:wrap!important;overflow-x:visible!important}\n  #v-schedule .vw03>div{flex-wrap:wrap;max-width:100%}\n  #v-schedule .vw03>div>button{padding:8px 11px!important}\n  #v-schedule .vw03>span:last-child{flex-basis:100%}\n}\n</style>\n<style id=\"css1592\">"],
]);
