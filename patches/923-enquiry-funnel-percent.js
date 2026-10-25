// 923 (D2 · Enquiries) — register item E1 "Enquiries funnel showed 150% on every tile".
// Investigated: the percentages cannot exceed 100%. Numerator and denominator come from the same list
// (localStorage 'coe.enq', written by enqLoad from mgmtEnqList): n = all logged; Reached trial / Enrolled / Not now are
// filters of that same list, so each is ≤ n. In the sample: Logged 2, Reached trial 1 (50%), Enrolled 1 (50%),
// Not now 1 (50%). What looked like "150%" is the tile's big number "1" printed right against the small "50%"
// (same line, no separator) — read together as "150%". Reproduced visually in audit/shots/before-1280-enquiry.png.
// Change (display only, counts and formula unchanged): each percentage says what it is a share of ("50% of logged")
// and sits on its own line under the number. The page title on the Enquiries tab said "New enquiry" (the name of the
// form) — now "Enquiries", matching the tab.
const fs = require('fs'), file = process.argv[2];
require('../tools/lib.js')(file, [
  ["pc(tb) + '% · ' + tbNow + ' at trial now'", "pc(tb) + '% of logged · ' + tbNow + ' at trial now'"],
  ["pc(en) + '%', 0", "pc(en) + '% of logged', 0"],
  ["pc(no) + '% · now'", "pc(no) + '% of logged · status now'"],
  ["<div class=\"lead\"><h1>New enquiry</h1>", "<div class=\"lead\"><h1>Enquiries</h1>"],
  ["#v-enquiry .fn31 .st small{font-size:12px;color:#8A86A0;margin-left:4px}",
   "#v-enquiry .fn31 .st small{display:block;font-size:12px;line-height:1.35;color:#6B6782;margin:2px 0 0}"]
]);
