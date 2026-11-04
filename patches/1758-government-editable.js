// 1758: (Misty 4 Nov 18:05 "it can be editable too right?") Finance › Government: ✎ on every payment (the same Edit / Remove /
//   Undo as Finance › Transactions, saved in the database through coe-edit) and ✎ on every staff contribution row (opens
//   Payroll's Government contributions edit for that person).
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["<th style=\"text-align:left\">Agency</th><th>Amount</th></tr>'", "<th style=\"text-align:left\">Agency</th><th>Amount</th><th></th></tr>'"],
  ["'</td><td style=\"text-align:left\"><span class=\"chip\">' + LBL[r.g] + '</span></td><td>' + P(r.a) + '</td></tr>').join('') : '<tr><td colspan=\"4\"",
   "'</td><td style=\"text-align:left\"><span class=\"chip\">' + LBL[r.g] + '</span></td><td>' + P(r.a) + '</td><td>' + (r.key && typeof fxTx === 'function' ? '<button class=\"btn ghost sm\" title=\"Edit\" onclick=\"fxTx(\\'expense\\',\\'' + encodeURIComponent(r.key).replace(/'/g, '%27') + '\\')\">✎</button>' : '') + '</td></tr>').join('') : '<tr><td colspan=\"5\""],
  ["<th>Person</th><th>SSS</th><th>PhilHealth</th><th>Pag-IBIG</th><th>BIR</th></tr>'", "<th>Person</th><th>SSS</th><th>PhilHealth</th><th>Pag-IBIG</th><th>BIR</th><th></th></tr>'"],
  [".map(k => +p[k] ? '<td>' + P(p[k]) + '</td>' : '<td class=\"z\">—</td>').join('') + '</tr>').join('')",
   ".map(k => +p[k] ? '<td>' + P(p[k]) + '</td>' : '<td class=\"z\">—</td>').join('') + '<td><button class=\"btn ghost sm\" title=\"Edit\" onclick=\"gov1758Staff(\\'' + esc(String(p.teacher)).replace(/'/g, '') + '\\')\">✎</button></td></tr>').join('')"],
  ["  window.gov1757Y = y => { X.y = y; paint(); };",
   "  window.gov1757Y = y => { X.y = y; paint(); };\n" +
   "  window.gov1758Staff = function(name){ if(typeof pdb1742Open !== 'function') return toast('Open Payroll › Database · ✎ correct'); pdb1742Open(); const t0 = Date.now();   /* 1758: wait for the list, then the person's edit */\n" +
   "    (function w(){ const b = document.querySelector('#sheetBody .pdb1742'); if(b && b.querySelector('table') && typeof pdb1756Gov === 'function'){ pdb1756Gov(name); return; } if(Date.now() - t0 < 15000) setTimeout(w, 200); else toast('Could not open · try again'); })(); };"],
]);
