// 2531 (final QA): Payroll · "1 teachers" → "1 teacher"; office staff (no lesson units, e.g. Celine) shows "office staff · daily rate", not "0 units".
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["<small>${x.units} unit${x.units === 1 ? '' : 's'}${x.rate && Math.abs(x.units * x.rate - (x.lessonPay || 0)) < 1 ? ' × ' + peso(x.rate) : ''}</small>",
   "<small>${!+x.units && !+(x.lessonPay || 0) ? 'office staff · daily rate' : x.units + ' unit' + (x.units === 1 ? '' : 's') + (x.rate && Math.abs(x.units * x.rate - (x.lessonPay || 0)) < 1 ? ' × ' + peso(x.rate) : '')}</small>"],
  ["'<div><span>Still to pay</span><b>' + peso(owed) + '</b><small>' + (owed ? (P.length - paid.length) + ' teachers' : 'nothing owed for ' + esc(pm)) + '</small></div>'];",
   "'<div><span>Still to pay</span><b>' + peso(owed) + '</b><small>' + (owed ? (P.length - paid.length) + ((P.length - paid.length) === 1 ? ' teacher' : ' teachers') : 'nothing owed for ' + esc(pm)) + '</small></div>'];"],
  ["'<div><span>Still to pay</span><b>' + peso(owed) + '</b><small>' + (owed ? '<span class=\"t824 no\">' + (P.length - paid.length) + ' teachers</span>' : 'all paid') + '</small></div>'];",
   "'<div><span>Still to pay</span><b>' + peso(owed) + '</b><small>' + (owed ? '<span class=\"t824 no\">' + (P.length - paid.length) + ((P.length - paid.length) === 1 ? ' teacher' : ' teachers') + '</span>' : 'all paid') + '</small></div>'];"]
]);
