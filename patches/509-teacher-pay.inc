/* 21 Oct · 509 · Teacher Pay, final polish in the same visual language (Misty: "LET US DO ALL NOW … Pay").
   · Rank moves into the header as one line (rank · rate · lifetime units · since), no separate Rank box.
   · The month chart is the history at a glance (tap a month for its payslip); the table of months folds under it as
     "All months" (one tap), so the same numbers are not shown twice.
   · Bonuses & deductions: a + or − symbol in green or coral, the day written out ("12 Oct"), amount on the right.
   · No box around the whole page; the cards sit on the page like the other teacher screens. Nothing removed. */
(function(){
  const css = document.createElement('style'); css.textContent = `
body:not(.mgr) #v-pay{background:none!important;border:0!important;box-shadow:none!important;padding-left:0!important;padding-right:0!important}
#v-pay .rk509{display:flex;flex-wrap:wrap;align-items:center;gap:6px 10px;margin-top:8px;font-size:13px;color:#6B6884}
#v-pay .rk509 b{display:inline-flex;align-items:center;gap:6px;padding:3px 10px;border-radius:999px;background:#F0EDFA;color:#5B4A9E;font-size:12.5px}
#v-pay .rk509 b svg{width:14px;height:14px}
#v-pay .pm70{border-radius:18px;border:1px solid rgba(43,34,83,.07);box-shadow:0 1px 2px rgba(43,34,83,.04),0 10px 28px -16px rgba(43,34,83,.16)}
#v-pay .pm70 .cs,#v-pay .pm70 .ax{justify-content:space-around}
#v-pay .pm70 .cs>div,#v-pay .pm70 .ax span{max-width:84px}
#v-pay .pm70 .cs i{border-radius:8px 8px 3px 3px}
#v-pay details.hs509{margin-top:12px;background:#fff;border:1px solid rgba(43,34,83,.07);border-radius:18px;box-shadow:0 1px 2px rgba(43,34,83,.04),0 10px 28px -18px rgba(43,34,83,.14);padding:0 16px}
#v-pay details.hs509>summary{list-style:none;cursor:pointer;display:flex;align-items:center;gap:8px;padding:13px 0;font-weight:700;color:#2B2253;font-size:14.5px}
#v-pay details.hs509>summary::-webkit-details-marker{display:none}
#v-pay details.hs509>summary span{font-weight:400;font-size:13px;color:#8A87A0}
#v-pay details.hs509>summary:after{content:'›';margin-left:auto;color:#8A87A0;font-size:18px;transition:transform .15s}
#v-pay details.hs509[open]>summary:after{transform:rotate(90deg)}
#v-pay details.hs509>div{padding-bottom:12px}
#v-pay details.hs509 table{margin:0}
#v-pay .bd509{background:#fff;border:1px solid rgba(43,34,83,.07);border-radius:18px;box-shadow:0 1px 2px rgba(43,34,83,.04),0 10px 28px -18px rgba(43,34,83,.14);padding:4px 14px}
#v-pay .bd509 .li{align-items:center;gap:12px;padding:11px 0;border-radius:0}
#v-pay .bd509 .li+.li{border-top:1px solid #F1F0F5}
#v-pay .bd509 .sg{flex:none;width:32px;height:32px;border-radius:10px;display:grid;place-items:center;font-weight:700;font-size:17px}
#v-pay .bd509 .sg.p{background:#E8F5EF;color:#1E7A55}#v-pay .bd509 .sg.m{background:#FCEDE8;color:#C0533F}`;
  document.head.appendChild(css);
  const IC = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="9" r="5.5"/><path d="M8.5 13.5 7 21l5-2.5 5 2.5-1.5-7.5"/></svg>';
  const day = s => { const m = String(s || '').match(/^(\d{4})-(\d{2})-(\d{2})/); if(!m) return s; return new Date(+m[1], +m[2] - 1, +m[3]).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }); };
  function polish(){ const v = $('v-pay'); if(!v || !D || D.mgr || !D.me) return; const me = D.me, H = [...v.querySelectorAll('h2')];
    /* rank → header line */
    const hr = H.find(x => /^Rank/.test(x.textContent.trim())), lead = v.querySelector('.lead');
    if(lead && !lead.querySelector('.rk509') && me.rank){ const since = me.rankDate ? (() => { const m = String(me.rankDate).match(/^(\d{4})-(\d{2})/); return m ? new Date(+m[1], +m[2] - 1, 1).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }) : me.rankDate; })() : '';
      lead.insertAdjacentHTML('beforeend', `<div class="rk509"><b>${IC}${esc(me.rank)}</b><span>${esc(peso(me.rate))}/lesson</span><span>· ${(me.lifetime || 0).toLocaleString()} lifetime units</span>${since ? `<span>· since ${esc(since)}</span>` : ''}</div>`); }
    if(hr){ const c = hr.nextElementSibling; if(c && c.classList.contains('card')) c.remove(); hr.remove(); }
    /* history table → fold under the chart */
    const hh = H.find(x => /^History/.test(x.textContent.trim()));
    if(hh && !v.querySelector('details.hs509')){ const tb = hh.nextElementSibling;
      if(tb && tb.tagName === 'TABLE'){ const n = [...tb.querySelectorAll('tr')].filter(r => r.querySelector('td') && r.style.display !== 'none').length, det = document.createElement('details'); det.className = 'hs509';
        det.innerHTML = `<summary>All months <span>· ${n} · units, net and when it was paid</span></summary><div></div>`; const box = det.lastElementChild;
        let x = tb; const move = [x]; let nx = tb.nextElementSibling; if(nx && nx.tagName === 'DIV' && /estimate at the top/.test(nx.textContent)) move.push(nx);
        tb.before(det); move.forEach(m => box.appendChild(m)); hh.remove(); }
      else if(tb && /empty/.test(tb.className)){ hh.textContent = 'Pay by month'; } }
    /* bonuses & deductions */
    const hb = [...v.querySelectorAll('h2')].find(x => /^Bonuses/.test(x.textContent.trim()));
    if(hb && !v.querySelector('.bd509')){ const L = []; let n = hb.nextElementSibling; while(n && n.classList.contains('li')){ L.push(n); n = n.nextElementSibling; }
      if(L.length){ const box = document.createElement('div'); box.className = 'bd509'; hb.after(box);
        L.forEach(li => { const amt = li.querySelector('b.num'), plus = amt && amt.classList.contains('plus'); li.insertAdjacentHTML('afterbegin', `<span class="sg ${plus ? 'p' : 'm'}">${plus ? '+' : '−'}</span>`);
          const sm = li.querySelector('.grow .small.mute'); if(sm && sm.firstChild && sm.firstChild.nodeType === 3) sm.firstChild.textContent = sm.firstChild.textContent.replace(/^\d{4}-\d{2}-\d{2}/, m => day(m)); box.appendChild(li); }); } } }
  const _a = window.renderPay; if(_a) window.renderPay = renderPay = function(){ const r = _a.apply(this, arguments); try{ polish(); }catch(e){ console.warn('pay 509', e); } return r; };
  try{ if(typeof VIEW !== 'undefined' && VIEW === 'pay') renderPay(); }catch(e){}
})();
