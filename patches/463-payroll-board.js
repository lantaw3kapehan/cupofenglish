// 20 Oct · Payroll as one board: summary and 12-month chart side by side; click a month column to open that month; history shows 4 months, the rest folded.
require('../tools/lib.js')(process.argv[2], [["\n</script>\n\n</body>", "\n</script>\n<script>\n" + `/* 20 Oct · 463 · Misty: "I am still unsatisfied with the visual and design of the Payroll screen".
   · On a laptop the summary card and the 12-month chart sit side by side as one board (less scrolling, the trend next to the total).
   · The chart columns are clickable: the month opens in Payroll history and scrolls into view.
   · Insights row: where the money goes (lessons · base · bonus · deductions & gov), cost per class, top 3 earners' share, biggest rise and drop vs the month before.
   · Payroll history shows the latest 4 months; "Show 8 more months" opens the rest. */
(function(){
  const css = document.createElement('style');
  css.textContent = \`
@media(min-width:1000px){
#v-payroll .bd63{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.15fr);gap:14px;align-items:stretch;margin-bottom:6px}
#v-payroll .bd63>.py-hero,#v-payroll .bd63>.pm60{margin:0!important}
#v-payroll .bd63 .py-3{grid-template-columns:1fr!important;gap:8px!important}
#v-payroll .bd63 .py-3>div{display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:baseline;column-gap:10px;padding:7px 12px!important}
#v-payroll .bd63 .py-3>div span{grid-column:1/-1}
#v-payroll .bd63 .py-3 b{margin:0!important;font-size:19px!important}
#v-payroll .bd63 .py-3 small{margin:0!important;text-align:right}
#v-payroll .bd63 .pm60{display:flex;flex-direction:column}
#v-payroll .bd63 .pm60 .cs{flex:1;height:auto!important;min-height:170px}
}
#v-payroll .pm60 .cs>div{cursor:pointer}
#v-payroll .pm60 .cs>div:hover i{filter:brightness(1.08);outline:2px solid #2B2253;outline-offset:1px}
#v-payroll .in63{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;margin:12px 0 4px}
#v-payroll .in63>div{background:#fff;border:1px solid var(--line);border-radius:14px;padding:10px 14px;min-width:0}
#v-payroll .in63 em{display:block;font-style:normal;font-size:10.5px;letter-spacing:.08em;text-transform:uppercase;color:var(--c);font-weight:700}
#v-payroll .in63 b{display:block;font-family:var(--brand);font-weight:400;font-size:22px;color:var(--ink);line-height:1.2;margin-top:2px}
#v-payroll .in63 small{display:block;font-size:12px;color:#55526E;margin-top:2px}
#v-payroll .in63 .sb{display:flex;height:10px;border-radius:5px;overflow:hidden;gap:2px;margin:6px 0 4px}
#v-payroll .in63 .sb i{display:block}
#v-payroll .in63 .kk{display:flex;flex-wrap:wrap;gap:2px 10px;font-size:11px;color:#55526E}
#v-payroll .in63 .kk i{display:inline-block;width:8px;height:8px;border-radius:2px;margin-right:4px}
@media(max-width:900px){#v-payroll .in63{grid-template-columns:1fr 1fr}}
#v-payroll .mo63{all:unset;cursor:pointer;display:block;text-align:center;font-size:13px;font-weight:700;color:#2F6F77;padding:10px;margin-top:6px;border:1px dashed var(--line);border-radius:12px}
#v-payroll details.py-h.fl63{animation:fl63 1.2s ease}
@keyframes fl63{0%{box-shadow:0 0 0 3px #00A3AD}100%{box-shadow:none}}\`;
  document.head.appendChild(css);
  const MN = ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'];
  const key = t => { const m = String(t || '').match(/([A-Za-z]{3})[a-z]*\\s+(\\d{4})/); return m ? m[2] + '-' + String(MN.indexOf(m[1].toLowerCase()) + 1).padStart(2, '0') : ''; };
  let MORE = false;
  const num = x => { const n = parseFloat(String(x == null ? '' : x).replace(/[^\\d.-]/g, '')); return isNaN(n) ? 0 : n; };
  function insights(v){ if(v.querySelector('.in63')) return; const P = ((typeof MO !== 'undefined' && MO && MO.payroll) || []).filter(x => x && x.net != null); if(!P.length) return; const bd = v.querySelector('.bd63') || v.querySelector('.py-hero'); if(!bd) return;
    const S = k => P.reduce((a, x) => a + num(x[k]), 0), lp = S('lessonPay'), base = S('base'), bon = S('bonus'), ded = S('deduct'), gov = S('gov'), net = S('net'), un = S('units'), gross = Math.max(1, lp + base + bon);
    const T = P.slice().sort((a, b) => num(b.net) - num(a.net)), top3 = T.slice(0, 3).reduce((a, x) => a + num(x.net), 0);
    let rise = null, drop = null; try{ if(typeof PL !== 'undefined' && PL && PL.rows){ const H = PL.head.map(h => String(h || '').trim().toUpperCase()), iN = H.indexOf('TEACHER NAME'), iM = H.indexOf('MONTH'), iNet = H.indexOf('NET SALARY'); const now = new Date();
        const k = o => { const d = new Date(now.getFullYear(), now.getMonth() - o, 1); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0'); }, ymk = x => { const t = String(x || ''); const m = t.match(/^(\\d{4})-(\\d{2})/); if(m) return m[1] + '-' + m[2]; const d = new Date(t); return isNaN(d) ? '' : d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0'); };
        const a = {}, b = {}; PL.rows.forEach(r => { const n = String(r[iN] || '').trim(), m = ymk(r[iM]); if(!n) return; if(m === k(1)) a[n] = (a[n] || 0) + num(r[iNet]); if(m === k(2)) b[n] = (b[n] || 0) + num(r[iNet]); });
        const D = Object.keys(a).filter(n => b[n]).map(n => ({ n, d: a[n] - b[n] })).sort((x, y) => y.d - x.d); if(D.length){ rise = D[0].d > 0 ? D[0] : null; drop = D[D.length - 1].d < 0 ? D[D.length - 1] : null; } } }catch(e){}
    const seg = (x, c) => x > 0 ? '<i style="flex:' + x + ';background:' + c + '"></i>' : '';
    const mo = esc((MO && MO.payMonth) || '');
    const h = '<div class="in63">' +
      '<div style="--c:#00A3AD"><em>Where the money goes · ' + mo + '</em><div class="sb">' + seg(lp, '#00A3AD') + seg(base, '#3B82B5') + seg(bon, '#2E9E6F') + seg(ded + gov, '#D4705A') + '</div><div class="kk"><span><i style="background:#00A3AD"></i>lessons ' + Math.round(lp / gross * 100) + '%</span>' + (base ? '<span><i style="background:#3B82B5"></i>base ' + Math.round(base / gross * 100) + '%</span>' : '') + '<span><i style="background:#2E9E6F"></i>bonus ' + peso(bon) + '</span><span><i style="background:#D4705A"></i>deductions & gov −' + peso(ded + gov) + '</span></div></div>' +
      '<div style="--c:#6C5FC7"><em>Cost per class</em><b>' + (un ? peso(Math.round(net / un)) : '—') + '</b><small>net pay ÷ ' + un + ' units · ' + peso(Math.round(net / P.length)) + ' per teacher</small></div>' +
      '<div style="--c:#D9962B"><em>Top 3 earners</em><b>' + Math.round(top3 / Math.max(1, net) * 100) + '%</b><small>' + T.slice(0, 3).map(x => esc(String(x.name).replace(/^teacher\\s+/i, ''))).join(' · ') + ' of all pay</small></div>' +
      '<div style="--c:#C2557A"><em>Biggest change vs month before</em>' + (rise ? '<small><b style="display:inline;font-size:16px;color:#1E8A5E">▲ ' + peso(rise.d) + '</b> ' + esc(rise.n) + '</small>' : '') + (drop ? '<small><b style="display:inline;font-size:16px;color:#C0563F">▼ ' + peso(-drop.d) + '</b> ' + esc(drop.n) + '</small>' : '') + (!rise && !drop ? '<small>Not enough history yet</small>' : '') + '</div></div>';
    bd.insertAdjacentHTML('afterend', h); }
  window.pay63 = function(k){ const D = [...document.querySelectorAll('#plList details.py-h')], d = D.find(x => key((x.querySelector('summary b') || {}).textContent) === k);
    if(!d){ toast('No payroll rows for that month'); return; } d.style.display = ''; d.open = true; d.classList.remove('fl63'); void d.offsetWidth; d.classList.add('fl63'); d.scrollIntoView({ behavior: 'smooth', block: 'start' }); };
  window.pay63More = function(){ MORE = true; run(); };
  function run(){ const v = document.getElementById('v-payroll'); if(!v) return;
    const hero = v.querySelector('.py-hero'), ch = v.querySelector('.pm60');
    if(hero && ch && !hero.parentElement.classList.contains('bd63')){ const w = document.createElement('div'); w.className = 'bd63'; hero.before(w); w.appendChild(hero); w.appendChild(ch); }
    if(ch && !ch.dataset.c63){ ch.dataset.c63 = 1; const now = new Date(), C = [...ch.querySelectorAll('.cs>div')], n = C.length;
      C.forEach((c, i) => { const d = new Date(now.getFullYear(), now.getMonth() - (n - 1 - i), 1), k = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0'); c.onclick = () => pay63(k); c.title += ' · click to open'; }); }
    if(ch && ch.parentElement.classList.contains('bd63')){ ch.querySelectorAll('.cs>div').forEach(c => { const i = c.querySelector('i'), b = c.querySelector('b'); if(!i || i.dataset.p63) return; const hp = parseFloat(i.style.height) || 0; i.dataset.p63 = 1; i.style.height = (hp * .85) + '%'; if(b) b.style.bottom = 'calc(' + (hp * .85) + '% + 3px)'; }); }
    insights(v);
    const box = document.getElementById('plList'); if(!box) return; const q = (document.getElementById('prq') || {}).value || '';
    const D = [...box.querySelectorAll(':scope > details.py-h')]; const old = box.querySelector('.mo63'); if(old) old.remove();
    D.forEach((d, i) => { d.style.display = q || MORE || i < 4 ? '' : 'none'; });
    if(!q && !MORE && D.length > 4) D[3].insertAdjacentHTML('afterend', '<button type="button" class="mo63" onclick="pay63More()">Show ' + (D.length - 4) + ' more months</button>'); }
  ['renderPayroll', 'payLedger', 'payFind'].forEach(f => { const o = window[f]; if(typeof o === 'function') window[f] = function(){ const r = o.apply(this, arguments); try{ run(); }catch(e){ console.warn('bd63', e); } return r; }; });
  try{ if(typeof VIEW !== 'undefined' && VIEW === 'payroll') renderPayroll(); }catch(e){}
})();
` + "</script>\n\n</body>"]]);
