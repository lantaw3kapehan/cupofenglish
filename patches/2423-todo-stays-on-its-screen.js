// 2423 · fix for 2421 (Misty 19 Nov 14:10: "why is the To do showing in Trials screen?"): the fixed-order rule forced
//   #v-mtoday to display, so To do showed under every screen. Now it only applies while To do is the open screen.
const file = process.argv[2];
require('../tools/lib.js')(file, [['#v-mtoday{display:flex!important;flex-direction:column}', '#v-mtoday:not(.hide){display:flex!important;flex-direction:column}']]);
