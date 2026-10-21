// 21 Oct · Two small fixes from Misty.
//  · Students (management): the filter row (Active · 5 or fewer left · Renewed · New · No agreement · No check · Finished · Shared)
//    was one row with a hidden scrollbar, so the last filter was cut off ("Finished"). It wraps onto a second line now.
//  · To do › "Do next": the numbers 1–5 are the order to do things in; the line now says so ("in this order").
require('../tools/lib.js')(process.argv[2], [
["#v-astudents>div>.seg,#v-astudents .seg{flex-wrap:nowrap!important;overflow-x:auto;padding-bottom:2px!important;scrollbar-width:none}",
 "#v-astudents>div>.seg,#v-astudents .seg{flex-wrap:wrap!important;overflow:visible!important;padding-bottom:2px!important;scrollbar-width:none;row-gap:6px}   /* 525: wraps, nothing cut off */"],
["if(h2) h2.innerHTML = `Do next <span class=\"c\">${src.length} thing${src.length === 1 ? '' : 's'} · act right here, or tap a line to see the details</span>`;",
 "if(h2) h2.innerHTML = `Do next <span class=\"c\">in this order · ${src.length} thing${src.length === 1 ? '' : 's'} · act right here, or tap a line for details</span>`;"]
]);
