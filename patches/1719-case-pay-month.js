// 1719: (Misty, 3 Nov 13:41) "for perfect attendance incentive of OCTOBER, if we lodge today, will it go to their october pay? there's no for which month"
//   PAYROLL counts a case's incentive / deduction in the month of the case date, and a new case was always dated "now".
//   New case now has "For pay month": this month (default) or, until the 10th, last month. Last month dates the case on that month's
//   last day (Google addCase_, PAYMONTH1103, Version 455) and adds "for October 2026 pay (lodged 3 Nov)" to Action taken.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["<label>Student (optional)</label><input id=\"cSt\" class=\"in-t\" placeholder=\"Weiwei ST-2026-118\">\n<div class=\"row\" style=\"gap:10px\"><div class=\"grow\"><label>Source</label>",
   "<label>Student (optional)</label><input id=\"cSt\" class=\"in-t\" placeholder=\"Weiwei ST-2026-118\">\n${(function(){ const d = new Date(), ym = x => x.getFullYear() + '-' + String(x.getMonth() + 1).padStart(2, '0'), lb = x => x.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }), p = new Date(d.getFullYear(), d.getMonth() - 1, 15);\n  return '<label>For pay month</label><select id=\"cPM\" class=\"in-t\"><option value=\"' + ym(d) + '\">' + lb(d) + ' (this month)</option>' + (d.getDate() <= 10 ? '<option value=\"' + ym(p) + '\">' + lb(p) + ' · counts in ' + lb(p).split(' ')[0] + ' pay (until the 10th)</option>' : '') + '</select><div class=\"small mute\" style=\"margin-top:4px\">Incentives and deductions are paid in the month of the case date. Last month dates the case on its last day.</div>'; })()}\n<div class=\"row\" style=\"gap:10px\"><div class=\"grow\"><label>Source</label>"],
  ["demerit:v('cD'),incentive:v('cI'),amount:v('cA'),action:v('cX'),done:$('cDone').checked};",
   "demerit:v('cD'),incentive:v('cI'),amount:v('cA'),action:v('cX'),done:$('cDone').checked,payMonth:v('cPM')};"],
  ["const ids = { cS: f.subject, cE: f.employee, cT: f.type, cSt: f.student, cSo: f.source, cC: f.condition, cSt2: f.status, cTi: f.tier, cD: f.demerit, cI: f.incentive, cA: f.amount, cX: f.action };",
   "const ids = { cS: f.subject, cE: f.employee, cT: f.type, cSt: f.student, cSo: f.source, cC: f.condition, cSt2: f.status, cTi: f.tier, cD: f.demerit, cI: f.incentive, cA: f.amount, cX: f.action, cPM: f.payMonth };"]
]);
