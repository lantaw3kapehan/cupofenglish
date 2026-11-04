// 1750: (Misty 4 Nov 16:45 "Ensure it's a Service Compensation Record … since our teachers are Independent Provider") the payslip reads
//   as a Service Compensation Record like the old one: "Service Compensation Record" on the left and the Ref. No. on the right under the
//   title; Service Role; Engagement Date; for lesson-based teachers "Engagement Status: Independent Service Provider" and
//   "Service Arrangement: Lesson-Based / Flexible Schedule" (staff on a base keep their own status); "net service compensation".
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["<div class=\"m\">CupOfEnglish · Service Compensation Record · Ref. No. PS-' + String(S.month).replace('-', '') + '-' + esc(p.code || '') + '</div></div>'",
   "</div><div style=\"display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;margin-top:10px;padding:8px 0;border-top:1px solid #E7E5EE;border-bottom:1px solid #E7E5EE\"><b>Service Compensation Record</b><b>Ref. No. PS-' + String(S.month).replace('-', '') + '-' + esc(p.code || '') + '</b></div>'"],
  ["<td><b>' + esc(p.full || p.name) + '</b><div class=\"m\">' + esc(p.position || '') + (p.employment ? ' · ' + esc(p.employment) : '') + (p.start ? '<br>Engagement date: ' + esc(longDay(p.start)) + (tenure ? ' (' + tenure + ')' : '') : '') + '</div></td>'",
   "<td><b>' + esc(p.full || p.name) + '</b><div class=\"m\">' + (p.position ? 'Service Role: ' + esc(p.position) : '') + (p.start ? '<br>Engagement Date: ' + esc(longDay(p.start)) + (tenure ? ' (' + tenure + ')' : '') : '')"
   + " + ((+r.base > 0 && !(+r.reg > 0)) ? (p.employment ? '<br>Engagement Status: ' + esc(p.employment) : '') : '<br>Engagement Status: Independent Service Provider<br>Service Arrangement: Lesson-Based / Flexible Schedule') + '</div></td>'"],
  ["resulting in net compensation payable of <b>", "resulting in net service compensation payable of <b>"],
  ["(ded.length || less.length ? '' : row('None', '', pz(0)))", "(ded.length || less.length || (+r.deduct || 0) ? '' : row('None', '', pz(0)))"],
]);
