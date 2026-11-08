// 1886: (Misty 8 Nov 10:35 "what's this now before package below? parents may be confused")
//   Lesson summaries (single and shared): a lesson in the package's first month that was taken BEFORE the package start date belonged to
//   the previous package. It was shown as a separate "Before package start (previous package) −1" row. Now that lesson is simply not
//   counted in the first month, and the month says "from June 9" — no negative row. Totals unchanged (they already matched).
const lib = require('../tools/lib.js'), file = process.argv[2];
lib(file, [
  // ── shared summary ──
  ["  const mv = (k, i) => Math.max(0, +k.months[i] || 0), sg = v => v < 0 ? '−' + (-v) : String(v);\n  let out = rows.map(x => { const tot = n1(kids.reduce((a, k) => a + mv(k, x.i), 0)); return `<tr style=\"border-top:1px solid #F1F2F6\"><td style=\"padding:4px 0\">${ML[x.d.getMonth()]} ${MZ[x.d.getMonth()]}月 ${x.d.getFullYear()}</td>",
   "  const mv0 = (k, i) => Math.max(0, +k.months[i] || 0), sg = v => v < 0 ? '−' + (-v) : String(v);\n"
   + "  /* 1886: lessons before the start date (previous package) come off the first month(s) instead of a negative row */\n"
   + "  const ADJ = kids.map((k, j) => { const a = {}; let ex = n1(k.finished - rows.reduce((s, x) => s + mv0(k, x.i), 0) - n1(+k.sub || 0)); if(ex < 0){ rows.slice().sort((p, q) => p.d - q.d).forEach(x => { if(ex >= 0) return; const v = mv0(k, x.i), t = Math.min(v, -ex); if(t > 0){ a[x.i] = t; ex = n1(ex + t); } }); } return a; });\n"
   + "  const mv = (k, i) => n1(mv0(k, i) - ((ADJ[kids.indexOf(k)] || {})[i] || 0)), cut = x => kids.some((k, j) => (ADJ[j] || {})[x.i]) && st && st.getDate() > 1 && st.getMonth() === x.d.getMonth() && st.getFullYear() === x.d.getFullYear();\n"
   + "  let out = rows.map(x => { const tot = n1(kids.reduce((a, k) => a + mv(k, x.i), 0)); return `<tr style=\"border-top:1px solid #F1F2F6\"><td style=\"padding:4px 0\">${ML[x.d.getMonth()]} ${MZ[x.d.getMonth()]}月 ${x.d.getFullYear()}${cut(x) ? `<div style=\"font-size:11px;color:#6F6B85\">from ${ML[x.d.getMonth()]} ${st.getDate()} · 自${x.d.getMonth() + 1}月${st.getDate()}日起</div>` : ''}</td>"],
  // ── single summary ──
  ["${hist.map(x => { const v = Math.max(0, months[x.i] || 0);   /* 1786: never below 0 */ return `<tr><td style=\"padding:4px 0\">${ML[x.d.getMonth()]} ${MZ[x.d.getMonth()]}月 ${x.d.getFullYear()}</td>",
   "${(() => { /* 1886: lessons before the start date come off the first month(s) */ const sb0 = C.sub != null ? n1(rows0.reduce((a, x) => a + (+x[C.sub] || 0), 0)) : 0; let ex = n1(done - hist.reduce((a, x) => a + Math.max(0, months[x.i] || 0), 0) - sb0); window._adj1886 = {};\n"
   + "  if(ex < 0) hist.slice().sort((p, q) => p.d - q.d).forEach(x => { if(ex >= 0) return; const v = Math.max(0, months[x.i] || 0), t = Math.min(v, -ex); if(t > 0){ _adj1886[x.i] = t; ex = n1(ex + t); } }); return ''; })()}"
   + "${hist.map(x => { const a1886 = (window._adj1886 || {})[x.i] || 0, v = n1(Math.max(0, months[x.i] || 0) - a1886);   /* 1786: never below 0 · 1886: minus lessons before the start date */ return `<tr><td style=\"padding:4px 0\">${ML[x.d.getMonth()]} ${MZ[x.d.getMonth()]}月 ${x.d.getFullYear()}${a1886 && st && st.getDate() > 1 && st.getMonth() === x.d.getMonth() && st.getFullYear() === x.d.getFullYear() ? `<div style=\"font-size:11px;color:#6F6B85\">from ${ML[x.d.getMonth()]} ${st.getDate()} · 自${x.d.getMonth() + 1}月${st.getDate()}日起</div>` : ''}</td>"],
  ["shown = n1(hist.reduce((a, x) => a + Math.max(0, months[x.i] || 0), 0)), ea = n1(done - shown - sb)",
   "shown = n1(hist.reduce((a, x) => a + Math.max(0, months[x.i] || 0) - ((window._adj1886 || {})[x.i] || 0), 0)), ea = n1(done - shown - sb)"],
]);
