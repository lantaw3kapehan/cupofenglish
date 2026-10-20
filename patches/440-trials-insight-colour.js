// 20 Oct · Trials results: no repeated numbers (the tiles under the period cards now give insights), % coloured by strength, calmer grey for "not enrolled".
require('../tools/lib.js')(process.argv[2], [["\n</script>\n\n</body>", "\n</script>\n<script>\n" + `/* 20 Oct · 440 · Misty: "is this the best visual and design, also colour?"
   · The four tiles under the period cards repeated the card above (638 · 404 63% · ▲ 26). They now answer new questions:
     enrol rate (vs the year before) · best teacher (15+ trials) · best level · busiest year or month.
   · Every % is coloured by strength: green 65%+, amber 50–64%, coral under 50%, so weak years, teachers and levels stand out.
   · "Not enrolled" parts of the bars are a calm grey instead of pale teal, so green (enrolled) is the only colour that speaks. */
(function(){
  const css = document.createElement('style');
  css.textContent = \`
#v-trials .at37 .cs i.o,#v-trials .ti33 .lv35 .cs i.o{background:#E4E2EC!important}
#v-trials .at37 .cs>div.cur i.o{background:#D6D3E2!important}
#v-trials .at37 .br i:last-child{background:#E4E2EC!important}
#v-trials .p40g{color:#1E8A5E!important}#v-trials .p40a{color:#B07A10!important}#v-trials .p40c{color:#C0563F!important}
#v-trials .at37 .kt i{font-style:normal;font-size:12px;font-weight:700;margin-left:6px}
#v-trials .at37 .kt b small{font-size:13px;color:#8A86A0;margin-left:2px}\`;
  document.head.appendChild(css);
  const cls = p => p >= 65 ? 'p40g' : p >= 50 ? 'p40a' : 'p40c';
  const pc = (a, b) => b ? Math.round(a / b * 100) : 0;
  function colour(root){ root.querySelectorAll('.at37 .ax em, .at37 .r>em b, .ti33 .lv35 .ax em, .pc38 .v em').forEach(e => { const m = e.textContent.match(/(\\d+)%/); if(!m) return; e.classList.remove('p40g', 'p40a', 'p40c'); e.classList.add(cls(+m[1])); }); }
  function tiles(box){ const kt = box.querySelector('.at37 .kt'); if(!kt || kt.dataset.t40) return; let A = null; try{ A = JSON.parse(localStorage.getItem('coe.tall') || 'null'); }catch(e){} if(!A || !A.list) return;
    const RG = (() => { try{ return localStorage.getItem('coe.trRange') || 'd45'; }catch(e){ return 'd45'; } })(), y0 = String(new Date().getFullYear()), ly = String(+y0 - 1);
    const L = A.list, R = RG === 'yr' ? L.filter(x => x.m.slice(0, 4) === y0) : L, n = R.length, e = R.reduce((a, x) => a + x.e, 0), rate = pc(e, n);
    const P = RG === 'yr' ? L.filter(x => x.m.slice(0, 4) === ly) : L.filter(x => x.m.slice(0, 4) === ly), pr = pc(P.reduce((a, x) => a + x.e, 0), P.length), dr = rate - pr;
    const T = {}; R.forEach(x => { if(!x.t) return; const o = T[x.t] = T[x.t] || { k: x.t, n: 0, e: 0 }; o.n++; o.e += x.e; });
    const min = RG === 'yr' ? 8 : 15, bt = Object.values(T).filter(t => t.n >= min).sort((a, b) => pc(b.e, b.n) - pc(a.e, a.n) || b.n - a.n)[0];
    const lvOf = c => { const s = String(c || '').toUpperCase().replace(/\\s+/g, ''); if(/PRE-?A1/.test(s)) return 'Pre-A1'; const m = s.match(/^([ABC][12])/); if(!m) return ''; return /B2|C1|C2/.test(m[1]) ? 'B2+' : m[1]; };
    const V = {}; R.forEach(x => { const k = lvOf(x.c); if(!k) return; const o = V[k] = V[k] || { k, n: 0, e: 0 }; o.n++; o.e += x.e; });
    const bl = Object.values(V).filter(v => v.n >= 5).sort((a, b) => pc(b.e, b.n) - pc(a.e, a.n))[0];
    const busy = kt.children[3] ? kt.children[3].outerHTML : '';
    kt.dataset.t40 = 1;
    kt.innerHTML = '<div><b class="' + cls(rate) + '">' + rate + '%' + (RG === 'yr' ? '<i class="' + (dr >= 0 ? 'p40g' : 'p40c') + '">' + (dr >= 0 ? '▲ ' : '▼ ') + Math.abs(dr) + ' pts</i>' : '') + '</b><span>enrol rate · ' + (RG === 'yr' ? y0 + ' vs ' + ly + ' ' + pr + '%' : 'all time · ' + ly + ' was ' + pr + '%') + '</span></div>' +
      '<div><b>' + (bt ? esc(bt.k) + '<i class="' + cls(pc(bt.e, bt.n)) + '">' + pc(bt.e, bt.n) + '%</i>' : '—') + '</b><span>best enrol rate · teacher with ' + min + '+ trials' + (bt ? ' · ' + bt.e + ' of ' + bt.n : '') + '</span></div>' +
      '<div><b>' + (bl ? bl.k + '<i class="' + cls(pc(bl.e, bl.n)) + '">' + pc(bl.e, bl.n) + '%</i>' : '—') + '</b><span>level that enrols best' + (bl ? ' · ' + bl.e + ' of ' + bl.n : '') + '</span></div>' + busy; }
  function run(){ const box = document.getElementById('tp2fun'); if(!box) return; try{ tiles(box); }catch(e){ console.warn('t40', e); } colour(box); }
  ['renderTP', 'tr37', 'tr37More'].forEach(f => { const o = window[f]; if(typeof o === 'function') window[f] = function(){ const r = o.apply(this, arguments); try{ run(); }catch(e){} return r; }; });
  let last = -1; setInterval(() => { try{ if(typeof VIEW === 'undefined' || VIEW !== 'trials') return; const v = (localStorage.getItem('coe.tall') || '').length; if(v !== last){ last = v; setTimeout(run, 50); } }catch(e){} }, 1600);
  try{ if(typeof VIEW !== 'undefined' && VIEW === 'trials') run(); }catch(e){}
})();
` + "</script>\n\n</body>"]]);
