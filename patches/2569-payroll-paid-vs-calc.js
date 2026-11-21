// 2569 (audit QA-01, verified 21 Nov): October pay showed ₱137,689.81 (today's calculation) while the history showed ₱137,509.81
// (amounts recorded as paid on 9 Nov). Julia and Mayi each have 0.5 unit more in today's calculation (₱90 each).
// The list now shows what was paid for paid teachers (coe_overview_core 2569) and, where today's calculation differs,
// says so on the card and in one line under the totals. Nothing is paid or changed automatically.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["<b class=\"ell\">${esc(tName(x.name))}</b><span class=\"num\">${peso(x.net)}</span></div></div>",
   "<b class=\"ell\">${esc(tName(x.name))}</b><span class=\"num\">${peso(x.net)}</span></div></div>${x.paid && x.calcNet != null && Math.abs(x.calcNet - x.net) >= 1 ? `<div class=\"small\" style=\"color:#8A4B00;margin-top:4px\">Paid ${peso(x.net)} · calculated today ${peso(x.calcNet)} (${x.calcNet > x.net ? '+' : '−'}${peso(Math.abs(x.calcNet - x.net))})</div>` : ''}"],
  ["<div class=\"stat st-rdy\"><b class=\"num\">${RDY ? peso(rdyAmt) : '—'}</b><span>${RDY ? 'ready to release · ' + RD.length : 'ready to release · checking…'}</span></div></div>`;",
   "<div class=\"stat st-rdy\"><b class=\"num\">${RDY ? peso(rdyAmt) : '—'}</b><span>${RDY ? 'ready to release · ' + RD.length : 'ready to release · checking…'}</span></div></div>`;\n{ const DF = P.filter(x => x.paid && x.calcNet != null && Math.abs(x.calcNet - x.net) >= 1);   /* 2569 */\n  if(DF.length){ const d = DF.reduce((a, x) => a + (x.calcNet - x.net), 0); h += `<div class=\"card\" style=\"margin-top:10px;background:#FFF8EC;border-color:#F0D9A8\"><b>Paid amounts differ from today's calculation</b><div class=\"small\" style=\"margin-top:4px\">${DF.map(x => esc(tName(x.name)) + ' ' + (x.calcNet > x.net ? '+' : '−') + peso(Math.abs(x.calcNet - x.net))).join(' · ')} · total ${d > 0 ? '+' : '−'}${peso(Math.abs(d))}. The totals above are what was paid. A class record changed after payday; decide whether to pay the difference as an adjustment next payroll.</div></div>`; } }"],
]);
