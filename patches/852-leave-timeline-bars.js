// 852: (audit 25 Oct, finding 5 · Leave) "Team leave · next 6 weeks": bars were wider than their days.
// Cause: each bar had 6 px padding on both sides on top of its width (content-box), so every bar was 12 px too wide.
// On a phone (about 4.6 px per day) a 1-day leave covered about 3.6 days and ran into the next leave; a 2-day leave looked like 4–5.
// Changes (display only):
// · bars are exactly their days wide (padding counted inside the width; the label keeps a small left gap);
// · each day gets at least 9 px; on a narrow screen the 6 weeks scroll sideways inside the card, with names pinned on the left.
// Dates, statuses, overlap marks and the leave data are unchanged.
require('../tools/lib.js')(process.argv[2], [
  ["#v-leave .lc55 .bar{position:absolute;top:3px;bottom:3px;border-radius:5px;cursor:pointer;font-size:10.5px;color:#fff;font-weight:700;padding:0 6px;",
   "#v-leave .lc55 .bar{position:absolute;top:3px;bottom:3px;border-radius:5px;cursor:pointer;font-size:10.5px;color:#fff;font-weight:700;padding:0 0 0 4px;box-sizing:border-box;"],
  ["#v-leave .lc55 .lg{display:flex",
   "#v-leave .lc55 .sx{overflow-x:auto;-webkit-overflow-scrolling:touch}\n" +
   "#v-leave .lc55 .sx>.g{min-width:525px}\n" +
   "#v-leave .lc55 .sx .g>span{position:sticky;left:0;z-index:3;background:#fff}\n" +
   "#v-leave .lc55 .lg{display:flex"],
  ["(names.length ? '<div class=\"g\"><span></span><div class=\"ov\">'",
   "(names.length ? '<div class=\"sx\"><div class=\"g\"><span></span><div class=\"ov\">'"],
  ["'<span></span><div class=\"ax\">' + ax + '</div></div>' : '<div class=\"small mute\">Nobody is on leave",
   "'<span></span><div class=\"ax\">' + ax + '</div></div></div>' : '<div class=\"small mute\">Nobody is on leave"],
]);
