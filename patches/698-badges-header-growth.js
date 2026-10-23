// 698: (Misty) Badges outside Trainings, without repeating anything: a small "★ n" after the rank in the header (tap → Trainings)
// and one "Cleared to teach" row on Growth. Name, rank and units already show elsewhere, so they are not repeated. Both appear only
// once at least one book or specialization is ticked.
const fs = require('fs');
const S = s => s;
require('../tools/lib.js')(process.argv[2], [
["MY = await call('my'); MYT = Date.now(); return MY; }", "MY = await call('my'); MYT = Date.now(); setTimeout(txUp, 0); return MY; }"],
["  window.trView = async function(name){", `  /* 698: ★ count in the header + "Cleared to teach" on Growth */
  const txT = () => typeof D !== 'undefined' && D && !D.mgr;
  function txOk(){ if(!MY) return []; const BO = ['Specializations', 'Phonics', 'Reading', 'Oxford Discover', 'Adults', 'Books', 'Trial classes'];
    return (MY.trainings || []).filter(t => t.kind === 'unlock' && ['done', 'excused'].includes((latestRec(MY.records, MY.me, t.id) || {}).status)).sort((a, b) => BO.indexOf(BG(a)) - BO.indexOf(BG(b)) || a.sort - b.sort); }
  function txStar(){ const r = $('hRank'); if(!r) return; let b = $('txStar'); const n = txT() ? txOk().length : 0;
    if(!n){ if(b) b.remove(); return; }
    if(!b){ r.insertAdjacentHTML('beforeend', '<button id="txStar" type="button" onclick="event.stopPropagation();go(\\'train\\')"></button>'); b = $('txStar'); }
    const t = '★ ' + n; if(b.textContent !== t){ b.textContent = t; b.title = 'Cleared to teach ' + n + ' · open Trainings'; } }
  function txGrow(){ const g = $('v-growth'); if(!g) return; const c = $('txGrow'), L = txT() ? txOk() : [];
    if(!L.length){ if(c) c.remove(); return; }
    const lab = t => t.id === 'trial' ? 'Trial classes' : t.title.split(' · ')[0].replace(/ Specialization$/, '');
    const h = '<span class="k">Cleared to teach</span><div class="tx-bdg">' + L.map(t => '<span style="--c:' + (BGC[BG(t)] || '#9A97AE') + '">' + (BG(t) === 'Specializations' ? '★ ' : '') + e(lab(t)) + '</span>').join('') + '</div><button type="button" class="btn ghost sm" onclick="go(\\'train\\')">Trainings ›</button>';
    if(c && c._h === h && c.parentNode === g) return; if(c) c.remove();
    const d = document.createElement('div'); d.id = 'txGrow'; d.innerHTML = h; d._h = h; const ld = g.querySelector(':scope > .lead');
    if(ld) ld.after(d); else g.prepend(d); }
  function txUp(){ try{ txStar(); }catch(x){} try{ txGrow(); }catch(x){} }
  (function(){ const st = document.createElement('style'); st.textContent = '#txStar{border:1.5px solid #D67FA3;background:#FBEFF4;color:#8A3B6A;font:inherit;font-weight:700;font-size:12px;border-radius:99px;padding:1px 8px;margin-left:6px;cursor:pointer;vertical-align:1px}'
      + '#txGrow{display:flex;align-items:center;gap:10px;flex-wrap:wrap;background:var(--card,#fff);border:1px solid var(--line);border-radius:18px;padding:12px 16px;margin:12px 0}#txGrow .k{font-size:12px;font-weight:700;color:var(--ink2,#5E5A75)}#txGrow .tx-bdg{margin:0;flex:1}';
    document.head.appendChild(st);
    let q = 0; const later = () => { if(q) return; q = requestAnimationFrame(() => { q = 0; txUp(); }); };
    const w = () => { const r = $('hRank'), g = $('v-growth'); if(!r || !g || !txT()){ setTimeout(w, 1500); return; }
      new MutationObserver(later).observe(r, { childList: true }); new MutationObserver(later).observe(g, { childList: true });
      loadMy().catch(() => {}); setInterval(() => { if(document.visibilityState === 'visible' && Date.now() - MYT > 9 * 60e3) loadMy(true).catch(() => {}); }, 10 * 60e3); };
    setTimeout(w, 4000); })();
  window.trView = async function(name){`],
]);
