/* 20 Oct · 453 · Growth & timeline, visual (Misty: "also the design and visual of this"). Same data, nothing removed.
   · Number tiles: a coloured label edge; every % is coloured by strength (green 90+ · amber 75–89 · coral below) with a thin bar.
   · Class record: the six tiles in one row on a laptop.
   · Career path: each rank in its own colour (done = light, you are here = filled, next = dashed in its colour).
   · Teaching timeline: recognitions after the first two fold into one line ("★ 7 more recognitions"), dates read "4 Oct 2026".
   · Recognition: a small month-by-month column chart, then compact chips (date · note on hover).
   · Peer feedback: each score out of 25 gets a bar; long comments show 3 lines, click to read all.
   · Class visits: a summary on top (each area: how many visits said Needs work / OK / Strong); chips in calm colours
     (OK teal, Needs work coral, Strong green). */
(function(){
  const css = document.createElement('style');
  css.textContent = `
.gr-kpi .stat{border-left:4px solid var(--c53,#00A3AD)!important;padding:10px 14px!important;min-height:0!important}
.gr-kpi .stat:before,.gr-kpi .stat:after{display:none!important}
.gr-kpi .stat:nth-child(4n+1){--c53:#00A3AD}.gr-kpi .stat:nth-child(4n+2){--c53:#6C5FC7}.gr-kpi .stat:nth-child(4n+3){--c53:#D9962B}.gr-kpi .stat:nth-child(4n+4){--c53:#3B82B5}
.gr-kpi .stat b.num{font-size:24px!important}
.gr-kpi .stat .b53{display:block;height:5px;border-radius:3px;background:var(--soft);margin:6px 0 2px;overflow:hidden}
.gr-kpi .stat .b53 i{display:block;height:100%;border-radius:3px}
.p53g{color:#1E8A5E!important}.p53a{color:#B07A10!important}.p53c{color:#C0563F!important}
section.sec .gr-kpi{grid-template-columns:repeat(auto-fit,minmax(150px,1fr))!important}
.py-wrap .py-t{background:var(--rb)!important;color:var(--rt)!important;border:1.5px solid transparent!important}
.py-wrap .py-t.lock{background:#F7F6FA!important;color:#B4B1C4!important}
.py-wrap .py-t.cur{background:var(--rc)!important;color:#fff!important;box-shadow:0 6px 16px color-mix(in srgb,var(--rc) 35%,transparent)!important}
.py-wrap .py-t.next{background:#fff!important;border:1.5px dashed var(--rc)!important;color:var(--rt)!important}
.py-wrap .py-bar i{background:var(--rc53,#00A3AD)!important}
.ctl .tl-more{cursor:pointer}
.ctl .tl-more b{color:#B07A10}
.rc53{display:flex;align-items:flex-end;gap:8px;height:74px;margin:6px 0 10px}
.rc53>div{flex:0 0 42px;position:relative;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;height:100%}
.rc53 i{display:block;width:26px;border-radius:4px 4px 0 0;background:#E0A030}
.rc53 b{font-size:11px;color:var(--ink);margin-bottom:2px}
.rc53 span{font-size:10.5px;color:#8A86A0;margin-top:3px}
.rg53{display:flex;flex-wrap:wrap;gap:6px}
.rg53 span{display:inline-flex;align-items:center;gap:6px;padding:4px 11px;border-radius:999px;background:#FFF6E3;color:#7A5A10;font-size:12.5px}
.rg53 span b{font-weight:700}
.pr-sc>div .b53{display:block;height:5px;border-radius:3px;background:#E9E7F1;margin:6px auto 0;width:80%;overflow:hidden}
.pr-sc>div .b53 i{display:block;height:100%;border-radius:3px}
.gr-text.cl53{display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;cursor:pointer;position:relative}
.gr-text.cl53:after{content:'read more ›';position:absolute;right:0;bottom:0;background:linear-gradient(90deg,transparent,#fff 40%);padding-left:30px;color:#2F6F77;font-weight:700;font-size:12px}
.vs53{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:8px;margin:8px 0 6px}
.vs53>div{border:1px solid var(--line);border-radius:12px;padding:8px 12px;background:#fff}
.vs53>div b{font-size:13px;color:var(--ink)}
.vs53 .br{display:flex;height:8px;gap:2px;margin:6px 0 3px;border-radius:4px;overflow:hidden}
.vs53 .br i{display:block}
.vs53 small{font-size:11.5px;color:#8A86A0}`;
  document.head.appendChild(css);
  const RK = [[/master/i, '#3F347E', '#EEEBFA', '#6C5FC7'], [/senior/i, '#00666D', '#E1F4F5', '#00A3AD'], [/junior/i, '#1F5E87', '#E5F0F8', '#3B82B5'], [/newly qualified/i, '#1C6B4C', '#E3F4EC', '#2E9E6F'], [/newly hired/i, '#4C5E73', '#EEF1F5', '#8FA3B8'], [/starting/i, '#8A5A00', '#FFF4DE', '#D9962B'], [/./, '#4C4868', '#F1F2F6', '#9A98A8']];
  const MN = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const cls = p => p >= 90 ? 'p53g' : p >= 75 ? 'p53a' : 'p53c', col = p => p >= 90 ? '#2E9E6F' : p >= 75 ? '#E0A030' : '#D4705A';
  const pd = s => { s = String(s || '').trim(); let m = s.match(/^(\d{1,2})-([A-Za-z]{3})-(\d{4})/); if(m) return new Date(+m[3], MN.indexOf(m[2]), +m[1]); m = s.match(/^(\d{4})-(\d{2})-(\d{2})/); if(m) return new Date(+m[1], +m[2] - 1, +m[3]); return null; };
  const nice = s => String(s || '').replace(/^(\d{1,2})-([A-Za-z]{3})-(\d{4})/, '$1 $2 $3');
  function run(root){ if(!root || !root.querySelector('.gr-kpi, .ctl, .py-wrap')) return;
    /* tiles */
    root.querySelectorAll('.gr-kpi .stat').forEach(s => { if(s.dataset.g53) return; s.dataset.g53 = 1; const b = s.querySelector('b.num'); if(!b) return; const m = b.textContent.trim().match(/^(\d+)%$/); if(!m) return; const p = +m[1];
      b.classList.add(cls(p)); b.insertAdjacentHTML('afterend', '<span class="b53"><i style="width:' + p + '%;background:' + col(p) + '"></i></span>'); });
    /* career colours */
    root.querySelectorAll('.py-wrap .py-t').forEach(t => { if(t.dataset.g53) return; t.dataset.g53 = 1; const b = t.querySelector('b'); const k = RK.find(z => z[0].test(b ? b.textContent : '')) || RK[RK.length - 1];
      t.style.setProperty('--rt', k[1]); t.style.setProperty('--rb', k[2]); t.style.setProperty('--rc', k[3]); if(t.classList.contains('next')) { const w = t.closest('.py-wrap'); if(w) w.style.setProperty('--rc53', k[3]); } });
    /* timeline */
    root.querySelectorAll('.ctl').forEach(c => { if(c.dataset.g53) return; c.dataset.g53 = 1; c.querySelectorAll('.tl-i .small.mute').forEach(x => x.textContent = nice(x.textContent));
      const P = [...c.querySelectorAll('.tl-i.praise')]; if(P.length > 3){ const rest = P.slice(2), last = rest[rest.length - 1].querySelector('.small.mute');
        const d = document.createElement('div'); d.className = 'tl-i praise tl-more'; d.innerHTML = '<span class="tl-dot">♥</span><div><div class="small mute">since ' + esc(last ? last.textContent : '') + '</div><b>' + rest.length + ' more recognitions</b><div class="small" style="color:#2F6F77">show all ›</div></div>';
        rest[0].before(d); rest.forEach(x => x.style.display = 'none'); d.onclick = () => { rest.forEach(x => x.style.display = ''); d.remove(); }; } });
    /* recognition */
    root.querySelectorAll('section.gr-good').forEach(s => { const h = s.querySelector('h2'); if(!h || !/^Recognition/.test(h.textContent.trim()) || s.dataset.g53) return; s.dataset.g53 = 1;
      const R = [...s.querySelectorAll('.gr-pr')].map(r => ({ el: r, t: (r.querySelector('b') || {}).textContent || '', n: (r.querySelector('.small:not(.mute)') || {}).textContent || '', w: (r.querySelector('.small.mute') || {}).textContent || '' })); if(!R.length) return;
      const by = {}; R.forEach(x => { const d = pd(x.w); if(d){ const k = d.getFullYear() * 12 + d.getMonth(); by[k] = (by[k] || 0) + 1; } }); const ks = Object.keys(by).map(Number);
      let chart = ''; if(ks.length){ const hi = Math.max(...ks), lo = Math.max(Math.min(...ks), hi - 5), mx = Math.max(...Object.values(by)); for(let k = lo; k <= hi; k++) chart += '<div><b>' + (by[k] || '') + '</b><i style="height:' + ((by[k] || 0) / mx * 40) + 'px"></i><span>' + MN[k % 12] + '</span></div>'; chart = '<div class="rc53">' + chart + '</div>'; }
      const same = R.every(x => x.t === R[0].t && !x.n);
      const chips = '<div class="rg53">' + R.map(x => { const d = pd(x.w); return '<span title="' + esc(x.t + (x.n ? ' · ' + x.n : '') + ' · ' + x.w) + '">★ ' + (same ? '' : '<b>' + esc(x.t) + '</b> · ') + esc(d ? d.getDate() + ' ' + MN[d.getMonth()] : x.w) + '</span>'; }).join('') + '</div>' + R.filter(x => x.n).map(x => '<div class="small" style="margin-top:6px"><b>' + esc(x.t) + '</b> · ' + esc(x.n) + '</div>').join('');
      R.forEach(x => x.el.remove()); h.insertAdjacentHTML('afterend', (same ? '<div class="small mute">' + esc(R[0].t) + ' · by month</div>' : '') + chart + chips); });
    /* peer */
    root.querySelectorAll('.pr-sc>div').forEach(d => { if(d.dataset.g53) return; d.dataset.g53 = 1; const v = parseFloat((d.querySelector('b') || {}).textContent); if(isNaN(v)) return; const p = Math.round(v / 25 * 100); d.insertAdjacentHTML('beforeend', '<span class="b53"><i style="width:' + p + '%;background:' + (p >= 80 ? '#2E9E6F' : p >= 60 ? '#E0A030' : '#D4705A') + '"></i></span>'); });
    root.querySelectorAll('details.fbold .gr-text.small').forEach(t => { if(t.dataset.g53) return; t.dataset.g53 = 1; if(t.textContent.length < 260) return; t.classList.add('cl53'); t.onclick = () => t.classList.remove('cl53'); });
    /* visits */
    root.querySelectorAll('section.sec').forEach(s => { const h = s.querySelector('h2'); if(!h || !/^Class visits/.test(h.textContent.trim()) || s.dataset.g53) return; s.dataset.g53 = 1;
      const A = {}; s.querySelectorAll('.gx-goal .chip').forEach(c => { const m = c.textContent.match(/^(\w+)\s*·\s*(.+)$/); if(!m) return; const lvl = /Needs/.test(m[2]) ? 'n' : /Strong|Great|Excellent/i.test(m[2]) ? 's' : 'o';
        const o = A[m[1]] = A[m[1]] || { n: 0, o: 0, s: 0 }; o[lvl]++; const cc = lvl === 'n' ? '#C0563F' : lvl === 's' ? '#1E8A5E' : '#2F7F86'; c.style.borderColor = cc; c.style.color = cc; });
      const K = Object.keys(A); if(!K.length) return; const box = '<div class="vs53">' + K.map(k => { const o = A[k], t = o.n + o.o + o.s; return '<div><b>' + esc(k) + '</b><div class="br">' + (o.s ? '<i style="flex:' + o.s + ';background:#2E9E6F"></i>' : '') + (o.o ? '<i style="flex:' + o.o + ';background:#7FC4C8"></i>' : '') + (o.n ? '<i style="flex:' + o.n + ';background:#D4705A"></i>' : '') + '</div><small>' + (o.n ? '<b style="color:#C0563F">' + o.n + ' needs work</b> · ' : '') + t + ' visit' + (t === 1 ? '' : 's') + '</small></div>'; }).join('') + '</div>';
      h.insertAdjacentHTML('afterend', box); }); }
  let q = 0; new MutationObserver(() => { if(q) return; q = requestAnimationFrame(() => { q = 0; try{ run(document.getElementById('sheetBody')); run(document.getElementById('v-growth')); run(document.getElementById('v-qa')); }catch(e){ console.warn('g53', e); } }); }).observe(document.body, { childList: true, subtree: true });
})();
