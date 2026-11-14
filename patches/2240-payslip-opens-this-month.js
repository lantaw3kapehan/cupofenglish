// 2240 (Misty, 14 Nov): the Payslip opened on October although October pay is all paid (10 Nov).
// Once every teacher is paid for the last pay month, the Payslip opens on this month (November so far).
// While someone is still unpaid for that month, it still opens on that month (as before). October stays one tap away in Pay period.
const lib = require("../tools/lib.js"), file = process.argv[2];
lib(file, [[
 "per = periods(), def = (MO && MO.payMonth ? MO.payMonth.replace(' ',SL2) : per[1]);",
 "per = periods(), pr2240 = (MO && MO.payroll) || [], def = (MO && MO.payMonth && !(pr2240.length && pr2240.every(p => p.paid)) ? MO.payMonth.replace(' ',SL2) : (MO && MO.payMonth ? per[0] : per[1]));"
]]);
// · Also (Misty): a generation date and time under the Ref. No., like the payment confirmation:
//   "Generated 14 November 2026, 16:56 (Philippine time)". The footer line stays.
lib(file, [[
 "<b>Ref. No. PS-' + String(S.month).replace('-', '') + '-' + esc(p.code || '') + '</b></div>'",
 "<b>Ref. No. PS-' + String(S.month).replace('-', '') + '-' + esc(p.code || '') + '</b></div><div class=\"m\" style=\"text-align:right;margin-top:4px\">Generated ' + (function(d){ var o = { timeZone: 'Asia/Manila' }; return d.toLocaleDateString('en-GB', Object.assign({ day: 'numeric', month: 'long', year: 'numeric' }, o)) + ', ' + d.toLocaleTimeString('en-GB', Object.assign({ hour: '2-digit', minute: '2-digit', hour12: false }, o)); })(new Date()) + ' (Philippine time)</div>'"
]]);
