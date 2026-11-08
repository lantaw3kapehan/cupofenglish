// 1912: (Misty 8 Nov 14:56 "conduct a comprehensive QA … screen to screen … fix it right away")
//   Schedule: the section label said "Today" even when another day was open (e.g. Thu 5 Nov) → it now names the open day.
//   Finance › Payroll: "1 teachers, all checks done" → "1 teacher, all checks done".
const lib = require('../tools/lib.js'), file = process.argv[2];
lib(file, [
  ["sum.insertAdjacentHTML('beforebegin', '<div class=\"lb20\">Today</div>');",
   "sum.insertAdjacentHTML('beforebegin', '<div class=\"lb20\">' + (typeof SC_OFF !== 'undefined' && SC_OFF ? new Date(Date.now() + SC_OFF * 864e5).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'Asia/Manila' }) : 'Today') + '</div>');"],
  ["RD.length + ' teachers, all checks done'",
   "RD.length + (RD.length === 1 ? ' teacher' : ' teachers') + ', all checks done'"],
]);
