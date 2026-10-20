/* 20 Oct · 407 · Overview › Business, clearer and shorter (Misty: "can the business be better").
   · Four small numbers in one row: last month's profit (▲/▼ vs the month before) · margin · average profit a month · this month so far + pace.
   · One chart that answers "did we make money each month?": profit columns around a zero line — teal above (profit),
     coral below (loss), this month dashed with "so far"; the value is written on every column; hover shows sales, costs, profit.
   · The year line under it. Quality no longer stretches to Business's height (no empty space). */
(function(){
  const css = document.createElement('style');
  css.textContent = `
.ovc .ov-two{align-items:start!important}
.bz2-k{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px}
.bz2-k>div{background:var(--soft);border-radius:var(--r-md);padding:10px 12px;min-width:0}
.bz2-k span{display:block;font-size:11px;letter-spacing:.05em;text-transform:uppercase;color:#8A86A0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.bz2-k b{display:block;font-family:var(--brand);font-weight:400;font-size:21px;line-height:1.2;color:var(--ink);margin-top:2px}
.bz2-k b.neg{color:#B4442F}
.bz2-k em{display:block;font-style:normal;font-size:12px;color:#6F6B85;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.bz2-k em.up{color:#1C7A55}.bz2-k em.dn{color:#B4442F}
.bz2-k .now{background:var(--tint)}
.bz2-h{display:flex;justify-content:space-between;align-items:baseline;margin-top:14px;font-size:12.5px;color:#8A86A0}
.bz2-h b{color:var(--ink);font-weight:600;font-size:13px}
.bz2-ch{position:relative;display:flex;gap:6px;height:150px;margin-top:6px}
.bz2-ch:before{content:'';position:absolute;left:0;right:0;top:var(--z);border-top:1px solid #DAD8E4}
.bz2-c{flex:1;position:relative;min-width:0;cursor:default}
.bz2-c i{position:absolute;left:18%;right:18%;border-radius:4px}
.bz2-c i.p{background:#00A3AD;bottom:calc(100% - var(--z));border-radius:4px 4px 0 0}
.bz2-c i.n{background:#D4705A;top:var(--z);border-radius:0 0 4px 4px}
.bz2-c.cur i.p{background:repeating-linear-gradient(135deg,#9ED9DD 0 4px,#C9ECEE 4px 8px);border:1.5px dashed #00A3AD}
.bz2-c b{position:absolute;left:-6px;right:-6px;text-align:center;font-size:11px;font-weight:700;color:var(--ink);white-space:nowrap}
.bz2-c b.neg{color:#B4442F}
.bz2-c span{position:absolute;bottom:0;left:0;right:0;text-align:center;font-size:11px;color:#8A86A0}
.bz2-c.best b:before{content:'★ ';color:#00737B}
.bz2-y{margin-top:10px;font-size:12.5px;color:#6F6B85}.bz2-y b{color:var(--ink)}
.ovc .ov-side{display:flex;flex-direction:column;gap:14px;min-width:0}
.ovc .ov-side section.ov-card .row{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px!important}
.ovc .ov-side section.ov-card .row>div{background:var(--soft)!important;border-radius:var(--r-md)!important;padding:9px 12px!important}
.ovc .ov-side section.ov-card .row>div b.num{font-size:20px!important}
.ovc section.ov-card>div:last-child>a.lk.small{font-size:12px;color:#8A86A0}
@media(max-width:700px){.bz2-k{grid-template-columns:repeat(2,minmax(0,1fr))}}`;
  document.head.appendChild(css);
  window.ovBiz = function(money, mtd, prev){
    const L = money.slice(0, 12).reverse(), now = new Date(), dim = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate(), day = now.getDate();
    const proj = mtd && mtd.sales ? Math.round(mtd.sales / day * dim) : 0;
    const k = v => { v = Math.round(v || 0); const a = Math.abs(v); return (v < 0 ? '-' : '') + '₱' + (a >= 1e6 ? (a / 1e6).toFixed(1) + 'M' : a >= 1e3 ? Math.round(a / 1e3) + 'k' : a); };
    const full = L.filter(m => m !== mtd), avg = full.length ? full.reduce((a, m) => a + (m.net || 0), 0) / full.length : 0;
    const best = full.reduce((b, m) => !b || (m.net || 0) > (b.net || 0) ? m : b, null), yr = String(now.getFullYear()), Y = L.filter(m => String(m.m).indexOf(yr) > -1);
    const q = money.find(m => m !== mtd && m !== prev), pm = prev ? String(prev.m).split(' ')[0] : '', cm = mtd ? String(mtd.m).split(' ')[0] : '';
    const pacePct = proj && prev && prev.sales ? Math.round(proj / prev.sales * 100) : null;
    const mo = m => String(m.m).split(' ')[0].slice(0, 3);
    let h = '<div class="bz2-k">' +
      '<div><span>' + esc(pm) + ' profit</span><b class="' + (prev && prev.net < 0 ? 'neg' : '') + '">' + (prev ? k(prev.net) : '—') + '</b>' + (prev && q && q.net != null ? '<em class="' + (prev.net >= q.net ? 'up' : 'dn') + '">' + (prev.net >= q.net ? '▲ ' : '▼ ') + k(Math.abs(prev.net - q.net)) + ' vs ' + esc(mo(q)) + '</em>' : '') + '</div>' +
      '<div><span>' + esc(pm) + ' margin</span><b>' + (prev && prev.sales ? Math.round(prev.net / prev.sales * 100) + '%' : '—') + '</b><em>of ' + (prev ? k(prev.sales) : '—') + ' sales</em></div>' +
      '<div><span>Average profit / month</span><b class="' + (avg < 0 ? 'neg' : '') + '">' + k(avg) + '</b><em>last ' + full.length + ' months</em></div>' +
      '<div class="now"><span>' + esc(cm) + ' so far · day ' + day + '/' + dim + '</span><b>' + (mtd ? k(mtd.sales) : '—') + '</b><em class="' + (pacePct != null && pacePct >= 100 ? 'up' : 'dn') + '">' + (proj ? 'pace ' + k(proj) + (pacePct != null ? ' · ' + pacePct + '% of ' + esc(pm.slice(0, 3)) : '') : 'sales this month') + '</em></div></div>';
    const vals = L.map(m => m === mtd ? (m.net || 0) : (m.net || 0)), hi = Math.max(0, ...vals), lo = Math.min(0, ...vals), span = Math.max(1, hi - lo), H = 150, top = 18, bot = 38, usable = H - top - bot;
    const z = top + Math.round(hi / span * usable);   /* the zero line from the top */
    h += '<div class="bz2-h"><span><b>Profit each month</b> · teal = profit, coral = loss</span><span>' + (best ? '★ best ' + esc(mo(best)) + ' ' + k(best.net) : '') + '</span></div>';
    h += '<div class="bz2-ch" style="--z:' + z + 'px">' + L.map(m => { const cur = m === mtd, n = m.net || 0, px = Math.max(n ? 3 : 0, Math.round(Math.abs(n) / span * usable));
      const tip = esc(m.m + ' · sales ' + hmPeso(m.sales || 0) + ' · costs ' + hmPeso(m.costs || 0) + ' · profit ' + hmPeso(n) + (cur && proj ? ' · sales pace ' + hmPeso(proj) : ''));
      const lab = '<b class="' + (n < 0 ? 'neg' : '') + '" style="' + (n >= 0 ? 'top:' + (z - px - 15) + 'px' : 'top:' + (z + px + 2) + 'px') + '">' + (cur ? 'so far ' : '') + k(n) + '</b>';
      return '<div class="bz2-c ' + (cur ? 'cur' : '') + (m === best ? ' best' : '') + '" title="' + tip + '">' + (n >= 0 ? '<i class="p" style="height:' + px + 'px"></i>' : '<i class="n" style="height:' + px + 'px"></i>') + lab + '<span>' + esc(mo(m)) + '</span></div>'; }).join('') + '</div>';
    if(Y.length) h += '<div class="bz2-y">' + yr + ' so far · sales <b>' + hmPeso(Y.reduce((a, m) => a + (m.sales || 0), 0)) + '</b> · profit <b>' + hmPeso(Y.reduce((a, m) => a + (m.net || 0), 0)) + '</b></div>';
    return h; };
  /* Last week moves under Quality (right column), so the page ends sooner */
  const rh = window.renderHome; window.renderHome = function(){ const r = rh.apply(this, arguments);
    try{ const box = document.querySelector('#v-home .ovc'), two = box && box.querySelector('.ov-two'), ws = box && box.querySelector(':scope > section.ov-card');
      if(two && ws && two.children.length >= 2 && !two.querySelector('.ov-side')){ const side = document.createElement('div'); side.className = 'ov-side'; const q = two.children[1]; two.insertBefore(side, q); side.appendChild(q); side.appendChild(ws); }
      else if(two && ws && two.children.length === 1){ two.appendChild(ws); } }catch(e){}
    return r; };
  try{ if(typeof VIEW !== 'undefined' && VIEW === 'home') renderHome(); }catch(e){}
})();
