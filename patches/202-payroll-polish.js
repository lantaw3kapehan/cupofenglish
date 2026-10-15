// 15 Oct night · Payroll polish: units shown once (under the name), the rate only when it is one rate for the month,
// history rows with the amount lined up on the right.
require('../tools/lib.js')(process.argv[2], [
[".py-row{display:grid;grid-template-columns:44px minmax(0,1.4fr) 70px 120px minmax(0,1.6fr) 150px;", ".py-row{display:grid;grid-template-columns:44px minmax(0,1.4fr) 120px minmax(0,1.6fr) 150px;"],
["      <span class=\"py-u\">${x.units} u</span><span class=\"py-net\">${peso(x.net)}</span>", "      <span class=\"py-net\">${peso(x.net)}</span>"],
["<small>${x.units} unit${x.units === 1 ? '' : 's'}${x.rate ? ' × ' + peso(x.rate) : ''}</small>", "<small>${x.units} unit${x.units === 1 ? '' : 's'}${x.rate && Math.abs(x.units * x.rate - (x.lessonPay || 0)) < 1 ? ' × ' + peso(x.rate) : ''}</small>"],
[".py-h td.r{text-align:right}", ".py-h td{width:auto} .py-h td:first-child{width:55%} .py-h td.r{text-align:right;white-space:nowrap}"],
]);
