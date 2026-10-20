// 20 Oct · This month's teacher rows: two columns, bar = so far vs last month, on-pace projection with ▲/▼.
require('../tools/lib.js')(process.argv[2], [["\n</script>\n\n</body>", "\n</script>\n<script>\n" + `/* 20 Oct · 465 · Misty: "can you refine this?" (October so far list).
   Comparing a half month with all of September looked like everyone dropped. Each row now shows:
   the amount so far · a bar of so far vs last month (the mark = last month) · "on pace for ₱21,800 ▲ vs Sep ₱20,710" (so far ÷ days gone × days in month).
   Two columns on a laptop, smaller rows. */
(function(){
  const css = document.createElement('style');
  css.textContent = \`
@media(min-width:1000px){#pyCur{display:grid!important;grid-template-columns:1fr 1fr;column-gap:0}#pyCur .py-row:nth-child(odd){border-right:1px solid #F1F0F6}}
#pyCur .py-row{padding:9px 16px!important;gap:12px!important}
#pyCur .py-av{width:34px!important;height:34px!important;font-size:12px!important}
#pyCur .py-n b{font-size:15px}
#pyCur .py-net{font-size:17px!important}
#pyCur .py-st span{font-size:11.5px!important;padding:2px 9px!important}
#pyCur .r65{display:flex;align-items:center;gap:8px;margin-top:3px;font-size:11.5px;color:#8A86A0;white-space:nowrap}
#pyCur .r65 .tb{position:relative;width:110px;height:6px;border-radius:3px;background:var(--soft);flex:none}
#pyCur .r65 .tb i{position:absolute;left:0;top:0;bottom:0;border-radius:3px;background:#00A3AD}
#pyCur .r65 .tb u{position:absolute;top:-3px;bottom:-3px;width:2px;background:#2B2253;opacity:.5}
#pyCur .r65 b.up{color:#1E8A5E}#pyCur .r65 b.dn{color:#C0563F}\`;
  document.head.appendChild(css);
  const num = s => { const n = parseFloat(String(s || '').replace(/[^\\d.-]/g, '')); return isNaN(n) ? 0 : n; };
  function run(){ const box = document.getElementById('pyCur'); if(!box) return; const d = new Date(), dim = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate(), f = dim / Math.max(1, d.getDate());
    box.querySelectorAll('.py-row').forEach(r => { const sm = r.querySelector('.py-n small'); if(!sm || sm.classList.contains('r65')) return; const now = num((r.querySelector('.py-net') || {}).textContent);
      const m = sm.textContent.match(/^([A-Za-z]{3})\\s+₱([\\d,.\\-]+)/), last = m ? num(m[2]) : 0, pace = Math.round(now * f / 10) * 10;
      sm.className = 'r65'; if(!last){ sm.innerHTML = 'so far this month · on pace ' + peso(pace); return; }
      const mx = Math.max(now, last), up = pace >= last;
      sm.innerHTML = '<span class="tb" title="so far vs ' + m[1] + '"><i style="width:' + Math.min(100, now / mx * 100) + '%"></i><u style="left:' + (last / mx * 100) + '%"></u></span>on pace ' + peso(pace) + ' <b class="' + (up ? 'up' : 'dn') + '">' + (up ? '▲' : '▼') + '</b> ' + m[1] + ' ' + peso(last); }); }
  let q = 0; new MutationObserver(() => { if(q) return; q = requestAnimationFrame(() => { q = 0; try{ run(); }catch(e){} }); }).observe(document.body, { childList: true, subtree: true });
})();
` + "</script>\n\n</body>"]]);
