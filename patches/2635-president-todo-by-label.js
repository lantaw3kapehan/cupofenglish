// 2635 (Misty 21 Nov 16:28 "highest priority to lowest"): the President's To do follows the same labels as Celine's:
// For your decision, then Critical, Urgent, Today, Routine.
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const B = '</style>\n<script id="b2632">';
if(s.split(B).length !== 2){ console.error('s2632 end'); process.exit(1); }
s = s.replace(B, "body.pres2630 #app #v-mtoday > :is(#o91fix,.o91fix){order:5!important}body.pres2630 #app #v-mtoday > :is(#td-renew,.td-renew){order:10!important}body.pres2630 #app #v-mtoday > :is(#td-reports,.td-reports){order:10!important}body.pres2630 #app #v-mtoday > :is(#enqTd,.enqTd){order:10!important}body.pres2630 #app #v-mtoday > :is(#td-follow,.td-follow){order:15!important}body.pres2630 #app #v-mtoday > :is(#td-celebrate,.td-celebrate){order:15!important}body.pres2630 #app #v-mtoday > :is(#wa2609,.wa2609){order:15!important}body.pres2630 #app #v-mtoday > :is(#vid1882,.vid1882){order:15!important}body.pres2630 #app #v-mtoday > :is(#sr2320,.sr2320){order:15!important}body.pres2630 #app #v-mtoday > :is(#vr2609,.vr2609){order:20!important}body.pres2630 #app #v-mtoday > :is(#fm2484,.fm2484){order:20!important}body.pres2630 #app #v-mtoday > :is(#bf2547,.bf2547){order:20!important}" + "\n" + B);
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
