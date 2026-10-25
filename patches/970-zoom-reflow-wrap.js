// 970 (QA-A · accessibility, zoom 200%): two lines that could not wrap were cut or ran into the next column at 200% zoom
// (640 CSS px, the phone layout a 1280 laptop gets at 200%), found by the scripted zoom check (audit/qa-a/zoom/):
// · Teachers › teacher cards: the rank line "Senior Teacher · ₱180" is a flex box with white-space:nowrap, so its
//   text-overflow:ellipsis never applied — the rate was cut to "₱18" with no "…", which reads as a wrong amount.
//   Now the line may wrap under the name (it only wraps when it does not fit; at 1280 nothing changes).
// · Finance › Payroll › Payroll history: "18 teachers · 19 rows" (month line, nowrap) ran under the ▲/▼ change and
//   the month total. The month's text may now wrap inside its own column.
// CSS only, scoped to those two elements. Amounts, rows, clicks unchanged.
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const i = s.lastIndexOf('</body>');
s = s.slice(0, i) + String.raw`<style id="s970">
/* 970 · zoom/reflow: let these two lines wrap instead of being cut */
.tc2 .tc2-rk{white-space:normal!important;overflow:visible!important;line-height:1.3}
#v-payroll details.py-h>summary>div:first-child{white-space:normal!important;min-width:0}
</style>
` + s.slice(i);
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
