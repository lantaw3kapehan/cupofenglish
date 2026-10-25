// 870: Overview › Student flow (audit #7). The number on each month was labelled "net growth" but it is new + renewals − stopped.
//      A renewal is a student who was already counted, so that number is package activity, not a change in students.
// · Formula unchanged (still fresh + ren − stop on the bars and in the month sheet). Only the labels change, plus:
// · a one-line definition under the chart, and a separate, clearly labelled line "Change in students (new − stopped)" per month,
//   worked out from the same two counts already loaded (OPS.months[].fresh / .stop, coe-trials ops).
// · Month sheet (tap a month): "net N" → "package activity (new + renewals − stopped) N · change in students (new − stopped) M".
// (generated: each pair is [exact text in app.html, replacement]; JSON strings)
const fs = require('fs'), file = process.argv[2];
require('../tools/lib.js')(file, [
  ["<span>number = net growth</span></div></div></section>'; }",
   "<span>number = new + renewals − stopped</span></div><div style=\"font-size:12px;color:#6F6B85;line-height:1.45;margin-top:6px\">The number above each month is <b>package activity</b>: new students + renewals − stopped. A renewal is a student who was already counted, so it is not the change in student numbers.<br><b>Change in students (new − stopped):</b> ' + S.map((x, i) => { const d = x.fresh - x.stop; return mo(x.m) + (i === S.length - 1 ? '*' : '') + ' ' + (d > 0 ? '+' + d : d < 0 ? '−' + Math.abs(d) : '0'); }).join(' · ') + '</div></div></section>'; }"],
  ["' · new ' + x.fresh + ' · renewed ' + x.ren + ' · stopped ' + x.stop + '\">' +",
   "' · new ' + x.fresh + ' · renewed ' + x.ren + ' · stopped ' + x.stop + ' · package activity ' + net + ' · change in students ' + (x.fresh - x.stop) + '\">' +"],
  ["' · net ' + (m.fresh + m.ren - m.stop) + '</div>'",
   "' · package activity (new + renewals − stopped) ' + (m.fresh + m.ren - m.stop) + ' · change in students (new − stopped) ' + (m.fresh - m.stop) + '</div>'"]
]);
