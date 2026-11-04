// 1766: (Misty 4 Nov 21:00 "OK") the teacher's Pay screen shows a rank-up month as "₱150 → ₱155" and the units at each rate
//   (6.5 × ₱150, 14 × ₱155 for Christian, October) so it matches the lesson pay. Data: coe_tpay `parts` (coe_rank_tl).
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ['x.units}</td><td class="num">${peso(x.rate)}</td>',
   'x.units}</td><td class="num">${x.parts && x.parts.length > 1 ? x.parts.map(q => peso(q.rate)).join(\' → \') : peso(x.rate)}</td>'],
  ["const L = [['Units', x.units + ' × ' + peso(x.rate)]",
   "const L = [['Units', x.parts && x.parts.length > 1 ? x.parts.map(q => q.units + ' × ' + peso(q.rate)).join(' + ') : x.units + ' × ' + peso(x.rate)]"],
  ['<tr><td>Units</td><td class="num">${x.units} × ${peso(x.rate)}</td></tr><tr><td>Lesson pay</td>',
   '${(x.parts && x.parts.length > 1 ? x.parts : [{ units: x.units, rate: x.rate }]).map(q => `<tr><td>Units${x.parts && x.parts.length > 1 ? \' at \' + peso(q.rate) : \'\'}</td><td class="num">${q.units} × ${peso(q.rate)}</td></tr>`).join(\'\')}<tr><td>Lesson pay</td>'],
]);
