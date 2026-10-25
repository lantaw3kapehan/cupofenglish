// 913: (lead, 25 Oct — MUST fix) Schedule overflowed sideways on phones: document scrollWidth 427 px at 360 and 390 px wide.
// Cause: in a class row the validity note `.vn.vn-row` ("Validity ended 28 Apr · 180 days past · lessons left") and the status
// chips (e.g. "🔔 Early reminder · Danira 13:01") are `white-space:nowrap`; their TEXT ran past the row (the element boxes
// themselves stayed inside, so only the text ink widened the page). Found by hiding children one by one until scrollWidth
// dropped: #v-schedule › div › .cls[classEdit(29)] › .grow › .vn-row (scrollWidth 307 in a 234-px column).
// Also Time-ins > "Management hours" (when opened): its day chart `.hr15 .p` is 380 px wide and pushed the page to 415 px.
// Fix (display only): inside Schedule class rows these notes and chips may wrap and never exceed the row width; long teacher /
// student lines keep their ellipsis. Wording and data unchanged.
require('../tools/lib.js')(process.argv[2], [
  ["#v-team .tl11 .sx>div{min-width:var(--mw,0)}",
   "#v-team .tl11 .sx>div{min-width:var(--mw,0)}\n" +
   "#v-schedule .cls .grow{min-width:0}\n" +
   "#v-schedule .cls .grow .vn-row,#v-schedule .cls .grow .chip,#v-schedule .cls .grow .cxbtn{white-space:normal;max-width:100%;box-sizing:border-box;overflow-wrap:anywhere}   /* 913: no sideways scroll on phones */\n" +
   "#v-schedule .cls .grow .chip{border-radius:10px}\n" +
   "#v-team details.tgrp .hr15{max-width:100%;overflow-x:auto;-webkit-overflow-scrolling:touch}   /* 913: Management hours chart scrolls inside its card */"],
]);
