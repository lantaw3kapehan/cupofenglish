// Sizing: the lessons-left picture no longer overlaps "over the package" with the Used line (it moves down when long; over shows +2 in red).
// Student profile header: the name wraps inside its box and the stat boxes move below on narrow screens; a student opened from search shows
// the name from ACTIVE instead of the code.
require('../tools/lib.js')(process.argv[2], [
[
"if(bl){ const b = P.bal, shared = b.left === '' || b.left == null, ns = shared ? '—' : String(b.left),",
"if(bl){ const b = P.bal, shared = b.left === '' || b.left == null, ns = shared ? '—' : (!P.renew && +b.left < 0 ? '+' + Math.round(-b.left * 10) / 10 : String(b.left)),"
],
[
"c.fillStyle = '#00737B'; c.font = '400 88px ' + B; c.fillText(ns, 112, y + 104); const nw = c.measureText(ns).width;",
"c.fillStyle = !shared && !P.renew && +b.left < 0 ? '#C0392B' : '#00737B'; c.font = '400 88px ' + B; c.fillText(ns, 112, y + 104); const nw = c.measureText(ns).width;"
],
[
"ov ? 'lessons over the package' : 'lessons left', 136 + nw, y + 66);",
"ov ? 'over the package' : 'lessons left', 136 + nw, y + 66); const lw = c.measureText(shared ? 'shared package' : P.renew ? 'lessons now' : ov ? 'over the package' : 'lessons left').width;"
],
[
"c.textAlign = 'right'; c.fillStyle = '#4C4868'; c.font = '400 20px ' + F; c.fillText('Used ' + used + ' of ' + tot + ' · 已上 ' + used + ' / ' + tot, W - 112, y + 66); c.textAlign = 'left'; }",
"c.textAlign = 'right'; c.fillStyle = '#4C4868'; c.font = '400 20px ' + F; { const ut = 'Used ' + used + ' of ' + tot + ' · 已上 ' + used + ' / ' + tot, uw = c.measureText(ut).width; c.fillText(ut, W - 112, 136 + nw + lw + 24 > W - 112 - uw ? y + 120 : y + 66); } c.textAlign = 'left'; }   /* no overlap with a long label: the Used line moves down above the bar */"
],
[
".shero h1{font-size:28px;line-height:1.1}",
".shero h1{font-size:28px;line-height:1.1;overflow-wrap:anywhere} .shero>.grow{min-width:min(240px,100%)}"
],
[
"const nm = s.name || code, f0 = F[0];",
"const nm = s.name || (() => { try{ const C2 = {}; AT.cols.forEach((c, i) => C2[c] = i); const x = AT.rows.find(y => String(y[C2.code]).toUpperCase() === String(code).toUpperCase() && y[C2.name]); return x ? String(x[C2.name]) : ''; }catch(e){ return ''; } })() || code, f0 = F[0];   /* a finished student opened from search: name from ACTIVE, not the code */"
]
]);
