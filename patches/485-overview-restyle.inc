/* 20 Oct · 485 · Overview restyled in the Sales & costs look (Misty: "restyle, redesign" — same visual language, no repeated charts).
   · Charts in the calm palette: profit green #7CC4A0 / loss coral #EDA593 with green/coral numbers; Student flow in soft teal,
     violet and coral; this month lighter.
   · Business tiles no longer cut off ("Average profit / month", "Oct so far · day 20/31" wrap instead of "…").
   · The 4th Business tile and Month at a glance: October's EXPECTED NET (after the salaries still to come) and the one-off payment,
     instead of "on pace for ₱664k (186% of Sep)" — the pace counted a single ₱195,585 university payment as if it came every month.
     Same figures as Sales & costs.
   · The Levels card is left out until the levels are loaded (it only said "Open Students once to load the levels"). */
(function(){
  const css = document.createElement('style');
  css.textContent = `
.ovc .bz2-c i.p{background:#7CC4A0!important}
.ovc .bz2-c i.n{background:#EDA593!important}
.ovc .bz2-c.cur i.p{background:repeating-linear-gradient(135deg,#BFE3CF 0 4px,#DDF0E5 4px 8px)!important;border:1.5px dashed #7CC4A0!important}
.ovc .bz2-c b{color:#3C7A57!important;font-size:10.5px!important} .ovc .bz2-c b.neg{color:#9A3B26!important}
.ovc .bz2-c.best b:before{color:#3C7A57!important}
.ovc .bz2-ch:before{border-top-color:#CFCDDA!important}
.ovc .bz2-k span,.ovc .bz2-k em{white-space:normal!important;overflow:visible!important;text-overflow:clip!important;line-height:1.35}
.ovc .bz2-k>div{border-left:4px solid var(--c85,#CFCDDA)}
.ovc .bz2-k>div:nth-child(1){--c85:#7CC4A0;background:#F1F9F4!important} .ovc .bz2-k>div:nth-child(2){--c85:#00A3AD;background:#EEF8F9!important}
.ovc .bz2-k>div:nth-child(3){--c85:#9A8FD8;background:#F4F2FB!important} .ovc .bz2-k>div:nth-child(4){--c85:#2E9E6F;background:#EEF8F3!important}
.ovc .bz2-k>div span{color:var(--c85)!important;filter:brightness(.8);font-weight:700}
.ovc .sf24 .m i.n{background:#5FB8BE!important} .ovc .sf24 .m i.r{background:#A39BE0!important} .ovc .sf24 .m i.s{background:#EDA593!important}
.ovc .sf24 .m b{color:#3C7A57!important} .ovc .sf24 .m b.neg{color:#9A3B26!important}
.ovc .sf24 .k span:nth-child(1) i{background:#5FB8BE!important} .ovc .sf24 .k span:nth-child(2) i{background:#A39BE0!important} .ovc .sf24 .k span:nth-child(3) i{background:#EDA593!important}
.ovc .sf24 .sfi{border-left:4px solid #CFCDDA}
.ovc .x-grid.x85-3{grid-template-columns:repeat(3,minmax(0,1fr))!important}
@media(max-width:1000px){ .ovc .x-grid.x85-3{grid-template-columns:repeat(2,minmax(0,1fr))!important} }
@media(max-width:640px){ .ovc .x-grid.x85-3{grid-template-columns:minmax(0,1fr)!important} }`;
  document.head.appendChild(css);
  const T = s => String(s == null ? '' : s).trim(), N = s => hmN(s), k = v => { v = Math.round(v || 0); const a = Math.abs(v); return (v < 0 ? '−' : '') + '₱' + (a >= 1e6 ? (a / 1e6).toFixed(1) + 'M' : a >= 1e3 ? Math.round(a / 1e3) + 'k' : a); };
  function sec(R, re){ const i = R.findIndex(r => re.test(r[0] || '')); if(i < 0) return null; const head = (R[i + 1] || []).map(x => T(x).toUpperCase()), rows = [];
    for(let j = i + 2; j < R.length; j++){ const r = R[j]; if(!r.some(Boolean)){ if(rows.length) break; else continue; } if(r[0] && r.slice(1).every(x => !x)) continue; rows.push(r); }
    return { head, rows, col: re2 => head.findIndex(h => re2.test(h)) }; }
  // this month the way Sales & costs works it out: sales so far, the one-off, and the expected net after the salaries still to come
  function month(){ if(typeof MN === 'undefined' || !MN || !MN.rows) return null; const R = MN.rows.map(r => r.map(T)), M = sec(R, /^LAST 12 MONTHS/i); if(!M) return null;
    const c = re => M.col(re), cs = c(/^SALES/), cw = c(/^SALAR/), cg = c(/^GOV/), cn = c(/^NET/);
    const ym = new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }), L = M.rows.filter(r => /\d{4}/.test(r[0])).map(r => ({ m: r[0], sales: N(r[cs]) || 0, sal: N(r[cw]) || 0, gov: N(r[cg]) || 0, net: N(r[cn]) }));
    const cur = L.find(x => x.m === ym), full = L.filter(x => x !== cur); if(!cur || !full.length) return null;
    const avg = a => a.reduce((s, x) => s + x, 0) / a.length, G = sec(R, /^GOVERNMENT DUES/i), gr = G && G.rows.find(r => r[0] === ym), gp = G && G.col(/PAID ON/);
    const gPaid = !!(gr && gp > -1 && gr[gp] && gr[gp] !== '—' && !/due/i.test(gr[gp]));
    const still = Math.max(0, Math.round(avg(full.map(x => x.sal)) - cur.sal)) + (gPaid ? 0 : Math.max(0, Math.round(avg(full.map(x => x.gov)) - cur.gov)));
    let one = 0, who = []; const P = sec(R, /^SALES BY PARTNER/i);
    if(P){ const ct = P.col(/THIS MONTH/), cy = P.col(/THIS YEAR/), cp = P.col(/PAYMENT/); P.rows.forEach(r => { const t = N(r[ct]), y = N(r[cy]); if(t && +r[cp] <= 2 && t >= cur.sales * .25 && Math.abs(t - y) < 1){ one += t; who.push(r[0]); } }); }
    return { m: cur.m.split(' ')[0], sales: cur.sales, net: cur.net, still, est: cur.net != null ? cur.net - still : null, one, who }; }
  const base = window.renderHome;
  window.renderHome = function(){ const r = base.apply(this, arguments);
    try{ const v = document.getElementById('v-home'), box = v && v.querySelector('.ovc'); if(!box) return r;
      const X = month();
      if(X && X.est != null){
        const g = box.querySelector('.x-glance span'); if(g && !g.dataset.x85){ g.dataset.x85 = 1;
          g.innerHTML = g.innerHTML.replace(/^[A-Za-z]+ is on pace for <b>[^<]*<\/b>(\s*<span class="(up|dn)">\([^)]*\)<\/span>)?/, esc(X.m) + ' should end near <b>' + k(X.est) + ' net</b> · <b>' + k(X.sales) + '</b> sales so far' + (X.one ? ' incl. a one-off ' + k(X.one) : '')); }
        const t4 = box.querySelector('.bz2-k > .now'); if(t4 && !t4.dataset.x85){ t4.dataset.x85 = 1;
          t4.innerHTML = '<span>' + esc(X.m) + ' · expected net</span><b>≈ ' + k(X.est) + '</b><em>' + k(X.sales) + ' sales so far' + (X.one ? ' · incl. one-off ' + k(X.one) : '') + '</em>'; t4.title = 'Same figure as Sales & costs › Overview'; }
      }
      const bh = box.querySelector('.bz2-h span'); if(bh) bh.innerHTML = bh.innerHTML.replace('teal = profit', 'green = profit');
      const av = box.querySelector('.bz2-k > div:nth-child(3) span'); if(av && /^Average profit/i.test(av.textContent)) av.textContent = 'Avg profit / month';
      const grid = box.querySelector('.x-grid'); if(grid && !grid.classList.contains('x85-3')){ const lv = [...grid.children].find(c => /Open Students once to load the levels/.test(c.textContent)); if(lv){ lv.remove(); grid.classList.add('x85-3'); } }
    }catch(e){ console.warn('x85', e); }
    return r; };
  try{ if(typeof VIEW !== 'undefined' && VIEW === 'home') renderHome(); }catch(e){}
})();
