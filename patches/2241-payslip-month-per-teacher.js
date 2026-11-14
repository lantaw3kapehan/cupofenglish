// 2241: 2240 decided the Payslip month for everyone at once (all paid → this month). Now it is per teacher:
// the teacher's last-month pay is marked paid → the Payslip opens on this month; not paid yet → it opens on last month (the one to pay).
// Opened with no teacher picked: this month once everyone is paid, as 2240.
const lib = require("../tools/lib.js"), file = process.argv[2];
lib(file, [[
 "def = (MO && MO.payMonth && !(pr2240.length && pr2240.every(p => p.paid)) ? MO.payMonth.replace(' ',SL2) : (MO && MO.payMonth ? per[0] : per[1]));",
 "mr2241 = me ? pr2240.find(p => String(p.name || '').toLowerCase() === me.name.toLowerCase() || (p.code && p.code === me.code)) : null, done2241 = mr2241 ? !!mr2241.paid : (pr2240.length && pr2240.every(p => p.paid)), def = (MO && MO.payMonth && !done2241 ? MO.payMonth.replace(' ',SL2) : (MO && MO.payMonth ? per[0] : per[1]));"
]]);
