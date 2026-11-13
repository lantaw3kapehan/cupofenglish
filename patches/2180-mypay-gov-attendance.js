// 2180 (13 Nov · Misty 20:04 "and her time-in record for her attendance … attendance history, the best workaround for her as Operations
// Coordinator"): (1) Celine's government contributions are paid by CupOfEnglish (not taken from her pay, from September 2026): My pay no
// longer shows them as a deduction ("deductions" only, and the line says "paid by CupOfEnglish, not taken from your pay"); the pace
// projection takes them off only for people who do pay them. (2) "My time-ins" on My pay: this month's days (time in, time out, hours,
// pay; "late" from coe_staff_lates, the same contract check the payslip uses; Wednesday = rest day), last month
// folded, and the last 6 months (days, hours, pay). Data: coe_mgmt_mypay → att / attMonths / govEmployer (database, coe_staff_day).
const lib = require("../tools/lib.js"), file = process.argv[2];
lib(file, [
  ['<div class="stat"><b class="num minus">−${peso((cur.deduct || p.monthDeduct || 0) + cur.gov)}</b><span>deductions + gov</span></div></div>',
   '<div class="stat"><b class="num minus">−${peso((cur.deduct || p.monthDeduct || 0) + (p.govEmployer ? 0 : cur.gov))}</b><span>${p.govEmployer ? \'deductions\' : \'deductions + gov\'}</span></div></div>'],
  ["Government contributions (SSS, Pag-IBIG, PhilHealth and BIR): ${peso(cur.gov)}${cur.deduct",
   "Government contributions (SSS, Pag-IBIG, PhilHealth and BIR): ${peso(cur.gov)}${p.govEmployer ? ', paid by CupOfEnglish and not taken from your pay' : ''}${cur.deduct"],
  ["num(cur.deduct) - num(cur.gov); pace(", "num(cur.deduct) - (MYP.govEmployer ? 0 : num(cur.gov)); pace("],
  ['h += `<h2>History</h2>` + (hist.length', 'h += (window.att2180 ? att2180(p) : \'\') + `<h2>History</h2>` + (hist.length'],
  ["</script>\n</body>\n</html>", `</script>
<style id="css2180">
.at80{background:#fff;border:1px solid var(--line,#ECEAF2);border-radius:16px;padding:14px 18px;margin-top:14px}
.at80 h3{margin:0 0 2px;font:600 18px Inter,sans-serif;color:#2B2253}.at80 .sub{font-size:14px;color:#5E5A72;margin-bottom:8px}
.at80 table{width:100%;border-collapse:collapse;font-size:14px}.at80 th{text-align:left;font-weight:600;color:#5E5A72;font-size:13px;padding:6px 8px;border-bottom:1px solid #ECEAF2}
.at80 td{padding:7px 8px;border-bottom:1px solid #F3F2F8;color:#2B2253}.at80 td.n{text-align:right;font-variant-numeric:tabular-nums}
.at80 .ch{display:inline-block;font-size:12px;font-weight:600;border-radius:6px;padding:1px 7px;margin-left:6px}
.at80 .ch.ok{background:#EEF8F3;color:#1F6E4E}.at80 .ch.late{background:#FDF1EE;color:#A6432E}.at80 .ch.rest{background:#F4F2FD;color:#45399E}.at80 .ch.open{background:#EEF8F9;color:#00737B}
.at80 details{margin-top:10px}.at80 summary{cursor:pointer;font-weight:600;color:#00737B;font-size:14px}
.at80 .mo{display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:8px;margin-top:10px}
.at80 .mo div{background:#F7F6FB;border-radius:10px;padding:8px 10px;font-size:13px;color:#5E5A72}.at80 .mo b{display:block;font-size:15px;color:#2B2253}
@media(max-width:640px){.at80 .hp{display:none}}
</style>
<script id="x2180">
/* 2180 · My pay › My time-ins */
window.att2180 = function(p){ try{
  const A = (p && p.att) || []; if(!A.length) return '';
  const now = new Date(Date.now() + 8 * 3600e3), ym = now.toISOString().slice(0, 7), today = now.toISOString().slice(0, 10);
  const E = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const P = v => '₱' + (Math.round((+v || 0) * 100) / 100).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  const isC = /^celine$/i.test(String(p.name || '').trim());
  const LT = {}; (p.lates || []).forEach(l => { LT[String(l.day).slice(0, 10)] = l; });
  const row = x => { const d = new Date(x.day + 'T12:00:00+08:00'), wd = d.getUTCDay(), start = wd === 0 ? '10:00' : '13:00', tin = String(x.tin || '');
    let ch = '';
    const lt = LT[x.day];
    if(lt) ch = '<span class="ch late">late ' + (+lt.mins || 0) + ' min' + (lt.waived ? ', waived' : '') + '</span>';
    else if(isC && wd === 3) ch = '<span class="ch rest">rest day</span>';
    else if(tin && isC && /^\\d{1,2}:\\d{2}$/.test(tin)) ch = '<span class="ch ok">on time</span>';
    if(tin && !x.tout && x.day === today) ch += '<span class="ch open">working now</span>';
    return '<tr><td>' + E(d.toLocaleDateString('en-GB', { timeZone: 'UTC', weekday: 'short', day: 'numeric', month: 'short' })) + ch + '</td><td class="n">' + E(tin || '—') + '</td><td class="n">' + E(x.tout || '—') + '</td><td class="n hp">' + (+x.hours || 0) + '</td><td class="n">' + ((+x.pay || 0) + (+x.holiday || 0) ? P((+x.pay || 0) + (+x.holiday || 0)) : '—') + '</td></tr>'; };
  const tbl = L => '<table><tr><th>Day</th><th style="text-align:right">Time in</th><th style="text-align:right">Time out</th><th class="hp" style="text-align:right">Hours</th><th style="text-align:right">Pay</th></tr>' + L.map(row).join('') + '</table>';
  const cur = A.filter(x => String(x.day).slice(0, 7) === ym), prev = A.filter(x => String(x.day).slice(0, 7) < ym);
  const late = cur.filter(x => LT[x.day]).length;
  const M = (p.attMonths || []).map(m => '<div>' + E(new Date(m.m + '-15T12:00:00Z').toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })) + '<b>' + m.days + ' days</b>' + (+m.hours || 0) + ' hours · ' + P(m.pay) + '</div>').join('');
  return '<section class="at80"><h3>My time-ins</h3><div class="sub">' + cur.length + ' day' + (cur.length === 1 ? '' : 's') + ' this month' + (late ? '. ' + late + ' late time-in' + (late === 1 ? '' : 's') + ' by the contract.' : isC ? '. All on time.' : '.') + ' Pay counts up to 8 hours a day.</div>'
    + (cur.length ? tbl(cur) : '<div class="sub">No time-ins yet this month.</div>')
    + (prev.length ? '<details><summary>Last month (' + prev.length + ' day' + (prev.length === 1 ? '' : 's') + ')</summary>' + tbl(prev) + '</details>' : '')
    + (M ? '<div class="mo">' + M + '</div>' : '') + '</section>';
}catch(e){ return ''; } };
</script>
</body>
</html>`],
]);
