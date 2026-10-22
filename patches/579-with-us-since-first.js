// 22 Oct · Misty: "yes" — "With us" counts from the student's EARLIEST first class across all their DATABASE rows,
// not only the latest row. Kimi (ST-2023-025) has 3 programmes: Reading since Apr 2023, IELTS Writing Apr 2025, Debate Aug 2026,
// so the page showed "With us 2 mo" instead of 3 yrs 6 mo.
//   · top card: "With us 3 yrs 6 mo · since Apr 2023"
//   · Profile timeline: "With us 3 years, 6 months · since 2 Apr 2023", one dot per programme start (Started · RE-F → Added · IELTS Writing → Added · Debate → Today)
// Students with a single row are unchanged.
require('../tools/lib.js')(process.argv[2], [
["</body>", `<script>
/* 22 Oct · 579 · With us = from the earliest first class across all DATABASE rows of the student */
(function(){
  const MON = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const pd = v => { v = String(v || '').trim(); let m = v.match(/^(\\d{4})-(\\d{2})-(\\d{2})/); if(m) return new Date(+m[1], +m[2] - 1, +m[3]);
    m = v.match(/^(\\d{1,2})[-\\s\\/]([A-Za-z]{3})[a-z]*[-\\s\\/,]*(\\d{4})$/); if(m){ const i = MON.findIndex(x => x.toLowerCase() === m[2].toLowerCase()); if(i >= 0) return new Date(+m[3], i, +m[1]); } return null; };
  const months = d => { const t = new Date(); let mo = (t.getFullYear() - d.getFullYear()) * 12 + (t.getMonth() - d.getMonth()); if(t.getDate() < d.getDate()) mo--; return Math.max(0, mo); };
  function starts(code){ try{ if(typeof DB === 'undefined' || !DB || !DB.rows) return null; const k = String(code || '').toUpperCase();
      const L = DB.rows.filter(r => String(r[0]).trim().toUpperCase() === k).map(r => ({ d: pd(r[16]) || pd(r[10]), p: String(r[12] || '').trim() || String(r[19] || '').split(',').pop().trim() })).filter(x => x.d).sort((a, b) => a.d - b.d);
      const U = []; L.forEach(x => { if(!U.some(y => +y.d === +x.d)) U.push(x); }); return U.length > 1 ? U : null; }catch(e){ return null; } }
  /* top card chip */
  function chip(){ try{ if(typeof STU === 'undefined' || !STU || !STU.code) return; const S = starts(STU.code); if(!S) return;
    const el = document.querySelector('#sheetBody .shero .len-chip'); if(!el) return; const d = S[0].d, mo = months(d), y = Math.floor(mo / 12), m = mo % 12;
    const txt = 'With us ' + (y ? y + ' yr' + (y > 1 ? 's' : '') : '') + (y && m ? ' ' : '') + (m || !y ? m + ' mo' : '') + ' · since ' + MON[d.getMonth()] + ' ' + d.getFullYear();
    if(el.dataset.w579 === txt) return; const sv = el.querySelector('svg'); el.textContent = txt; if(sv) el.prepend(sv); el.dataset.w579 = txt;
    el.title = S.map((x, i) => (i ? 'Added ' : 'Started ') + (x.p || '') + ' · ' + x.d.getDate() + ' ' + MON[x.d.getMonth()] + ' ' + x.d.getFullYear()).join('\\n'); }catch(e){} }
  const _sr = window.stuRender; if(_sr) window.stuRender = function(){ const r = _sr.apply(this, arguments); try{ chip(); [500, 1100, 1700, 3000].forEach(ms => setTimeout(chip, ms)); }catch(e){} return r; };
  /* Profile timeline */
  const _dp = window.dbProfile; if(_dp) window.dbProfile = function(){ const h = _dp.apply(this, arguments);
    try{ if(typeof STU === 'undefined' || !STU || !STU.code) return h; const S = starts(STU.code); if(!S) return h;
      const t = document.createElement('template'); t.innerHTML = h; const jy = t.content.querySelector('.jy'); if(!jy) return h;
      const d = S[0].d, mo = months(d), y = Math.floor(mo / 12), m = mo % 12;
      const len = (y ? y + ' year' + (y > 1 ? 's' : '') : '') + (y && m ? ', ' : '') + (m || !y ? m + ' month' + (m === 1 ? '' : 's') : '');
      const fdx = x => x.getDate() + ' ' + MON[x.getMonth()] + ' ' + x.getFullYear();
      const top = jy.querySelector('.top'); if(top) top.innerHTML = '<b>With us ' + esc(len) + '</b><span>since ' + esc(fdx(d)) + '</span>';
      const today = new Date(); today.setHours(0, 0, 0, 0);
      const M = S.map((x, i) => [x.d, (i ? 'Added' : 'Started') + (x.p ? ' · ' + x.p : ''), i ? '#2B2253' : '#00A3AD']).concat([[today, 'Today', '#00808A']]);
      const ln = jy.querySelector('.ln'); if(ln) ln.innerHTML = M.map((x, i) => '<div class="ms' + (i === 0 ? ' f' : i === M.length - 1 ? ' l' : '') + '" style="left:' + (i / (M.length - 1) * 100) + '%;--c:' + x[2] + '"><i></i><b>' + esc(x[1]) + '</b><span>' + esc(fdx(x[0])) + '</span></div>').join('');
      return t.innerHTML; }catch(e){ return h; } };
})();
</script>
</body>`],
]);
