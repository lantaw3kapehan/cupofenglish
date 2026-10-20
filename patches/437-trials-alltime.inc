/* 20 Oct · 437 · Trials · total standing (Misty: "can we also have the TOTAL STANDING, whole of it, through graphs or charts").
   The "Last 45 days" card gets a switch: Last 45 days · This year · All time.
   This year / All time (from DATABASE, every student with a trial date; "enrolled" = a first class on or after the trial):
   · Four tiles: trials · enrolled + % · this year vs last year at the same point (arrow) · best year (or best month).
   · Column chart: trials per year (All time) or per month (This year), green = enrolled, light = not; the % under each column.
   · By teacher: trials and enrol rate, the 8 with most trials first (show all).
   · By level at the trial: Pre-A1 · A1 · A2 · B1 · B2+ with their enrol rate. */
(function(){
  const css = document.createElement('style');
  css.textContent = `
#v-trials .rg37{display:inline-flex;gap:2px;background:var(--soft);border-radius:999px;padding:3px}
#v-trials .rg37 button{all:unset;cursor:pointer;font-size:12px;font-weight:700;letter-spacing:.02em;padding:4px 12px;border-radius:999px;color:#55526E;text-transform:none}
#v-trials .rg37 button.on{background:var(--ink);color:#fff}
#v-trials .tp2.al37>.tp3t,#v-trials .tp2.al37>.tp3b,#v-trials .tp2.al37>.ti33{display:none!important}
#v-trials .tp2:not(.al37)>.at37{display:none}
#v-trials .at37 .kt{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px}
#v-trials .at37 .kt>div{background:var(--soft);border-radius:var(--r-md);padding:8px 12px}
#v-trials .at37 .kt b{display:block;font-family:var(--brand);font-weight:400;font-size:22px;color:var(--ink);line-height:1.15}
#v-trials .at37 .kt span{font-size:12.5px;color:#4C4868}
#v-trials .at37 .kt em{font-style:normal;font-weight:700;font-size:12.5px;margin-left:6px}
#v-trials .at37 .gr{display:grid;grid-template-columns:minmax(0,1.5fr) minmax(0,1fr);gap:10px;margin-top:10px}
#v-trials .at37 .cd{border:1px solid var(--line);border-radius:14px;padding:10px 12px 8px;background:#fff}
#v-trials .at37 .cd.w{grid-column:1/-1}
#v-trials .at37 .h{display:flex;justify-content:space-between;font-size:11px;letter-spacing:.07em;text-transform:uppercase;color:#8A86A0;margin-bottom:4px}
#v-trials .at37 .cs{display:flex;align-items:flex-end;gap:8px;height:150px;padding-top:18px}
#v-trials .at37 .cs>div{flex:1;position:relative;display:flex;flex-direction:column-reverse;height:100%;cursor:default;min-width:0}
#v-trials .at37 .cs i{display:block}
#v-trials .at37 .cs i.e{background:#2E9E6F;border-radius:0 0 3px 3px}
#v-trials .at37 .cs i.o{background:#CDE7E9;border-radius:3px 3px 0 0}
#v-trials .at37 .cs b{position:absolute;left:0;right:0;text-align:center;font-size:11px;color:var(--ink)}
#v-trials .at37 .cs>div.cur i.o{background:#B5DCDF}
#v-trials .at37 .ax{display:flex;gap:8px;font-size:11px;color:#8A86A0;margin-top:4px}
#v-trials .at37 .ax span{flex:1;text-align:center;min-width:0}
#v-trials .at37 .ax em{display:block;font-style:normal;color:#2E9E6F;font-weight:700}
#v-trials .at37 .r{display:grid;grid-template-columns:84px minmax(0,1fr) 96px;gap:10px;align-items:center;height:22px}
#v-trials .at37 .r>span{font-size:12.5px;color:var(--ink);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#v-trials .at37 .r>em{font-style:normal;font-size:11.5px;color:#8A86A0;text-align:right;white-space:nowrap}
#v-trials .at37 .r>em b{color:#2E9E6F;font-size:13px}
#v-trials .at37 .br{display:flex;height:8px;gap:2px}
#v-trials .at37 .br i{display:block;border-radius:2px}
#v-trials .at37 .mr{all:unset;cursor:pointer;font-size:12px;font-weight:700;color:#2F6F77;margin-top:4px}
#v-trials .at37 .lg{display:flex;flex-wrap:wrap;gap:2px 12px;font-size:11px;color:#8A86A0;margin-top:6px}
#v-trials .at37 .lg i{display:inline-block;width:8px;height:8px;border-radius:2px;margin-right:4px}
#v-trials .at37 .nt{font-size:11.5px;color:#8A86A0;margin-top:8px}
@media(max-width:820px){#v-trials .at37 .gr{grid-template-columns:1fr}#v-trials .at37 .kt{grid-template-columns:repeat(2,minmax(0,1fr))}}`;
  document.head.appendChild(css);
  const MN = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  let RG = 'd45', ALL = null, busy = 0, more = 0;
  try{ RG = localStorage.getItem('coe.trRange') || 'd45'; ALL = JSON.parse(localStorage.getItem('coe.tall') || 'null'); }catch(e){}
  async function load(){ if(busy) return; busy = 1;
    try{ const r = await fetch(FAST_URL + '-trials', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ token: TOKEN, tall: true }) }).then(x => x.json());
      if(r && r.ok && Array.isArray(r.list)){ ALL = { at: Date.now(), list: r.list }; try{ localStorage.setItem('coe.tall', JSON.stringify(ALL)); }catch(e){} } }catch(e){}
    busy = 0; if(typeof VIEW !== 'undefined' && VIEW === 'trials') paint(true); }
  const lvOf = c => { const s = String(c || '').toUpperCase().replace(/\s+/g, ''); if(/PRE-?A1/.test(s)) return 'Pre-A1'; const m = s.match(/^([ABC][12])/); if(!m) return ''; return /B2|C1|C2/.test(m[1]) ? 'B2+' : m[1]; };
  const pc = (e, n) => n ? Math.round(e / n * 100) : 0;
  function panel(){ if(!ALL) return '<div class="sk"></div><div class="sk"></div>';
    const L = ALL.list, now = new Date(), y0 = String(now.getFullYear()), mNow = now.getMonth();
    const R = RG === 'yr' ? L.filter(x => x.m.slice(0, 4) === y0) : L;
    const n = R.length, en = R.reduce((a, x) => a + x.e, 0);
    /* same point last year */
    const ly = String(now.getFullYear() - 1), cut = (m) => +m.slice(5, 7) - 1 <= mNow;
    const tY = L.filter(x => x.m.slice(0, 4) === y0), tL = L.filter(x => x.m.slice(0, 4) === ly && cut(x.m));
    const d = tY.length - tL.length;
    /* columns */
    let C = [];
    if(RG === 'yr'){ for(let i = 0; i <= 11; i++){ const k = y0 + '-' + String(i + 1).padStart(2, '0'), X = R.filter(x => x.m === k); C.push({ l: MN[i], n: X.length, e: X.reduce((a, x) => a + x.e, 0), cur: i === mNow, fut: i > mNow }); } }
    else { const ys = [...new Set(L.map(x => x.m.slice(0, 4)))].sort(); C = ys.map(y => { const X = L.filter(x => x.m.slice(0, 4) === y); return { l: y, n: X.length, e: X.reduce((a, x) => a + x.e, 0), cur: y === y0 }; }); }
    const best = C.filter(c => c.n >= 3 && !c.fut).sort((a, b) => b.n - a.n)[0];
    const mx = Math.max(1, ...C.map(c => c.n)), H = 128;
    const cols = '<div class="cs">' + C.map(c => { const h = c.n / mx * H, he = c.n ? h * c.e / c.n : 0; return '<div class="' + (c.cur ? 'cur' : '') + '" title="' + c.l + ': ' + c.n + ' trials · ' + c.e + ' enrolled (' + pc(c.e, c.n) + '%)"><i class="e" style="height:' + he + 'px"></i><i class="o" style="height:' + (h - he) + 'px"></i>' + (c.n ? '<b style="bottom:' + (h + 2) + 'px">' + c.n + '</b>' : '') + '</div>'; }).join('') + '</div>' +
      '<div class="ax">' + C.map(c => '<span' + (c.cur ? ' style="color:var(--ink);font-weight:700"' : '') + '>' + c.l + (c.n ? '<em>' + pc(c.e, c.n) + '%</em>' : '<em style="color:#C9C6D6">' + (c.fut ? '' : '—') + '</em>') + '</span>').join('') + '</div>';
    /* teachers */
    const T = {}; R.forEach(x => { const k = x.t || 'Not set'; const o = T[k] = T[k] || { k, n: 0, e: 0 }; o.n++; o.e += x.e; });
    const TT = Object.values(T).sort((a, b) => b.n - a.n || b.e - a.e), tm = Math.max(1, ...TT.map(t => t.n)), show = more ? TT : TT.slice(0, 8);
    const tr = show.map(t => '<div class="r" title="' + esc(t.k) + ': ' + t.e + ' of ' + t.n + ' enrolled"><span>' + esc(t.k) + '</span><div class="br" style="width:' + Math.max(6, t.n / tm * 100) + '%"><i style="flex:' + t.e + ';background:#2E9E6F"></i><i style="flex:' + (t.n - t.e) + ';background:#CDE7E9"></i></div><em><b>' + pc(t.e, t.n) + '%</b> · ' + t.e + ' of ' + t.n + '</em></div>').join('') + (TT.length > 8 ? '<button type="button" class="mr" onclick="tr37More()">' + (more ? 'Show fewer' : 'Show all ' + TT.length + ' teachers') + '</button>' : '');
    /* levels */
    const LV = ['Pre-A1', 'A1', 'A2', 'B1', 'B2+'], lv = {}; R.forEach(x => { const k = lvOf(x.c); if(!k) return; const o = lv[k] = lv[k] || { n: 0, e: 0 }; o.n++; o.e += x.e; });
    const lm = Math.max(1, ...LV.map(k => (lv[k] || {}).n || 0));
    const lvh = '<div class="cs" style="height:118px">' + LV.map(k => { const o = lv[k] || { n: 0, e: 0 }, h = o.n / lm * 96, he = o.n ? h * o.e / o.n : 0; return '<div title="' + k + ': ' + o.e + ' of ' + o.n + ' enrolled"><i class="e" style="height:' + he + 'px"></i><i class="o" style="height:' + (h - he) + 'px"></i>' + (o.n ? '<b style="bottom:' + (h + 2) + 'px">' + o.n + '</b>' : '') + '</div>'; }).join('') + '</div><div class="ax">' + LV.map(k => { const o = lv[k]; return '<span>' + k + (o && o.n ? '<em>' + pc(o.e, o.n) + '%</em>' : '<em style="color:#C9C6D6">—</em>') + '</span>'; }).join('') + '</div>';
    const yrLbl = RG === 'yr' ? y0 : (C[0] ? C[0].l : '') + '–' + y0;
    return '<div class="kt"><div><b>' + n + '</b><span>trials · ' + yrLbl + '</span></div><div><b>' + en + '<em style="color:#2E9E6F">' + pc(en, n) + '%</em></b><span>enrolled</span></div>' +
      '<div><b style="color:' + (d >= 0 ? '#1E8A6E' : '#C0563F') + '">' + (d >= 0 ? '▲ ' : '▼ ') + Math.abs(d) + '<em style="color:#8A86A0;font-weight:400">' + (tL.length ? (d >= 0 ? '+' : '−') + Math.abs(Math.round(d / tL.length * 100)) + '%' : '') + '</em></b><span>' + y0 + ' ' + tY.length + ' vs ' + ly + ' ' + tL.length + ' (Jan–' + MN[mNow] + ')</span></div>' +
      '<div><b>' + (best ? best.l : '—') + '</b><span>' + (best ? 'busiest ' + (RG === 'yr' ? 'month' : 'year') + ' · ' + best.n + ' trials · ' + pc(best.e, best.n) + '%' : '') + '</span></div></div>' +
      '<div class="gr"><div class="cd w"><div class="h"><span>Trials per ' + (RG === 'yr' ? 'month · ' + y0 : 'year') + '</span><span>green = enrolled · % = enrol rate</span></div>' + cols + '</div>' +
      '<div class="cd"><div class="h"><span>By teacher · enrol rate</span><span>' + TT.length + ' teachers</span></div>' + tr + '</div>' +
      '<div class="cd"><div class="h"><span>Level at the trial</span><span>green = enrolled</span></div>' + lvh + '</div></div>' +
      '<div class="nt">From DATABASE: every student with a trial date · enrolled = has a first class on or after the trial' + (ALL.at ? ' · updated ' + new Date(ALL.at).toTimeString().slice(0, 5) : '') + '</div>'; }
  window.tr37 = function(k){ RG = k; try{ localStorage.setItem('coe.trRange', k); }catch(e){} paint(true); if(k !== 'd45' && (!ALL || Date.now() - (ALL.at || 0) > 10 * 6e4)) load(); };
  window.tr37More = function(){ more = !more; paint(true); };
  function paint(force){ const box = $('tp2fun'); if(!box) return; const h = box.querySelector('.tp3h'); if(!h) return;
    if(!h.querySelector('.rg37')){ const sp = h.querySelector('span'); const sw = '<span class="rg37">' + [['d45', 'Last 45 days'], ['yr', 'This year'], ['all', 'All time']].map(([k, l]) => '<button type="button" data-k="' + k + '" onclick="tr37(\'' + k + '\')">' + l + '</button>').join('') + '</span>';
      if(sp) sp.outerHTML = sw; else h.insertAdjacentHTML('afterbegin', sw); }
    h.querySelectorAll('.rg37 button').forEach(b => b.classList.toggle('on', b.dataset.k === RG));
    box.classList.toggle('al37', RG !== 'd45');
    let p = box.querySelector('.at37'); if(!p){ box.insertAdjacentHTML('beforeend', '<div class="at37"></div>'); p = box.querySelector('.at37'); }
    if(RG !== 'd45' && (force || !p.dataset.ok)){ p.innerHTML = panel(); p.dataset.ok = ALL ? 1 : ''; } }
  const _r = window.renderTP; if(_r) window.renderTP = function(){ const r = _r.apply(this, arguments); try{ paint(); if(RG !== 'd45' && !ALL) load(); }catch(e){ console.warn('tr37', e); } return r; };
  try{ if(typeof VIEW !== 'undefined' && VIEW === 'trials') renderTP(); }catch(e){}
})();
