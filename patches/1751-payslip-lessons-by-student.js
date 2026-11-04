// 1751: (Misty 4 Nov 16:50, "where is the summary of their student's lessons now? … only directly to the payslip";
//   16:54 "I want teachers to have access to their lessons by students for October too, so they can easily tally")
//   The database payslip (management and the teacher's own "My payslip", any month incl. October) now lists the lessons behind
//   the units: each student (name, code, book) with the class days and units, then trial and substitute classes, and the total.
//   Data: coe-payedit v5 returns `lessons` (same list as Lessons counted). It is part of the payslip, so it is in Copy picture too.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["      + row('Gross compensation', '', pz(gross), 'tot') + '</table>'",
   "      + row('Gross compensation', '', pz(gross), 'tot') + '</table>' + lessHtml1751(S, r)"],
  ["  function slipHtml(S, forPrint){ const r = S.row,",
   "  function lessHtml1751(S, r){ const L = S.lessons; if(!L) return '';   /* 1751 · lessons by student */\n" +
   "    const n1 = v => { const x = Math.round((+v || 0) * 100) / 100; return String(x); };\n" +
   "    const mo = d => { const x = new Date(String(d).slice(0, 10) + 'T00:00:00'); return isNaN(x) ? '' : x.toLocaleDateString('en-US', { month: 'short' }); };\n" +
   "    const dn = d => String(+String(d).slice(8, 10) || '');\n" +
   "    const uu = u => (+u === 1 ? '' : +u === 0.5 ? ' (½)' : ' (' + n1(u) + ')');\n" +
   "    const days = ds => { const by = {}; (ds || []).slice().sort((a, b) => String(a.d).localeCompare(String(b.d))).forEach(x => { const m = mo(x.d); (by[m] = by[m] || []).push(dn(x.d) + uu(x.u)); }); return Object.keys(by).map(m => m + ' ' + by[m].join(', ')).join(' · '); };\n" +
   "    const tr = (a, u) => '<tr><td>' + a + '</td><td></td><td style=\"text-align:right\">' + n1(u) + '</td></tr>';\n" +
   "    const st = (L.students || []).slice().sort((a, b) => String(a.name || '').localeCompare(String(b.name || '')));\n" +
   "    const one = (x, kind) => tr('<b>' + esc(x.name || x.code || '') + '</b> <span class=\"m\">' + esc([x.code, x.book].filter(Boolean).join(' · ')) + '</span><div class=\"m\" style=\"font-size:12px\">' + esc(kind ? kind + ' · ' + days([{ d: x.d, u: x.u }]) + (x.t ? ' · ' + x.t : '') : days(x.days)) + '</div>', kind ? x.u : x.units);\n" +
   "    const reg = +L.reg || 0, tri = +L.trial || 0, sub = +L.sub || 0, tot = Math.round((reg + tri + sub) * 100) / 100;\n" +
   "    const pd = Math.round(((+r.reg || 0) + (+r.trial || 0) + (+r.sub || 0)) * 100) / 100;\n" +
   "    return '<h2>Lessons by student</h2><div class=\"m\" style=\"margin:-4px 0 6px\">Classes held in ' + esc(lab(S.month)) + ' · 1 unit = 50 minutes (½ = a 25-minute class) · use this to tally with your own records</div><table>'\n" +
   "      + '<tr><td><b>Student</b></td><td></td><td style=\"text-align:right\"><b>Units</b></td></tr>'\n" +
   "      + st.map(x => one(x)).join('') + (st.length ? '<tr class=\"tot\"><td>Regular lessons · ' + st.length + ' student' + (st.length === 1 ? '' : 's') + '</td><td></td><td style=\"text-align:right\">' + n1(reg) + '</td></tr>' : '')\n" +
   "      + ((L.trials || []).length ? (L.trials || []).map(x => one(x, 'Trial class')).join('') + '<tr class=\"tot\"><td>Trial classes</td><td></td><td style=\"text-align:right\">' + n1(tri) + '</td></tr>' : '')\n" +
   "      + ((L.subs || []).length ? (L.subs || []).map(x => one(x, 'Substitute')).join('') + '<tr class=\"tot\"><td>Substitute classes</td><td></td><td style=\"text-align:right\">' + n1(sub) + '</td></tr>' : '')\n" +
   "      + '<tr class=\"tot\"><td>Total units</td><td></td><td style=\"text-align:right\">' + n1(tot) + '</td></tr></table>'\n" +
   "      + (Math.abs(pd - tot) > 0.009 ? '<div class=\"m\" style=\"margin-top:4px\">The pay above counts ' + n1(pd) + ' units' + (pd > tot ? ' (includes corrections made by Operations)' : ' (after corrections by Operations)') + '.</div>' : ''); }\n" +
   "  function slipHtml(S, forPrint){ const r = S.row,"],
  ["myps1746'; btn.style.marginTop = '14px'; btn.textContent = 'My payslip →';",
   "myps1746'; btn.style.marginTop = '14px'; btn.textContent = 'My payslip · lessons by student →';"],
  ["</script>\n</body>\n</html>",
   "</script>\n<script>\n/* 1751 · teacher Pay › the month to check opens the payslip with the lessons by student (Misty: \"so they can easily tally\") */\n(function(){\n  if(window.__1751) return; window.__1751 = 1;\n  const h0 = window.payChkHtml; if(typeof h0 !== 'function') return;\n  window.payChkHtml = function(){ const h = h0.apply(this, arguments);\n    try{ if(!h || typeof ps1744Open !== 'function' || typeof D === 'undefined' || !D || D.mgr || !PCK) return h;\n      const b = '<button class=\"btn ghost block\" style=\"margin-top:10px\" onclick=\"ps1744Open((D.me && D.me.name) || \\'\\', \\'' + esc(String(PCK.month || '')).replace(/'/g, '') + '\\')\">My payslip · lessons by student →</button>';\n      const i = h.lastIndexOf('</div>'); return i > 0 ? h.slice(0, i) + b + h.slice(i) : h + b; }catch(e){ return h; } };\n})();\n</script>\n</body>\n</html>"],
]);
