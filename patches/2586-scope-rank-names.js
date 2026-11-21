// 2586 (audit QA-16/17, verified 21 Nov): counts named their population loosely ("13 of 14 teachers teaching", "All 13", "12 teachers"),
// and Training called the Newly Hired rank "First week" (Rose, hired 4 Oct). Each count now says who it counts; Training uses the formal
// rank names, the same as Teachers and Payroll.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["<small style=\"font-size:13px;color:#6C6786\"> of ' + T.length + '</small></b><span>teachers teaching</span></div>' +\n        '<div><b style=\"color:' + cc + '\">' + c + '%</b><span>classes completed</span></div>",
   "<small style=\"font-size:13px;color:#6C6786\"> of ' + T.length + '</small></b><span title=\"Teachers on the team list with at least one class this month, of all teachers on the list\">teachers with classes this month</span></div>' +\n        '<div><b style=\"color:' + cc + '\">' + c + '%</b><span title=\"Classes held ÷ classes booked up to now this month · cancellations by anyone count\">classes held (calendar)</span></div>"],
  ["const RS = { 'Newly Hired': 'First week', 'Starting Teacher': 'Starting', 'Newly Qualified': 'Newly Qualified', 'Junior Teacher': 'Junior', 'Senior Teacher': 'Senior', 'Master Teacher': 'Master' };",
   "const RS = { 'Newly Hired': 'Newly Hired', 'Starting Teacher': 'Starting Teacher', 'Newly Qualified': 'Newly Qualified', 'Junior Teacher': 'Junior Teacher', 'Senior Teacher': 'Senior Teacher', 'Master Teacher': 'Master Teacher' };   /* 2586: formal rank names, as on Teachers and Payroll */"],
  ["<b>Team ladder</b><span>' + T.filter(x => x.ix >= 0).length + ' teachers · tap a name for their path</span>",
   "<b>Team ladder</b><span>' + T.filter(x => x.ix >= 0).length + ' teachers on the rank ladder (fixed-rate teachers are listed separately) · tap a name for their path</span>"],
  ["onclick=\"pfSet('all')\">All · ${T.length}</button>", "onclick=\"pfSet('all')\" title=\"Teachers with a QA or class record on Performance\">All teachers with records · ${T.length}</button>"],
]);
