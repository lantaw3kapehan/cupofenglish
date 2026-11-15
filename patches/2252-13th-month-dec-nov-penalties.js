// 2252 (Misty 15 Nov 20:00): 13th month pay is for Celine only (no Katherine), counted December of the year before to November,
// minus administrative penalties (not government, rent or bills), ÷ 12. Server: coe-13th v6.
// Screen: the months start with "December 2025"; the table shows Basic, Administrative penalties (−), Total, ÷ 12; the penalty list says
// "deducted"; "Count the months up to" is gone. Celine's own view (when shown to her) shows the same totals and one penalties line.
const lib = require("../tools/lib.js"), file = process.argv[2];
lib(file, [
 ["Counted here: January to ' + MN[(p ? p.upto : 11) - 1] + '. Basic = days worked × daily rate. Not counted: incentives, allowances, SSS, Pag-IBIG, PhilHealth, rent and bills. Penalties are not deducted. Holiday premiums are paid on payroll but are not basic salary.</div>';",
  "Counted here: December ' + (T.y - 1) + ' to November ' + T.y + '. Basic salary (days worked × daily rate) minus administrative penalties, ÷ 12. Not counted: incentives, allowances, SSS, Pag-IBIG, PhilHealth, rent and bills. Holiday premiums are paid on payroll but are not basic salary.</div>';"],
 ["'</span> basic for the year ÷ 12'", "'</span> (basic − penalties) ÷ 12'"],
 ["h += '<tr><td>' + MN[m.m - 1] + tag + prem", "h += '<tr><td>' + MN[m.m - 1] + (m.y && m.y !== T.y ? ' ' + m.y : '') + tag + (m.src === 'payroll' ? '<div class=\"small mute\">from that month’s payroll</div>' : '') + prem"],
 ["h += '<tr class=\"tot\"><td>Basic for the year</td><td></td><td></td><td class=\"n\" id=\"t13t2\">' + P(p.total) + '</td></tr><tr class=\"tot\"><td>13th month (÷ 12)</td>",
  "h += '<tr class=\"tot\"><td>Basic, December to November</td><td></td><td></td><td class=\"n\" id=\"t13t2\">' + P(p.basicTotal != null ? p.basicTotal : p.total) + '</td></tr><tr><td>Administrative penalties</td><td></td><td></td><td class=\"n\" style=\"color:#B23B2E\">−' + P(p.penaltyTotal || 0) + '</td></tr><tr class=\"tot\"><td>Total</td><td></td><td></td><td class=\"n\" id=\"t13t3\">' + P(p.total) + '</td></tr><tr class=\"tot\"><td>13th month (÷ 12)</td>"],
 ["<b>Penalties in ' + T.y + ' · ' + P(p.penaltyTotal) + '</b> <span class=\"small mute\">· not deducted (DOLE)</span></summary>'",
  "<b>Administrative penalties · ' + P(p.penaltyTotal) + '</b> <span class=\"small mute\">· deducted · December ' + (T.y - 1) + ' to November ' + T.y + (p.excludedTotal ? ' · rent, bills and government (' + P(p.excludedTotal) + ') are not counted' : '') + '</span></summary>'"],
 ["+ '<div class=\"lab\">Count the months up to</div><select class=\"in\" id=\"t13upto\" onchange=\"t2060upto(this.value)\">' + MN.map((n, i) => '<option value=\"' + (i + 1) + '\"' + (i + 1 === p.upto ? ' selected' : '') + '>' + n + '</option>').join('') + '</select>'", "+ ''"],
 ["p.months.forEach(m => { if(m.m > up) return; const k = String(m.m)", "p.months.forEach(m => { const k = String(m.m)"],
 ["t += +(($('t13adj') || {}).value || 0) || 0; const set = (id, x) => { const el = document.getElementById(id); if(el) el.textContent = x; };\n    set('t13t1', P(t)); set('t13t2', P(t)); set('t13p1', P(t / 12)); set('t13p2', P(t / 12)); };",
  "t += +(($('t13adj') || {}).value || 0) || 0; const set = (id, x) => { const el = document.getElementById(id); if(el) el.textContent = x; };\n    const a = t - (+p.penaltyTotal || 0); set('t13t2', P(t)); set('t13t1', P(a)); set('t13t3', P(a)); set('t13p1', P(a / 12)); set('t13p2', P(a / 12)); };"],
 ["const p = person(), m = p && p.months[+k - 1];", "const p = person(), m = p && p.months.find(x => x.m === +k);"],
 ["'</h1><div class=\"sub\">DOLE rule (PD 851): basic salary earned ÷ 12. Counted: January to ' + MN[d.upto - 1] + '. Basic = days worked × daily rate (holiday premiums, allowances and incentives are not part of it).</div>'",
  "'</h1><div class=\"sub\">Counted: December ' + (MY.d.year - 1) + ' to November ' + MY.d.year + '. Basic salary (days worked × daily rate) minus administrative penalties, ÷ 12. Holiday premiums, allowances and incentives are not part of it.</div>'"],
 ["h += '<tr><td>' + MN[m.m - 1] + (m.src === 'estimate' ? '<div class=\"est\">estimate</div>' : '')", "h += '<tr><td>' + MN[m.m - 1] + (m.y && m.y !== MY.d.year ? ' ' + m.y : '') + (m.src === 'estimate' ? '<div class=\"est\">estimate</div>' : '')"],
 ["openSheet(h + '<tr class=\"tot\"><td>Basic</td><td></td><td></td><td class=\"n\">' + P(d.total) + '</td></tr>",
  "openSheet(h + '<tr class=\"tot\"><td>Basic</td><td></td><td></td><td class=\"n\">' + P(d.basicTotal != null ? d.basicTotal : d.total) + '</td></tr>' + (d.penaltyTotal ? '<tr><td>Administrative penalties</td><td></td><td></td><td class=\"n\">−' + P(d.penaltyTotal) + '</td></tr><tr class=\"tot\"><td>Total</td><td></td><td></td><td class=\"n\">' + P(d.total) + '</td></tr>' : '') + '"]
]);
