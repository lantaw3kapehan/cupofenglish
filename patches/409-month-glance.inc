/* 20 Oct · 409 · Overview, executive level (Misty: "yes to Month at a glance · the pay line placed best").
   · "Month at a glance": one plain sentence at the top of the Overview card — sales pace vs last month, healthy packages,
     QA average, trial conversion — so the whole business is read before scrolling (President only; others see their line).
   · Payroll leaves the bottom of Business and becomes a small card at the top of the right column:
     "September 2026 pay · 16 of 16 paid ✓", opens Payroll. */
(function(){
  const css = document.createElement('style');
  css.textContent = `
.ovc .x-glance{grid-column:1/-1;margin-top:2px;display:flex;align-items:flex-start;gap:10px;background:#fff;border:1px solid var(--line);border-radius:var(--r-md);padding:10px 14px;font-size:14px;line-height:1.55;color:#3F3B5C}
.ovc .x-glance:before{content:'';flex:none;width:6px;height:6px;border-radius:3px;background:var(--teal);margin-top:9px}
.ovc .x-glance b{color:var(--ink);font-weight:700}
.ovc .x-glance em{font-style:normal;font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:#00737B;font-weight:700;margin-right:4px;white-space:nowrap}
.ovc .x-glance .up{color:#1C7A55;font-weight:700}.ovc .x-glance .dn{color:#B4442F;font-weight:700}
.ovc .x-pay{display:flex;align-items:center;gap:12px;background:#fff;border:1px solid var(--line);border-radius:var(--r-lg);box-shadow:var(--sh1);padding:12px 16px;cursor:pointer}
.ovc .x-pay:hover{box-shadow:0 0 0 1px var(--teal) inset,var(--sh1)}
.ovc .x-pay b{font-size:14px;color:var(--ink)}
.ovc .x-pay span{font-size:13px;color:#6F6B85;margin-left:auto;white-space:nowrap}
.ovc .x-pay i{display:block;width:90px;height:6px;border-radius:3px;background:var(--soft);overflow:hidden;flex:none}
.ovc .x-pay i u{display:block;height:100%;background:var(--teal)}
.ovc .x-pay.ok span{color:#1C7A55;font-weight:600}
.ovc .ov-two .ov-pay{display:none!important}`;
  document.head.appendChild(css);
  const k = v => { v = Math.round(v || 0); const a = Math.abs(v); return (v < 0 ? '-' : '') + '₱' + (a >= 1e6 ? (a / 1e6).toFixed(1) + 'M' : a >= 1e3 ? Math.round(a / 1e3) + 'k' : a); };
  const base = window.renderHome;
  window.renderHome = function(){ const r = base.apply(this, arguments);
    try{ const box = document.querySelector('#v-home .ovc'), top = box && box.querySelector('.x-top'); if(!top) return r;
      const parts = [];
      const money = typeof hmMoney === 'function' ? hmMoney() : null;
      if(money && isPres()){ const now = new Date(), ym = now.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }), mtd = money.find(m => m.m === ym), prev = money.find(m => m !== mtd);
        const dim = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate(), day = now.getDate(), proj = mtd && mtd.sales ? Math.round(mtd.sales / day * dim) : 0;
        const mon = now.toLocaleDateString('en-US', { month: 'long' }), pm = prev ? String(prev.m).split(' ')[0] : '';
        if(proj){ const pct = prev && prev.sales ? Math.round(proj / prev.sales * 100) : null; parts.push(mon + ' is on pace for <b>' + k(proj) + ' sales</b>' + (pct != null ? ' <span class="' + (pct >= 100 ? 'up' : 'dn') + '">(' + pct + '% of ' + esc(pm) + ')</span>' : '')); }
        if(prev && prev.net != null) parts.push(esc(pm) + ' profit <b>' + k(prev.net) + '</b>'); }
      try{ if(AT && AT.cols){ const C = {}; AT.cols.forEach((c, i) => C[c] = i); const A = AT.rows.filter(x => x[C.active] === true || x[C.active] === 'TRUE'); const seen = {}, L = A.filter(x => { const c = String(x[C.code]).toUpperCase(); if(seen[c]) return false; seen[c] = 1; return true; });
        const ok = L.filter(x => x[C.available] === '' || +x[C.available] > 5).length; if(L.length) parts.push('<b>' + Math.round(ok / L.length * 100) + '%</b> of ' + L.length + ' packages healthy'); } }catch(e){}
      try{ const t0 = PF && (PF.team || [])[0]; if(t0 && t0.avg != null) parts.push('QA average <b>' + esc(String(t0.avg)) + '</b> of 5'); }catch(e){}
      try{ const tp = $('tp2fun'); const tiles = tp ? tp.querySelectorAll('.tp3t b') : []; if(tiles.length >= 2 && +tiles[0].textContent) parts.push('trials convert <b>' + Math.round(+tiles[1].textContent / +tiles[0].textContent * 100) + '%</b>'); }catch(e){}
      let g = top.querySelector('.x-glance'); if(parts.length){ const html = '<em>Month at a glance</em><span>' + parts.join(' · ') + '.</span>'; if(!g){ const td = top.querySelector('.x-todo'); if(td) td.insertAdjacentHTML('beforebegin', '<div class="x-glance"></div>'); else top.insertAdjacentHTML('beforeend', '<div class="x-glance"></div>'); g = top.querySelector('.x-glance'); } if(g.innerHTML !== html) g.innerHTML = html; } else if(g) g.remove();
      /* pay line → small card at the top of the right column */
      const pay = (MO && MO.payroll) || [], side = box.querySelector('.ov-side') || (box.querySelector('.ov-two') && box.querySelector('.ov-two').lastElementChild);
      if(pay.length && side && !box.querySelector('.x-pay') && isPres()){ const un = typeof unpaidN === 'function' ? unpaidN(pay) : 0, paid = pay.length - un;
        side.insertAdjacentHTML('afterbegin', '<a class="x-pay ' + (un ? '' : 'ok') + '" onclick="go(\'payroll\')"><b>' + esc(MO.payMonth || 'Payroll') + ' pay</b><i><u style="width:' + Math.round(paid / pay.length * 100) + '%"></u></i><span>' + (un ? paid + ' of ' + pay.length + ' paid' : '✓ all ' + pay.length + ' paid') + '</span></a>'); }
    }catch(e){ console.warn('glance', e); }
    return r; };
  try{ if(typeof VIEW !== 'undefined' && VIEW === 'home') renderHome(); }catch(e){}
})();
