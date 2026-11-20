// 2541 (Misty 18:39 "why can't I click the November preview?"): the 2540 buttons and the "Showing … pay" line (830) both wanted the place
//   right under the Payroll title and kept moving each other (hundreds of times a second), so a click never landed. The buttons now sit
//   under the "Showing" line; "so far" view keeps that line visible.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["let seg = v.querySelector(':scope > #pm2540'); if(!seg){ seg = document.createElement('div'); seg.id = 'pm2540'; } if(seg.previousElementSibling !== top) top.after(seg);",
   "const anc = v.querySelector(':scope > .st830') || top;   /* 2541: below the Showing line, which keeps its own place under the title */\n      let seg = v.querySelector(':scope > #pm2540'); if(!seg){ seg = document.createElement('div'); seg.id = 'pm2540'; } if(seg.previousElementSibling !== anc) anc.after(seg);"],
  ["#v-payroll.nso2540 > :not(.py-top):not(.mo-tabs):not(#pm2540):not(#ns2540){display:none!important}",
   "#v-payroll.nso2540 > :not(.py-top):not(.mo-tabs):not(.st830):not(#pm2540):not(#ns2540){display:none!important}"]
]);
