// 1791: (Misty 6 Nov 12:03, Government screenshot: "also fix the design of this · not paid or paid cannot be seen fully ·
//   if possible, show a yearly summary · or all time summary?")
//   1. The month's note sat in the Status cell on one line, so a long note (e.g. "BIR ₱880.00 from Transactions: …") pushed
//      Status and ✎ past the card's edge. The note now shows under the month name and wraps; the Status chip never wraps or clips.
//   2. New card "By year": one line per year with what was paid per agency (months marked Paid), what is still to pay,
//      months paid, and an All time line at the bottom. Tapping a year shows its months above.
const lib = require('../tools/lib.js'), file = process.argv[2];
const yearCard = "the app saves here now</div></div>'"
  + "\n      + (() => { const KU = GK.filter(([k]) => G.some(g => +g[k])), sum = (L, k) => L.filter(isPaid).reduce((a, g) => a + (+g[k] || 0), 0);   /* 1791 · By year */"
  + "\n        const row = (lbl, L, on, yy) => '<tr class=\"' + (on ? 'gv-on' : '') + (yy == null ? ' t' : '') + '\"' + (yy != null ? ' style=\"cursor:pointer\" onclick=\"gov1759Y(\\'' + yy + '\\')\"' : '') + '><td><b>' + lbl + '</b></td>'"
  + "\n          + KU.map(([k]) => { const x = sum(L, k); return x ? '<td>' + P(x) + '</td>' : '<td class=\"z\">—</td>'; }).join('')"
  + "\n          + '<td><b>' + P(L.filter(isPaid).reduce((a, g) => a + gTot(g), 0)) + '</b></td>'"
  + "\n          + (() => { const u = L.filter(g => !isPaid(g)).reduce((a, g) => a + gTot(g), 0); return u ? '<td style=\"color:#8A5A00\">' + P(u) + '</td>' : '<td class=\"z\">—</td>'; })()"
  + "\n          + '<td>' + L.filter(isPaid).length + ' of ' + L.length + '</td></tr>';"
  + "\n        return '<div class=\"gv-c\"><h2>By year · paid</h2><div class=\"gv-s\"><table><tr><th>Year</th>' + KU.map(([, l]) => '<th>' + l + '</th>').join('') + '<th>Paid</th><th>Not paid yet</th><th>Months paid</th></tr>'"
  + "\n          + years.map(y => row(esc(y), G.filter(g => String(g.month).slice(0, 4) === y), X.gy === y, y)).join('') + row('All time', G, false, null)"
  + "\n          + '</table></div><div class=\"small mute\" style=\"margin-top:6px\">Amounts of months marked Paid · tap a year to see its months</div></div>'; })()";
lib(file, [
  ["'<tr><td><b>' + esc(mLong(g.month)) + '</b></td>",
   "'<tr><td class=\"gv-m\"><b>' + esc(mLong(g.month)) + '</b>' + (g.note ? '<div class=\"gv-n\">' + esc(g.note) + '</div>' : '') + '</td>"],
  ["Not paid</span>') + (g.note ? ' <span class=\"small mute\">' + esc(g.note) + '</span>' : '') + '</td>'",
   "Not paid</span>') + '</td>'"],
  ["#v-gov .chip{font-size:12px}",
   "#v-gov .chip{font-size:12px;white-space:nowrap;display:inline-block}"
   + "#v-gov td.gv-m{white-space:normal;min-width:150px;max-width:260px}"
   + "#v-gov .gv-n{font-size:12px;color:#5E5A76;line-height:1.35;margin-top:2px;font-weight:400}"
   + "#v-gov tr.gv-on td{background:#EEF7F6}"],
  ["the app saves here now</div></div>'", yearCard],
]);
