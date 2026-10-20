// 20 Oct · My growth (teacher) and the Growth card (management): "With us 1 year, 5 months" and the Hired → rank → next rank line on top.
require('../tools/lib.js')(process.argv[2], [["\n</script>\n\n</body>", "\n</script>\n<script>\n" + `/* 20 Oct · 459 · Misty: "on the teacher's end, can they also see this?" Yes: the same "With us" line as the teacher card,
   at the top of My growth: Hired → current rank (since) → Today (lifetime units) → next rank (units to go, dashed). Pay stays on the Pay screen. */
(function(){
  const css = document.createElement('style');
  css.textContent = \`
.gj59{border:1px solid var(--line);border-radius:14px;background:#fff;padding:12px 18px 8px;margin:12px 0}
.gj59 .top{display:flex;align-items:baseline;gap:10px;flex-wrap:wrap}
.gj59 .top b{font-family:var(--brand);font-weight:400;font-size:21px;color:var(--ink)}
.gj59 .top span{font-size:12.5px;color:#8A86A0}
.gj59 .ln{position:relative;height:60px;margin:6px 8px 0}
.gj59 .ln:before{content:'';position:absolute;left:0;right:var(--nx,0);top:16px;height:4px;border-radius:2px;background:linear-gradient(90deg,#CDE7E9,var(--rc))}
.gj59 .ln:after{content:'';position:absolute;right:0;width:var(--nx,0);top:17px;border-top:2px dashed #C9C6D6}
.gj59 .ms{position:absolute;top:0;text-align:center;transform:translateX(-50%);white-space:nowrap}
.gj59 .ms.f{transform:none;text-align:left}.gj59 .ms.l{transform:translateX(-100%);text-align:right}
.gj59 .ms i{display:block;width:14px;height:14px;border-radius:7px;margin:11px auto 4px;background:#fff;box-shadow:inset 0 0 0 4px var(--c)}
.gj59 .ms.f i{margin-left:0}.gj59 .ms.l i{margin-right:0}
.gj59 .ms.nx i{box-shadow:inset 0 0 0 2px #B4B1C4}
.gj59 .ms b{font-size:12px;color:var(--ink)}.gj59 .ms span{font-size:11.5px;color:#8A86A0;margin-left:5px}\`;
  document.head.appendChild(css);
  const RK = [[/master/i, '#6C5FC7'], [/senior/i, '#00A3AD'], [/junior/i, '#3B82B5'], [/newly qualified/i, '#2E9E6F'], [/newly hired/i, '#8FA3B8'], [/starting/i, '#D9962B'], [/./, '#9A98A8']];
  const MN = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const pd = v => { const s = String(v || '').trim(); let m = s.match(/^(\\d{4})-(\\d{2})-(\\d{2})/); if(m) return new Date(+m[1], +m[2] - 1, +m[3]); m = s.match(/^(\\d{1,2})-([A-Za-z]{3})-(\\d{4})/); if(m) return new Date(+m[3], MN.indexOf(m[2]), +m[1]); const d = new Date(s); return isNaN(d) ? null : d; };
  const fd = d => d.getDate() + ' ' + MN[d.getMonth()] + ' ' + d.getFullYear();
  const len = (a, b) => { let mo = (b.getFullYear() - a.getFullYear()) * 12 + b.getMonth() - a.getMonth(); if(b.getDate() < a.getDate()) mo--; mo = Math.max(0, mo); const y = Math.floor(mo / 12), m = mo % 12; if(!y && !m) return Math.max(1, Math.round((b - a) / 864e5)) + ' days'; return [y ? y + ' year' + (y > 1 ? 's' : '') : '', m ? m + ' month' + (m > 1 ? 's' : '') : ''].filter(Boolean).join(', '); };
  function card(G){ const c = G && G.career; if(!c) return ''; const h = pd(c.hired); if(!h) return ''; const now = new Date(), rk = pd(c.rankDate), col = (RK.find(z => z[0].test(c.rank || '')) || RK[6])[1], U = x => Number(x || 0).toLocaleString('en-US', { maximumFractionDigits: 1 });
    const M = [['Hired', fd(h), '#9ED9DD']]; if(rk && rk > h) M.push([c.rank, fd(rk), col]); M.push(['Today', U(c.lifetime) + ' units', '#2B2253']); if(c.next) M.push([c.next.name, U(c.next.need) + ' to go', '#C9C6D6', 1]);
    const n = M.length, nxw = c.next ? (100 / (n - 1)) + '%' : '0';
    return '<div class="gj59" style="--rc:' + col + '"><div class="top"><b>With us ' + len(h, now) + '</b><span>since ' + fd(h) + (c.rank ? ' · ' + esc(c.rank) : '') + '</span></div><div class="ln" style="--nx:' + nxw + '">' +
      M.map((x, i) => '<div class="ms' + (i === 0 ? ' f' : i === n - 1 ? ' l' : '') + (x[3] ? ' nx' : '') + '" style="left:' + (i / (n - 1) * 100) + '%;--c:' + x[2] + '"><i></i><b>' + esc(x[0]) + '</b><span>' + esc(x[1]) + '</span></div>').join('') + '</div></div>'; }
  const _g = window.growthHtml; if(!_g) return;
  window.growthHtml = function(G, i, mgr, part){ let h = _g.apply(this, arguments);
    try{ if(part !== 'growth') return h; const j = card(G); if(!j) return h; const at = ['<div class="gr-mini"', '<div class="gr-kpi">', '<section'].map(k => h.indexOf(k)).filter(x => x >= 0).sort((a, b) => a - b)[0];
      if(at != null) h = h.slice(0, at) + j + h.slice(at); }catch(e){ console.warn('gj59', e); }
    return h; };
})();
` + "</script>\n\n</body>"]]);
