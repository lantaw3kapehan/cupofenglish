// 2631: the 2630 order lost to older rules such as "#v-home:has(> #pd2360) #be2501{order:2!important}" (three ids). The President's
// rules now go through #app as well (three ids plus a class), so they win. Misty 16:31: "Behind · teachers to nudge" is not on her Overview.
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const a = s.indexOf('<style id="s2630">'), b = s.indexOf('</style>', a); if(a < 0 || b < a){ console.error('marker'); process.exit(1); }
let seg = s.slice(a, b); const n1 = seg.split('body.pres2630 #v-home').length - 1, n2 = seg.split('body.pres2630 #v-mtoday').length - 1;
if(!n1 || !n2){ console.error('selectors'); process.exit(1); }
seg = seg.split('body.pres2630 #v-home').join('body.pres2630 #app #v-home').split('body.pres2630 #v-mtoday').join('body.pres2630 #app #v-mtoday');
seg += 'body.pres2630 #app #v-home #be2501{display:none!important}\n';
fs.writeFileSync(file, s.slice(0, a) + seg + s.slice(b));
console.log('2631: ' + n1 + ' + ' + n2 + ' selectors');
require('../tools/lib.js')(file, []);
