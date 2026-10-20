/* 20 Oct · 438 · Trials · total standing always in view (Misty: "it only shows when I click This year and All time, can it be shown better").
   ("and organized categorically and strategically") The top of the card is three period cards side by side, always visible:
   Now · last 45 days | This year · 2026 | All time · since 2020 — each with trials, enrolled %, a bar or mini columns, and the change vs last year.
   The cards are the switch: the one outlined is what the charts underneath show. */
(function(){
  const css = document.createElement('style');
  css.textContent = `
#v-trials #tp2fun .tp3h{display:none!important}
#v-trials .pc38{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin-bottom:12px}
#v-trials .pc38>button{all:unset;cursor:pointer;box-sizing:border-box;display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:end;gap:2px 10px;padding:10px 14px;border-radius:14px;border:1px solid var(--line);background:#fff;transition:box-shadow .12s,border-color .12s}
#v-trials .pc38>button:hover{border-color:#BFE6E3}
#v-trials .pc38>button.on{border-color:var(--ink);box-shadow:inset 0 0 0 1px var(--ink);background:#FBFBFD}
#v-trials .pc38 small{grid-column:1/-1;font-size:10.5px;letter-spacing:.08em;text-transform:uppercase;color:#8A86A0;display:flex;justify-content:space-between}
#v-trials .pc38 small i{font-style:normal;letter-spacing:0;text-transform:none;color:#00808A;font-weight:700;opacity:0}
#v-trials .pc38>button.on small i{opacity:1}
#v-trials .pc38 .v{font-size:12.5px;color:#4C4868}
#v-trials .pc38 .v b{font-family:var(--brand);font-weight:400;font-size:24px;color:var(--ink);margin-right:4px}
#v-trials .pc38 .v em{font-style:normal;font-weight:700;color:#2E9E6F}
#v-trials .pc38 .x{font-size:12px;color:#8A86A0;text-align:right;white-space:nowrap}
#v-trials .pc38 .up{color:#1E8A6E;font-weight:700}#v-trials .pc38 .dn{color:#C0563F;font-weight:700}
#v-trials .pc38 .bar{grid-column:1/-1;height:5px;border-radius:3px;background:#E3E5EC;overflow:hidden;margin-top:4px}
#v-trials .pc38 .bar i{display:block;height:100%;background:#2E9E6F}
#v-trials .pc38 .yc{display:flex;align-items:flex-end;gap:3px;height:26px}
#v-trials .pc38 .yc i{display:block;width:8px;border-radius:2px 2px 0 0;background:linear-gradient(to top,#2E9E6F var(--e),#CDE7E9 var(--e))}
#v-trials .pc38 .sec{grid-column:1/-1;font-size:10.5px;color:#8A86A0;margin-top:2px}
@media(max-width:820px){#v-trials .pc38{grid-template-columns:1fr}}`;
  document.head.appendChild(css);
  const pc = (a, b) => b ? Math.round(a / b * 100) : 0;
  function cards(box){ let A = null; try{ A = JSON.parse(localStorage.getItem('coe.tall') || 'null'); }catch(e){}
    const RG = (() => { try{ return localStorage.getItem('coe.trRange') || 'd45'; }catch(e){ return 'd45'; } })();
    /* last 45 days: from the tiles the 45-day view already shows */
    const T = [...box.querySelectorAll('.tp3t button b')].map(b => parseInt(b.textContent, 10) || 0); const n45 = T[0] || 0, e45 = T[1] || 0, f45 = T[2] || 0;
    const L = (A && A.list) || [], y0 = String(new Date().getFullYear()), ly = String(+y0 - 1), mNow = new Date().getMonth();
    const n = L.length, e = L.reduce((a, x) => a + x.e, 0), Y = L.filter(x => x.m.slice(0, 4) === y0), ye = Y.reduce((a, x) => a + x.e, 0);
    const P = L.filter(x => x.m.slice(0, 4) === ly && +x.m.slice(5, 7) - 1 <= mNow).length, d = Y.length - P;
    const ys = [...new Set(L.map(x => x.m.slice(0, 4)))].sort(), mx = Math.max(1, ...ys.map(y => L.filter(x => x.m.slice(0, 4) === y).length));
    const MS = []; for(let i = 0; i <= mNow; i++){ const k = y0 + '-' + String(i + 1).padStart(2, '0'), X = Y.filter(x => x.m === k); MS.push({ n: X.length, e: X.reduce((a, x) => a + x.e, 0) }); } const mm = Math.max(1, ...MS.map(m => m.n));
    const card = (k, lbl, num, en, x, bar) => '<button type="button" class="' + (RG === k ? 'on' : '') + '" onclick="tr37(\'' + k + '\')"><small>' + lbl + '<i>showing ▾</i></small><span class="v"><b>' + num + '</b>trials · <em>' + pc(en, num) + '%</em> enrolled</span><span class="x">' + x + '</span>' + bar + '</button>';
    const ld = !A ? '<span class="sec">loading…</span>' : '';
    return '<div class="pc38">' +
      card('d45', 'Now · last 45 days', n45, e45, f45 ? '<span style="color:#B07A10;font-weight:700">' + f45 + ' following up</span>' : '', '<span class="bar"><i style="width:' + pc(e45, n45) + '%"></i></span>') +
      card('yr', 'This year · ' + y0, Y.length, ye, A ? '<span class="' + (d >= 0 ? 'up' : 'dn') + '">' + (d >= 0 ? '▲ ' : '▼ ') + Math.abs(d) + '</span> vs ' + ly + ' by now' : '', A ? '<span class="sec"><span class="yc" style="height:20px">' + MS.map((m, i) => '<i title="' + ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][i] + ': ' + m.n + ' · ' + pc(m.e, m.n) + '%" style="height:' + Math.max(2, m.n / mm * 20) + 'px;--e:' + pc(m.e, m.n) + '%"></i>').join('') + '</span></span>' : ld) +
      card('all', 'All time · since ' + (ys[0] || '—'), n, e, A ? ys.length + ' years' : '', A ? '<span class="sec"><span class="yc" style="height:20px">' + ys.map(y => { const X = L.filter(x => x.m.slice(0, 4) === y), xe = X.reduce((a, x) => a + x.e, 0); return '<i title="' + y + ': ' + X.length + ' trials · ' + pc(xe, X.length) + '%" style="height:' + Math.max(2, X.length / mx * 20) + 'px;--e:' + pc(xe, X.length) + '%;width:14px"></i>'; }).join('') + '</span></span>' : ld) + '</div>'; }
  function paint(){ const box = document.getElementById('tp2fun'); if(!box) return; const old = box.querySelector('.pc38'); if(old) old.remove(); box.insertAdjacentHTML('afterbegin', cards(box)); }
  const _r = window.renderTP; if(_r) window.renderTP = function(){ const r = _r.apply(this, arguments); try{ paint(); }catch(e){ console.warn('pc38', e); } return r; };
  const _t = window.tr37; if(_t) window.tr37 = function(){ const r = _t.apply(this, arguments); try{ paint(); }catch(e){} return r; };
  let last = -1; setInterval(() => { try{ if(typeof VIEW === 'undefined' || VIEW !== 'trials') return; const v = (localStorage.getItem('coe.tall') || '').length; if(v !== last){ last = v; paint(); } }catch(e){} }, 1500);
  try{ if(typeof VIEW !== 'undefined' && VIEW === 'trials') renderTP(); }catch(e){}
})();
