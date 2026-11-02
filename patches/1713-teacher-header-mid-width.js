// 1713: (QA 2 Nov, seen as Teacher Kat; Misty: "fix the problem that you see") teacher header on a mid-width window (521–900 px,
//   e.g. a laptop window shared with another app). The "Time in opens …" chip and the two buttons left the name only ~90 px, so
//   "Teacher Kat" broke over two lines, her rank over four, and "November so far" was cut off (header 146 px tall).
//   · Now the name stays on one line, the rank reads in full, and the time-in chip moves to its own row under them.
//   · Phones (≤ 520 px) and wider laptops (> 900 px) are unchanged; management's header is unchanged.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["'.hd .iconbtn{flex:none;margin:0!important}' +\n    '}</style>');",
   "'.hd .iconbtn{flex:none;margin:0!important}' +\n    '}' +\n" +
   "    /* 1713 · teacher header 521–900 px: name on one line, rank in full, time-in chip on its own row */\n" +
   "    '@media(min-width:521px) and (max-width:900px){' +\n" +
   "    'body.role-t header .hd{flex-wrap:wrap;row-gap:6px}' +\n" +
   "    'body.role-t header .hd .who{min-width:0;flex:1 1 0!important}' +\n" +
   "    'body.role-t header .hd #hName{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +\n" +
   "    'body.role-t header .hd .iconbtn{order:2}' +\n" +
   "    'body.role-t header .hd .sp{order:3;flex:0 0 100%!important;height:0!important;display:block!important}' +\n" +
   "    'body.role-t header .hd #tinNag{order:4}' +\n" +
   "    '}</style>');"]
]);
