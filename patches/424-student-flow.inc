/* 20 Oct · 424 · Overview › "Student flow" (Misty: trial performance, renewals, stopped, with % and arrows).
   Last full month vs the month before, as four tiles with ▲/▼: Trials · Trial → enrolled % · Renewals · Stopped,
   plus a 6-month chart: new students and renewals above the line, stopped below, net growth written on each month.
   This month so far is shown dashed. Data: DATABASE copy (trial date, first class, renewal date, ended class) via coe-trials v6.
   Also: every number bubble in the menu is the same calm teal (teachers' "Students" too). */
(function(){
  const css = document.createElement('style');
  css.textContent = `
nav .dot,#navIn .dot{background:#3FA3A9!important;color:#fff!important;box-shadow:none!important;border-radius:999px!important;font-weight:700!important}
#dMsg.many{background:#3FA3A9!important}
.ovc .sf24{background:#fff;border:1px solid var(--line);border-radius:var(--r-lg);box-shadow:var(--sh1);padding:16px 18px;display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.15fr);gap:18px;align-items:stretch}
.ovc .sf24 .h{grid-column:1/-1;display:flex;justify-content:space-between;align-items:baseline}
.ovc .sf24 .h b{font-size:15px;color:var(--ink)}.ovc .sf24 .h span{font-size:12px;color:#8A86A0}
.ovc .sf24 .sft{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
.ovc .sf24 .sfi{background:var(--soft);border-radius:var(--r-md);padding:11px 13px;cursor:pointer}
.ovc .sf24 .sfi span{display:block;font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:#8A86A0}
.ovc .sf24 .sfi b{display:flex;align-items:baseline;gap:8px;font-family:var(--brand);font-weight:400;font-size:26px;color:var(--ink);line-height:1.2}
.ovc .sf24 .sfi em{font-family:var(--f);font-style:normal;font-size:12.5px;font-weight:700}
.ovc .sf24 .sfi em.up{color:#1C7A55}.ovc .sf24 .sfi em.dn{color:#B4442F}.ovc .sf24 .sfi em.eq{color:#8A86A0}
.ovc .sf24 .sfi small{display:block;font-size:12px;color:#6F6B85}
.ovc .sf24 .ch{position:relative;display:flex;gap:8px;align-items:stretch;height:170px;padding:0 4px}
.ovc .sf24 .ch:before{content:'';position:absolute;left:0;right:0;top:var(--z);border-top:1px solid #D6D3E0}
.ovc .sf24 .m{flex:1;position:relative;min-width:0}
.ovc .sf24 .m i{position:absolute;left:14%;right:14%}
.ovc .sf24 .m i.n{background:#00A3AD;border-radius:4px 4px 0 0}
.ovc .sf24 .m i.r{background:#6C5FC7}
.ovc .sf24 .m i.s{background:#D4705A;border-radius:0 0 4px 4px}
.ovc .sf24 .m.cur i{opacity:.45}
.ovc .sf24 .m b{position:absolute;left:-4px;right:-4px;text-align:center;font-size:11.5px;font-weight:700;color:var(--ink)}
.ovc .sf24 .m b.neg{color:#B4442F}
.ovc .sf24 .m span{position:absolute;bottom:0;left:0;right:0;text-align:center;font-size:11px;color:#8A86A0}
.ovc .sf24 .k{display:flex;gap:14px;flex-wrap:wrap;font-size:11.5px;color:#6F6B85;margin-top:6px}
.ovc .sf24 .k span{display:inline-flex;align-items:center;gap:5px}.ovc .sf24 .k i{width:9px;height:9px;border-radius:2px;display:inline-block}
@media(max-width:1000px){.ovc .sf24{grid-template-columns:1fr}}`;
  document.head.appendChild(css);
  let OPS = null, AT0 = 0, busy = 0;
  async function load(){ if(busy || Date.now() - AT0 < 10 * 6e4) return; busy = 1; AT0 = Date.now();
    try{ const r = await fetch(FAST_URL + '-trials', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ token: TOKEN, ops: true }) }).then(x => x.json()); if(r && r.ok){ OPS = r; try{ localStorage.setItem('coe.ops24', JSON.stringify(r)); }catch(e){} if(VIEW === 'home') paint(); } }catch(e){} busy = 0; }
  try{ OPS = JSON.parse(localStorage.getItem('coe.ops24') || 'null'); }catch(e){}
  const mo = m => new Date(m + '-15').toLocaleDateString('en-US', { month: 'short' });
  const arrow = (a, b, good) => { if(b == null) return ''; const d = a - b; if(!d) return '<em class="eq">= ' + '</em>'; const up = d > 0, ok = good ? up : !up; return '<em class="' + (ok ? 'up' : 'dn') + '">' + (up ? '▲ ' : '▼ ') + Math.abs(d) + (good === null ? '' : '') + '</em>'; };
  function html(){ if(!OPS){ try{ OPS = JSON.parse(localStorage.getItem('coe.ops24') || 'null'); }catch(e){} } if(!OPS || !OPS.months) return ''; const M = OPS.months, cur = M[M.length - 1], last = M[M.length - 2], prev = M[M.length - 3];
    const pct = x => x.trials ? Math.round(x.conv / x.trials * 100) : 0;
    const dim = new Date(+cur.m.slice(0, 4), +cur.m.slice(5, 7), 0).getDate(), f = Math.min(1, (OPS.day || new Date().getDate()) / dim), pace = v => Math.round(v * f);
    const cmp = (a, b, good) => { const d = a - pace(b); if(!d) return '<em class="eq">on pace</em>'; const ok = good ? d > 0 : d < 0; return '<em class="' + (ok ? 'up' : 'dn') + '" title="compared with ' + mo(last.m) + ' at the same point of the month (' + pace(b) + ')">' + (d > 0 ? '▲ ' : '▼ ') + Math.abs(d) + '</em>'; };
    const pd = pct(cur) - pct(last);
    const tiles = '<div class="sft">' +
      '<div class="sfi" onclick="go(\'trials\')"><span>Trials · ' + mo(cur.m) + ' so far</span><b>' + cur.trials + cmp(cur.trials, last.trials, true) + '</b><small>' + mo(last.m) + ': ' + last.trials + ' · ' + mo(prev.m) + ': ' + prev.trials + '</small></div>' +
      '<div class="sfi" onclick="go(\'trials\')"><span>Trial → enrolled · ' + mo(cur.m) + '</span><b>' + pct(cur) + '%' + (pd ? '<em class="' + (pd > 0 ? 'up' : 'dn') + '">' + (pd > 0 ? '▲ ' : '▼ ') + Math.abs(pd) + ' pts</em>' : '') + '</b><small>' + cur.conv + ' of ' + cur.trials + ' · ' + mo(last.m) + ' ' + pct(last) + '%</small></div>' +
      '<div class="sfi" onclick="go(\'active\')"><span>Renewals · ' + mo(cur.m) + ' so far</span><b>' + cur.ren + cmp(cur.ren, last.ren, true) + '</b><small>' + mo(last.m) + ': ' + last.ren + ' · ' + mo(prev.m) + ': ' + prev.ren + '</small></div>' +
      '<div class="sfi" onclick="go(\'astudents\')"><span>Stopped · ' + mo(cur.m) + ' so far</span><b>' + cur.stop + cmp(cur.stop, last.stop, false) + '</b><small>' + mo(last.m) + ': ' + last.stop + ' · ' + mo(prev.m) + ': ' + prev.stop + '</small></div></div>';
    const S = M.slice(-6), up = Math.max(1, ...S.map(x => x.fresh + x.ren)), dn = Math.max(1, ...S.map(x => x.stop)), H = 170, top = 18, bot = 18, use = H - top - bot, z = top + Math.round(up / (up + dn) * use), px = v => Math.round(v / (up + dn) * use);
    const bars = S.map((x, i) => { const net = x.fresh + x.ren - x.stop, c = i === S.length - 1;
      return '<div class="m' + (c ? ' cur' : '') + '" title="' + mo(x.m) + (c ? ' (so far)' : '') + ' · new ' + x.fresh + ' · renewed ' + x.ren + ' · stopped ' + x.stop + '">' +
        '<i class="n" style="bottom:' + (H - z + px(x.ren)) + 'px;height:' + px(x.fresh) + 'px"></i><i class="r" style="bottom:' + (H - z) + 'px;height:' + px(x.ren) + 'px"></i><i class="s" style="top:' + z + 'px;height:' + px(x.stop) + 'px"></i>' +
        '<b class="' + (net < 0 ? 'neg' : '') + '" style="top:' + (z - px(x.fresh + x.ren) - 16) + 'px">' + (net > 0 ? '+' : '') + net + '</b><span>' + mo(x.m) + (c ? '*' : '') + '</span></div>'; }).join('');
    return '<section class="sf24"><div class="h"><b>Student flow</b><span>arrows compare with last month at the same day · * this month so far</span></div>' + tiles +
      '<div><div class="ch" style="--z:' + z + 'px">' + bars + '</div><div class="k"><span><i style="background:#00A3AD"></i>new students</span><span><i style="background:#6C5FC7"></i>renewed</span><span><i style="background:#D4705A"></i>stopped</span><span>number = net growth</span></div></div></section>'; }
  function paint(){ const box = document.querySelector('#v-home .ovc'); if(!box) return; const h = html(); let el = box.querySelector('.sf24');
    if(!h){ if(el) el.remove(); return; }
    if(el){ if(el.outerHTML !== h) el.outerHTML = h; return; }
    const g = box.querySelector('.x-grid'); if(g) g.insertAdjacentHTML('afterend', h); }
  const r0 = window.renderHome; window.renderHome = function(){ const r = r0.apply(this, arguments); try{ if(D && D.mgr && isPres()){ paint(); load(); } }catch(e){ console.warn('sf24', e); } return r; };
  try{ if(typeof VIEW !== 'undefined' && VIEW === 'home') renderHome(); }catch(e){}
})();
/* Messages from the menu with a number → straight to the unopened ones (one unopened → it opens at once). */
(function(){
  const g0 = window.go; if(!g0) return;
  window.go = function(v){ const was = typeof VIEW !== 'undefined' ? VIEW : ''; const r = g0.apply(this, arguments);
    try{ if(v === 'msgs' && was !== 'msgs' && D && D.mgr && MSG){ const U = (MSG.threads || []).filter(t => [t.root].concat(t.replies || []).some(x => msgNewM(x)));
      if(U.length === 1){ setTimeout(() => msgOpen(U[0].root.id), 60); }
      else if(U.length > 1 && window.msg23Only && !document.querySelector('#v-msgs .ib22.only23')) setTimeout(() => { window.MSF = 'all'; msg23Only(); }, 30); } }catch(e){}
    return r; };
})();
