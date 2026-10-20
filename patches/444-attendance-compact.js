// 20 Oct · Teacher attendance: with only a month or two of history, a compact card (completion vs the 85% goal) instead of a mostly empty chart.
require('../tools/lib.js')(process.argv[2], [["\n</script>\n\n</body>", "\n</script>\n<script>\n" + `/* 20 Oct · 444 · Misty: "also this part" (a teacher's Attendance with one month showed one bar in a wide empty chart).
   With fewer than 3 months of classes the card shows instead:
   · a headline for the latest month: "67% completed · goal 85%" with a bar and a mark at 85%;
   · one line per month: completed (teal) and cancelled (coral) as a horizontal bar, the numbers, the % coloured, units.
   With 3 or more months the column chart stays as before. Same numbers (T-HISTORY). */
(function(){
  const css = document.createElement('style');
  css.textContent = \`
.att44 .hd{display:flex;align-items:baseline;gap:10px;flex-wrap:wrap;margin:6px 0 4px}
.att44 .hd b{font-family:var(--brand);font-weight:400;font-size:30px;line-height:1}
.att44 .hd span{font-size:13px;color:#55526E}
.att44 .gl{position:relative;height:12px;border-radius:6px;background:var(--soft);margin:8px 0 14px}
.att44 .gl i{position:absolute;left:0;top:0;bottom:0;border-radius:6px}
.att44 .gl em{position:absolute;top:-4px;bottom:-4px;width:2px;background:#2B2253;border-radius:1px}
.att44 .gl em:after{content:'goal 85%';position:absolute;top:-16px;left:-22px;font-size:10.5px;font-style:normal;color:#2B2253;white-space:nowrap}
.att44 .r{display:grid;grid-template-columns:70px minmax(0,1fr) 210px;gap:12px;align-items:center;padding:6px 0;border-top:1px solid #F1F0F6;font-size:13px}
.att44 .r .b{display:flex;height:10px;gap:2px}
.att44 .r .b i{display:block;border-radius:2px}
.att44 .r .n{text-align:right;color:#55526E;white-space:nowrap}
.att44 .r .n b{margin-left:6px}
.att44 .p44g{color:#1E8A5E!important}.att44 .p44a{color:#B07A10!important}.att44 .p44c{color:#C0563F!important}
.att44 .hd b{margin:0!important;padding:0!important}\`;
  document.head.appendChild(css);
  const cls = p => p == null ? '' : p >= 85 ? 'p44g' : p >= 70 ? 'p44a' : 'p44c';
  const _a = window.attHtml; if(!_a) return;
  window.attHtml = function(A, mine){ try{ const L = (A || []).filter(Boolean); const i = L.findIndex(a => a.s); const M = i >= 0 ? L.slice(i) : [];
      if(M.length && M.length < 3){ const pc = a => a.s ? Math.round(a.c / a.s * 100) : null, last = M[M.length - 1], p = pc(last), mx = Math.max(1, ...M.map(a => a.s));
        const col = p == null ? '#C9C6D6' : p >= 85 ? '#2E9E6F' : p >= 70 ? '#D9962B' : '#D4705A';
        return '<section class="sec att att44"><h2>Attendance <span class="c">' + (M.length === 1 ? 'first month with classes' : 'since ' + esc(M[0].label)) + ' · calendar log</span></h2>' +
          '<div class="hd"><b class="' + cls(p) + '">' + (p == null ? '—' : p + '%') + '</b><span>classes completed · ' + esc(last.label) + (last.cur ? ' so far' : '') + ' · ' + last.c + ' of ' + last.s + (last.x ? ' · ' + last.x + ' cancelled' : '') + ' · ' + last.u + ' units</span></div>' +
          '<div class="gl"><i style="width:' + (p || 0) + '%;background:' + col + '"></i><em style="left:85%"></em></div>' +
          M.map(a => { const q = pc(a); return '<div class="r" title="' + esc(a.label) + ': ' + a.s + ' scheduled · ' + a.c + ' completed · ' + a.x + ' cancelled' + (a.l ? ' · ' + a.l + ' leave' : '') + '"><span><b>' + esc(a.label) + '</b>' + (a.cur ? ' <small style="color:#8A86A0">so far</small>' : '') + '</span><div class="b" style="width:' + Math.max(4, a.s / mx * 100) + '%">' + (a.c ? '<i style="flex:' + a.c + ';background:#4A9BAA"></i>' : '') + (a.x ? '<i style="flex:' + a.x + ';background:#D4705A"></i>' : '') + '</div><span class="n">' + a.c + ' done · ' + a.x + ' cancelled · ' + a.u + ' u<b class="' + cls(q) + '">' + (q == null ? '—' : q + '%') + '</b></span></div>'; }).join('') +
          '<div class="att-lg small" style="margin-top:6px"><span><i class="c"></i>Completed</span><span><i class="x"></i>Cancelled</span></div></section>'; } }catch(e){ console.warn('att44', e); }
    return _a.apply(this, arguments); };
})();
` + "</script>\n\n</body>"]]);
