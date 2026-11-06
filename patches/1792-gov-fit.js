// 1792: (Misty 6 Nov 12:03 "not paid or paid cannot be seen fully") The month table has up to 11 columns, wider than the card
//   on a laptop. Status now sits right after the month (always on screen), the month and year columns stay put while the
//   amounts scroll, whole pesos drop ".00", month names are short (Oct 2026), and cells are a little tighter.
const lib = require('../tools/lib.js'), file = process.argv[2];
const ST = "'<td style=\"text-align:left\">' + (isPaid(g) ? '<span class=\"chip\" style=\"background:#E8F6EE;color:#1E7A55\">Paid</span>' : '<span class=\"chip\" style=\"background:#FFF4E0;color:#8A5A00\">Not paid</span>') + '</td>'";
lib(file, [
  ["<table><tr><th>Month</th><th style=\"text-align:left\">Date of payment</th>' + used.map(([, l]) => '<th>' + l + '</th>').join('') + '<th>Total</th><th style=\"text-align:left\">Status</th><th></th></tr>'",
   "<table class=\"gv-t\"><tr><th>Month</th><th style=\"text-align:left\">Status</th><th style=\"text-align:left\">Paid on</th>' + used.map(([, l]) => '<th>' + l + '</th>').join('') + '<th>Total</th><th></th></tr>'"],
  ["'</div>' : '') + '</td><td style=\"text-align:left\">' + (g.paid_on",
   "'</div>' : '') + '</td>' + " + ST + " + '<td style=\"text-align:left\">' + (g.paid_on"],
  ["'<td><b>' + P(gTot(g)) + '</b></td>'\n          + " + ST + "\n",
   "'<td><b>' + P(gTot(g)) + '</b></td>'\n"],
  ["'<tr class=\"t\"><td>Total</td><td></td>' + used.map", "'<tr class=\"t\"><td>Total</td><td></td><td></td>' + used.map"],
  ["P(Y.reduce((a, g) => a + gTot(g), 0)) + '</td><td colspan=\"2\"></td></tr></table></div>'", "P(Y.reduce((a, g) => a + gTot(g), 0)) + '</td><td></td></tr></table></div>'"],
  ["'<th>Paid</th><th>Not paid yet</th><th>Months paid</th></tr>'", "'<th>Paid</th><th>Not paid yet</th><th>Months</th></tr>'"],
  ["+ '<td>' + L.filter(isPaid).length + ' of ' + L.length + '</td></tr>';", "+ '<td>' + L.filter(isPaid).length + ' / ' + L.length + '</td></tr>';"],
  ["function paint(){ return paint1759(); }   /* 1759 */",
   "function paint(){ const r1792 = paint1759(); try{ gov1792Tidy(); }catch(e){} return r1792; }   /* 1759 · 1792 tidy */\n"
   + "  window.gov1792Tidy = () => { const v = $('v-gov'); if(!v) return;   /* 1792: whole pesos without .00 · short month names */\n"
   + "    v.querySelectorAll('.gv-s td').forEach(td => { if(td.children.length > 1) return; const el = td.firstElementChild || td, t = el.textContent.trim(); if(/^₱[\\d,]+\\.00$/.test(t)) el.textContent = t.replace(/\\.00$/, ''); });\n"
   + "    v.querySelectorAll('td.gv-m > b').forEach(b => { b.textContent = b.textContent.replace(/^([A-Za-z]{3})[a-z]+ (\\d{4})$/, '$1 $2'); }); };"],
  ["#v-gov tr.gv-on td{background:#EEF7F6}",
   "#v-gov tr.gv-on td{background:#EEF7F6}"
   + "#v-gov .gv-s td,#v-gov .gv-s th{padding:6px 5px;font-size:13px}"
   + "#v-gov .gv-s td:first-child,#v-gov .gv-s th:first-child{position:sticky;left:0;background:var(--card,#fff);z-index:1}"
   + "#v-gov tr.gv-on td:first-child{background:#EEF7F6}"
   + "#v-gov td.gv-m{min-width:120px;max-width:200px}"],
]);
