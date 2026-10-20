/* 20 Oct · 433 · Trials screen (Misty: "Now, we can do the TRIALS screen").
   · Under the "Last 45 days" tiles: two small charts.
     "By teacher": each trial teacher's trials as one bar (green enrolled · amber following up · coral not enrolling · grey other)
     with "3 of 5 · 60%"; click a teacher to search their trials.
     "Trial levels": how many trials came in at each CEFR level.
   · Rows are shorter: the chips (Following up, source) sit on the name line; dates read "Sun 19 Oct 22:00";
     the score /36 gets a thin bar under the level. "Updated 16:47H" → "Updated 16:47". */
(function(){
  const css = document.createElement('style');
  css.textContent = `
#v-trials .ti33{display:grid;grid-template-columns:minmax(0,1.5fr) minmax(0,1fr);gap:12px;margin-top:14px}
#v-trials .ti33>div{border:1px solid var(--line);border-radius:14px;padding:12px 14px 10px;background:#fff}
#v-trials .ti33 .h{display:flex;justify-content:space-between;font-size:11px;letter-spacing:.07em;text-transform:uppercase;color:#8A86A0;margin-bottom:8px}
#v-trials .ti33 .r{display:grid;grid-template-columns:90px minmax(0,1fr) 92px;gap:10px;align-items:center;padding:3px 4px;border-radius:8px;cursor:pointer}
#v-trials .ti33 .r:hover{background:#F6FAFA}
#v-trials .ti33 .r>span{font-size:13px;color:var(--ink);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#v-trials .ti33 .r>em{font-style:normal;font-size:12px;color:#8A86A0;text-align:right;white-space:nowrap}
#v-trials .ti33 .r>em b{color:#2E9E6F}
#v-trials .ti33 .br{display:flex;height:10px;gap:2px}
#v-trials .ti33 .br i{display:block;border-radius:2px}
#v-trials .ti33 .cs{display:flex;align-items:flex-end;gap:8px;height:84px;padding-top:14px}
#v-trials .ti33 .cs>div{flex:1;position:relative;background:#00A3AD;border-radius:4px 4px 0 0;min-height:2px}
#v-trials .ti33 .cs>div b{position:absolute;left:0;right:0;top:-15px;text-align:center;font-size:11px;color:var(--ink)}
#v-trials .ti33 .ax{display:flex;gap:8px;font-size:11px;color:#8A86A0;margin-top:4px}
#v-trials .ti33 .ax span{flex:1;text-align:center}
#v-trials .ti33 .lg{display:flex;flex-wrap:wrap;gap:2px 12px;font-size:11px;color:#8A86A0;margin-top:6px}
#v-trials .ti33 .lg i{display:inline-block;width:8px;height:8px;border-radius:2px;margin-right:4px}
#v-trials #tpList .rp-row.t33{padding-top:10px!important;padding-bottom:10px!important;align-items:center}
#v-trials #tpList .rp-row.t33 .grow>.l1{display:flex;flex-wrap:wrap;align-items:center;gap:4px 8px}
#v-trials #tpList .rp-row.t33 .ch33{display:inline-flex;flex-wrap:wrap;gap:6px;align-items:center}
#v-trials #tpList .rp-row.t33 .ch33 .chip,#v-trials #tpList .rp-row.t33 .ch33 .sa-src{font-size:11.5px!important;padding:2px 9px!important;margin:0!important}
#v-trials #tpList .rp-row.t33 .grow>.small.mute{margin-top:2px}
#v-trials #tpList .sc33{display:block;width:64px;height:5px;border-radius:3px;background:var(--soft);margin:4px 0 0 auto;overflow:hidden}
#v-trials #tpList .sc33 i{display:block;height:100%;background:var(--c);border-radius:3px}
#v-trials #tpList .rp-row.t33>.chip:last-child{min-width:78px;text-align:center;justify-content:center}
@media(max-width:820px){#v-trials .ti33{grid-template-columns:1fr}}`;
  document.head.appendChild(css);
  const MN = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'], WD = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const fd = (y, m, d) => { const x = new Date(+y, +m - 1, +d); return isNaN(x) ? y + '-' + m + '-' + d : WD[x.getDay()] + ' ' + (+d) + ' ' + MN[+m - 1]; };
  const enqs = () => { try{ return (JSON.parse(localStorage.getItem('coe.enq') || '[]') || []).filter(Boolean); }catch(e){ return []; } };
  const fu = () => (typeof TFU !== 'undefined' && TFU) ? TFU : {};
  const kOf = t => t.date + '|' + tfuFirst(t.student);
  function state(t, Q){ const f = fu()[kOf(t)], k = (t.date + '|' + t.student).toLowerCase(), q = Q.find(x => x.trial && String(x.trial).toLowerCase() === k);
    if((f && f.st === 'Enrolling') || /^(yes|y|enrolled)/i.test(String(t.enrolled || '')) || (q && q.st === 'Enrolled')) return 'en';
    if(f && f.st === 'Not now') return 'no'; if(t.status === 'Sent') return 'fo'; return 'ot'; }
  function insights(){ const T = (typeof TRL !== 'undefined' && TRL) ? TRL : null; const R = (T && T.rows) || []; if(!R.length) return '';
    const Q = enqs(), by = {}, lv = {};
    R.forEach(t => { const n = String(t.teacher || '—').replace(/^teacher\s+/i, '').trim() || '—'; const o = by[n] = by[n] || { n, en: 0, fo: 0, no: 0, ot: 0, all: 0 }; o[state(t, Q)]++; o.all++;
      const c = String(t.cefr || '').match(/pre-?a1|[abc][12]/i); const k = c ? (/pre/i.test(c[0]) ? 'Pre-A1' : c[0].toUpperCase()) : ''; if(k) lv[k] = (lv[k] || 0) + 1; });
    const B = Object.values(by).sort((a, z) => z.all - a.all || z.en - a.en), mx = Math.max(1, ...B.map(b => b.all));
    const bar = (v, c) => v ? '<i style="flex:' + v + ';background:' + c + '"></i>' : '';
    const L = ['Pre-A1', 'A1', 'A2', 'B1', 'B2', 'C1'].filter(k => lv[k] || ['Pre-A1', 'A1', 'A2'].includes(k)), lm = Math.max(1, ...L.map(k => lv[k] || 0));
    return '<div class="ti33"><div><div class="h"><span>By teacher · trial to enrolled</span><span>' + R.length + ' trials</span></div>' +
      B.map(b => '<div class="r" title="Search ' + esc(b.n) + '’s trials" onclick="tp33T(\'' + esc(b.n).replace(/'/g, '') + '\')"><span>' + esc(b.n) + '</span><div class="br" style="width:' + Math.max(8, b.all / mx * 100) + '%">' + bar(b.en, '#2E9E6F') + bar(b.fo, '#D9962B') + bar(b.no, '#D4705A') + bar(b.ot, '#E3E5EC') + '</div><em><b>' + b.en + '</b> of ' + b.all + ' · ' + Math.round(b.en / b.all * 100) + '%</em></div>').join('') +
      '<div class="lg"><span><i style="background:#2E9E6F"></i>enrolled</span><span><i style="background:#D9962B"></i>following up</span><span><i style="background:#D4705A"></i>not enrolling</span><span><i style="background:#E3E5EC"></i>report not sent yet</span></div></div>' +
      '<div><div class="h"><span>Trial levels · CEFR</span><span>at the trial</span></div><div class="cs">' + L.map(k => '<div style="height:' + Math.max(2, (lv[k] || 0) / lm * 64) + 'px;opacity:' + (lv[k] ? 1 : .25) + '" title="' + k + ': ' + (lv[k] || 0) + '"><b>' + (lv[k] || 0) + '</b></div>').join('') + '</div><div class="ax">' + L.map(k => '<span>' + k + '</span>').join('') + '</div></div></div>'; }
  window.tp33T = function(n){ const q = $('tpQ'); if(q){ q.value = n; q.focus(); } tpSearch(n); };
  function rows(){ document.querySelectorAll('#tpList .rp-row:not(.t33)').forEach(r => { r.classList.add('t33'); const g = r.querySelector('.grow'); if(!g) return;
      const b = g.querySelector(':scope > b'), sp = b && b.nextElementSibling && b.nextElementSibling.tagName === 'SPAN' ? b.nextElementSibling : null; if(!b) return;
      const l1 = document.createElement('div'); l1.className = 'l1'; g.insertBefore(l1, b); l1.appendChild(b); if(sp) l1.appendChild(sp);
      const ch = document.createElement('span'); ch.className = 'ch33'; l1.appendChild(ch);
      [...g.children].forEach(k => { if(k === l1) return; if(k.classList.contains('tags') || (k.tagName === 'DIV' && k.querySelector('.sa-src') && k.children.length === 1)){ [...k.children].forEach(c => ch.appendChild(c)); k.remove(); } });
      const ln = g.querySelector(':scope > .small.mute'); if(ln) ln.textContent = ln.textContent.replace(/(\d{4})-(\d{2})-(\d{2})/g, (_, y, m, d) => fd(y, m, d));
      const sc = [...r.querySelectorAll('.small.mute.num')].find(x => /\/36/.test(x.textContent)); if(sc && !sc.querySelector('.sc33')){ const v = parseFloat(sc.textContent); if(!isNaN(v)){ const c = v >= 24 ? '#2E9E6F' : v >= 12 ? '#00A3AD' : '#D9962B'; sc.insertAdjacentHTML('beforeend', '<span class="sc33" style="--c:' + c + '"><i style="width:' + Math.min(100, v / 36 * 100) + '%"></i></span>'); } } });
    const at = $('tpAt'); if(at) at.textContent = at.textContent.replace(/(\d{1,2}:\d{2})H\b/, '$1'); }
  function paint(){ const box = $('tp2fun'); if(box && !box.querySelector('.ti33')){ const h = insights(); if(h) box.insertAdjacentHTML('beforeend', h); } rows(); }
  const _r = window.renderTP; if(_r) window.renderTP = function(){ const r = _r.apply(this, arguments); try{ paint(); }catch(e){ console.warn('tp33', e); } return r; };
  try{ if(typeof VIEW !== 'undefined' && VIEW === 'trials') renderTP(); }catch(e){}
})();
