/* 20 Oct · 452 · Performance, all of it (Misty: "go through all of it" · "I love the ladder, but make it even better").
   · Career ladder: each rank in its own colour (Master purple … Starting amber); the rate and units on the side; every teacher chip shows a
     thin bar of the way to the next rank (hover: units to go); an empty rank is a dashed outline.
   · New "QA by domain · team": the five domains as bars (team average of the latest evaluations, 1–5), weakest coloured coral, so training
     can target it; click a domain bar to see who scored lowest.
   · Teacher rows: about half as tall. Compliance becomes four mini-bars (On time · Video · HW · Notes) next to its %; the rank progress stays.
     The KPI numbers (on-time, feedback, homework) keep their place. */
(function(){
  const css = document.createElement('style');
  css.textContent = `
#v-perf .py{gap:6px!important}
#v-perf .py-t{background:var(--rb)!important;color:var(--rt)!important;border:1px solid transparent;flex-direction:row!important;justify-content:space-between!important;gap:12px;padding:8px 16px!important;text-align:left!important}
#v-perf .py-t.lock{background:#fff!important;border:1.5px dashed #DAD7E5;color:#A9A6BA!important}
#v-perf .py-t>b{font-size:14px!important;white-space:nowrap}
#v-perf .py-t>b em{font-style:normal;display:inline-grid;place-items:center;min-width:22px;height:22px;border-radius:11px;background:var(--rc);color:#fff;font-size:12px;margin-left:6px;padding:0 6px}
#v-perf .py-t.lock>b em{background:#DAD7E5}
#v-perf .py-t>span{order:3;white-space:nowrap;font-size:11.5px!important}
#v-perf .py-who{order:2;flex:1;justify-content:center!important;margin:0!important}
#v-perf .py-who a{position:relative;padding:3px 10px 5px!important;color:var(--rt)!important;overflow:hidden}
#v-perf .py-who a i{position:absolute;left:0;bottom:0;height:3px;background:var(--rc);border-radius:0 2px 2px 0;font-style:normal;margin:0!important}
#v-perf .dm52{background:#fff;border:1px solid var(--line);border-radius:var(--r-lg);box-shadow:var(--sh1);padding:12px 18px 10px;margin:12px 0}
#v-perf .dm52 .h{display:flex;justify-content:space-between;font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:#8A86A0;margin-bottom:8px}
#v-perf .dm52 .r{display:grid;grid-template-columns:200px minmax(0,1fr) 92px;gap:12px;align-items:center;height:26px;cursor:pointer;border-radius:8px;padding:0 4px}
#v-perf .dm52 .r:hover{background:#F6FAFA}
#v-perf .dm52 .r span{font-size:13px;color:var(--ink);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#v-perf .dm52 .r span em{font-style:normal;color:#8A86A0;margin-right:6px;font-weight:700}
#v-perf .dm52 .tr{position:relative;height:10px;border-radius:5px;background:var(--soft)}
#v-perf .dm52 .tr i{position:absolute;left:0;top:0;bottom:0;border-radius:5px}
#v-perf .dm52 .tr u{position:absolute;top:-4px;bottom:-4px;width:2px;background:#2B2253;left:80%;text-decoration:none}
#v-perf .dm52 .r b{text-align:right;font-size:13px}
#v-perf .dm52 .lw{font-size:12px;color:#55526E;padding:2px 4px 6px 216px}
#v-perf .pf-row{padding:8px 14px!important;margin-top:6px!important}
#v-perf .pf-row .av{width:34px!important;height:34px!important}
#v-perf .pf-name .small.mute{font-size:12px}
#v-perf .cp52{display:flex;align-items:center;gap:8px;margin-top:3px;flex-wrap:wrap}
#v-perf .cp52 .chip{font-size:11px!important;padding:1px 8px!important}
#v-perf .cp52 .mb{display:inline-flex;gap:3px;align-items:flex-end;height:16px}
#v-perf .cp52 .mb i{display:block;width:7px;border-radius:2px;background:var(--c)}
#v-perf .cp52 .mb i.e{background:#E4E2EC}
#v-perf .cp52 small{font-size:11px;color:#8A86A0}
#v-perf .pf-rk{margin-top:4px!important;display:inline-block;width:90px!important;vertical-align:middle}
#v-perf .pf-rk+.small.mute{display:inline;margin-left:8px;font-size:11.5px}
#v-perf .pf-k b{font-size:17px!important}#v-perf .pf-k span{font-size:11px!important;line-height:1.2}
#v-perf .pf-qa b.num{font-size:20px!important}
@media(max-width:820px){#v-perf .dm52 .r{grid-template-columns:120px minmax(0,1fr) 60px}#v-perf .dm52 .lw{padding-left:4px}}`;
  document.head.appendChild(css);
  const RK = [[/master/i, '#3F347E', '#EEEBFA', '#6C5FC7'], [/senior/i, '#00666D', '#E1F4F5', '#00A3AD'], [/junior/i, '#1F5E87', '#E5F0F8', '#3B82B5'], [/newly qualified/i, '#1C6B4C', '#E3F4EC', '#2E9E6F'], [/newly hired/i, '#4C5E73', '#EEF1F5', '#8FA3B8'], [/starting/i, '#8A5A00', '#FFF4DE', '#D9962B'], [/./, '#4C4868', '#F1F2F6', '#9A98A8']];
  let DOMSEL = -1;
  window.pf52 = function(i){ DOMSEL = DOMSEL === i ? -1 : i; renderPerf(); };
  function paint(){ const v = $('v-perf'); if(!v || typeof PF === 'undefined' || !PF) return; const T = PF.teachers || [];
    /* ladder */
    v.querySelectorAll('.py-t').forEach(t => { if(t.dataset.p52) return; t.dataset.p52 = 1; const b = t.querySelector(':scope>b'); if(!b) return; const m = b.textContent.match(/^(.*?)\s*·\s*(\d+)\s*$/); const nm = m ? m[1] : b.textContent;
      const k = RK.find(z => z[0].test(nm)) || RK[RK.length - 1]; t.style.setProperty('--rt', k[1]); t.style.setProperty('--rb', k[2]); t.style.setProperty('--rc', k[3]);
      if(m) b.innerHTML = esc(m[1]) + '<em>' + m[2] + '</em>';
      t.querySelectorAll('.py-who a').forEach(a => { const tt = T.find(x => x.name === a.textContent.trim()); if(tt && tt.next && tt.next.pct != null) a.insertAdjacentHTML('beforeend', '<i style="width:' + Math.max(4, Math.min(100, tt.next.pct)) + '%"></i>'); }); });
    /* domains */
    if(!v.querySelector('.dm52')){ const E = T.filter(t => t.latest && t.latest.scores); const D = PF.domains || [];
      if(E.length >= 2 && D.length){ const av = D.map((_, i) => { const s = E.map(t => +t.latest.scores[i]).filter(x => x > 0); return s.length ? s.reduce((a, b) => a + b, 0) / s.length : null; });
        const lo = Math.min(...av.filter(x => x != null)), R = ['I', 'II', 'III', 'IV', 'V'];
        const h = '<section class="dm52"><div class="h"><span>QA by domain · team · latest evaluations (' + E.length + ')</span><span>line = 4 of 5 · click a domain for who scored lowest</span></div>' +
          D.map((d, i) => { const a = av[i]; if(a == null) return ''; const c = a === lo ? '#D4705A' : a >= 4 ? '#2E9E6F' : '#00A3AD';
            let low = ''; if(DOMSEL === i){ const L = E.map(t => ({ n: t.name, s: +t.latest.scores[i] })).filter(x => x.s).sort((a, b) => a.s - b.s).slice(0, 5); low = '<div class="lw">Lowest: ' + L.map(x => '<b>' + esc(x.n) + '</b> ' + x.s).join(' · ') + '</div>'; }
            return '<div class="r" onclick="pf52(' + i + ')"><span><em>' + R[i] + '</em>' + esc(d) + '</span><div class="tr"><i style="width:' + (a / 5 * 100) + '%;background:' + c + '"></i><u></u></div><b style="color:' + c + '">' + a.toFixed(1) + (a === lo ? ' · weakest' : '') + '</b></div>' + low; }).join('') + '</section>';
        const hero = v.querySelector('.gr-hero'); if(hero) hero.insertAdjacentHTML('afterend', h); } }
    /* rows: compliance mini-bars */
    v.querySelectorAll('.pf-row .pf-name').forEach(n => { if(n.dataset.p52) return; n.dataset.p52 = 1; const line = [...n.querySelectorAll('.small')].find(s => s.querySelector('.chip') && /On time/.test(s.textContent)); if(!line) return;
      const chip = line.querySelector('.chip'), get = k => { const m = line.textContent.match(new RegExp(k + '\\s*(\\d+|—)%?')); return m && m[1] !== '—' ? +m[1] : null; };
      const P = [['On time', get('On time')], ['Video', get('Video')], ['HW', get('HW')], ['Notes', get('Notes')]], tag = (line.textContent.match(/(\d+) late tag/) || [])[1];
      const bar = P.map(([l, x]) => x == null ? '<i class="e" style="height:4px" title="' + l + ' —"></i>' : '<i title="' + l + ' ' + x + '%" style="height:' + Math.max(3, x / 100 * 16) + 'px;--c:' + (x >= 90 ? '#2E9E6F' : x >= 75 ? '#E0A030' : '#D4705A') + '"></i>').join('');
      line.outerHTML = '<div class="cp52">' + chip.outerHTML + '<span class="mb" title="' + P.map(([l, x]) => l + ' ' + (x == null ? '—' : x + '%')).join(' · ') + '">' + bar + '</span>' + (() => { const lo = P.filter(([l, x]) => x != null && x < 90); return lo.length || tag ? '<small>below 90%: ' + lo.map(([l, x]) => l + ' ' + x).join(' · ') + (tag ? (lo.length ? ' · ' : '') + '<b style="color:#C0563F">' + tag + ' late tag</b>' : '') + '</small>' : '<small style="color:#1E8A5E">all 90%+</small>'; })() + '</div>'; }); }
  const _r = window.renderPerf; if(_r) window.renderPerf = function(){ const r = _r.apply(this, arguments); try{ paint(); }catch(e){ console.warn('pf52', e); } return r; };
  try{ if(typeof VIEW !== 'undefined' && VIEW === 'perf') renderPerf(); }catch(e){}
})();
