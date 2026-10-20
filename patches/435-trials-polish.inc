/* 20 Oct · 435 · Trials, more polished (Misty: "can the TRIAL SCREEN be more polished?"). Same data, same filters and buttons.
   · Status and Source filters sit inside the list card as its header (one white card instead of loose rows).
   · "By teacher" rows are tighter, so the two charts end at the same height.
   · "Trial levels" now shows, for each level, how many enrolled (green) out of the trials, plus the average trial score and the enrol rate per level.
   · Rows: the level is a small pill, the score a quiet line with its bar; the status chip lines up at the right; hover shows the row. */
(function(){
  const css = document.createElement('style');
  css.textContent = `
#v-trials .ti33 .r{padding:1px 4px!important}
#v-trials .ti33 .r>span{font-size:12.5px!important}
#v-trials .ti33 .br{height:8px!important}
#v-trials .ti33>div{display:flex;flex-direction:column}
#v-trials .ti33 .lv35{flex:1;display:flex;flex-direction:column;justify-content:space-between;gap:10px}
#v-trials .ti33 .lv35 .cs{display:flex;align-items:flex-end;gap:10px;height:110px;padding-top:16px}
#v-trials .ti33 .lv35 .cs>div{flex:1;position:relative;display:flex;flex-direction:column-reverse;background:none!important;border-radius:0!important;height:100%;justify-content:flex-start}
#v-trials .ti33 .lv35 .cs i{display:block;width:100%}
#v-trials .ti33 .lv35 .cs i.e{background:#2E9E6F;border-radius:0 0 3px 3px}
#v-trials .ti33 .lv35 .cs i.o{background:#BFE3E5;border-radius:3px 3px 0 0}
#v-trials .ti33 .lv35 .cs b{position:absolute;left:0;right:0;text-align:center;font-size:11px;color:var(--ink);top:auto!important}
#v-trials .ti33 .lv35 .ax{display:flex;gap:10px;font-size:11px;color:#8A86A0;margin-top:4px}
#v-trials .ti33 .lv35 .ax span{flex:1;text-align:center}
#v-trials .ti33 .lv35 .ax em{display:block;font-style:normal;color:#2E9E6F;font-weight:700}
#v-trials .ti33 .lv35 .kp{display:grid;grid-template-columns:1fr 1fr;gap:8px}
#v-trials .ti33 .lv35 .kp div{background:var(--soft);border-radius:10px;padding:8px 10px}
#v-trials .ti33 .lv35 .kp b{display:block;font-family:var(--brand);font-weight:400;font-size:20px;color:var(--ink)}
#v-trials .ti33 .lv35 .kp span{font-size:11.5px;color:#8A86A0}
#v-trials #tpTabs>.seg{display:flex!important;width:100%;box-sizing:border-box;background:#fff!important;box-shadow:none!important;border:1px solid var(--line)!important;border-bottom:0!important;border-radius:var(--r-lg) var(--r-lg) 0 0!important;padding:14px 18px 6px!important;margin-top:16px!important}
#v-trials #tpTabs>.sk2{display:flex!important;width:100%;box-sizing:border-box;background:#fff!important;border:1px solid var(--line)!important;border-top:0!important;border-bottom:1px solid #F1F0F6!important;padding:6px 18px 14px!important;margin:0!important}
#v-trials #tpTabs+#tpList{margin-top:0!important;border-top:0!important;border-radius:0 0 var(--r-lg) var(--r-lg)!important;box-shadow:none}
#v-trials #tpTabs:has(>.sk2)+#tpList{border-top:0!important}
#v-trials #tpTabs:not(:has(>.sk2))>.seg{border-bottom:1px solid #F1F0F6!important;padding-bottom:14px!important}
#v-trials #tpList .rp-row.t33{border-radius:12px;padding:8px 12px!important;border-top:0!important;margin:1px 0}
#v-trials #tpList .rp-row.t33:hover{background:#F6FAFA}
#v-trials #tpList .rp-row.t33>div[style*="text-align:right"]{min-width:86px}
#v-trials #tpList .rp-row.t33>div[style*="text-align:right"]>b.num{display:inline-block;font:700 12.5px var(--sans,inherit)!important;padding:3px 10px;border-radius:999px;background:var(--tint);color:#00737B;min-width:0}
#v-trials #tpList .rp-row.t33>div[style*="text-align:right"]>.small.num{font-size:13px!important;font-family:inherit!important;color:#55526E!important;margin-top:4px}
#v-trials #tpList .sc33{width:72px!important}
#v-trials #tpList .rp-row.t33 .av{width:40px;height:40px;font-size:15px}`;
  document.head.appendChild(css);
  const fu = () => (typeof TFU !== 'undefined' && TFU) ? TFU : {};
  const enqs = () => { try{ return (JSON.parse(localStorage.getItem('coe.enq') || '[]') || []).filter(Boolean); }catch(e){ return []; } };
  const isEn = (t, Q) => { const f = fu()[t.date + '|' + tfuFirst(t.student)], k = (t.date + '|' + t.student).toLowerCase(), q = Q.find(x => x.trial && String(x.trial).toLowerCase() === k);
    return (f && f.st === 'Enrolling') || /^(yes|y|enrolled)/i.test(String(t.enrolled || '')) || (q && q.st === 'Enrolled'); };
  function levels(){ const box = document.querySelector('#v-trials .ti33'); if(!box || box.dataset.l35) return; const card = box.children[1]; if(!card) return;
    const R = ((typeof TRL !== 'undefined' && TRL && TRL.rows) || []); if(!R.length) return; box.dataset.l35 = 1;
    const Q = enqs(), lv = {}, sc = []; R.forEach(t => { const c = String(t.cefr || '').match(/pre-?a1|[abc][12]/i), k = c ? (/pre/i.test(c[0]) ? 'Pre-A1' : c[0].toUpperCase()) : ''; const v = parseFloat(t.total); if(!isNaN(v)) sc.push(v);
      if(!k) return; const o = lv[k] = lv[k] || { n: 0, e: 0 }; o.n++; if(isEn(t, Q)) o.e++; });
    const L = ['Pre-A1', 'A1', 'A2', 'B1', 'B2', 'C1'].filter(k => lv[k] || ['Pre-A1', 'A1', 'A2'].includes(k)), mx = Math.max(1, ...L.map(k => (lv[k] || {}).n || 0)), H = 88;
    const avg = sc.length ? Math.round(sc.reduce((a, b) => a + b, 0) / sc.length * 10) / 10 : null;
    const best = L.filter(k => lv[k] && lv[k].n >= 2).sort((a, b) => lv[b].e / lv[b].n - lv[a].e / lv[a].n)[0];
    card.innerHTML = '<div class="h"><span>Trial levels · CEFR</span><span>green = enrolled</span></div><div class="lv35"><div><div class="cs">' +
      L.map(k => { const o = lv[k] || { n: 0, e: 0 }, h = o.n / mx * H, he = o.n ? h * o.e / o.n : 0; return '<div title="' + k + ': ' + o.e + ' of ' + o.n + ' enrolled"><i class="e" style="height:' + he + 'px"></i><i class="o" style="height:' + (h - he) + 'px"></i>' + (o.n ? '<b style="bottom:' + (h + 2) + 'px">' + o.n + '</b>' : '') + '</div>'; }).join('') +
      '</div><div class="ax">' + L.map(k => { const o = lv[k]; return '<span>' + k + (o && o.n ? '<em>' + Math.round(o.e / o.n * 100) + '%</em>' : '<em style="color:#C9C6D6">—</em>') + '</span>'; }).join('') + '</div></div>' +
      '<div class="kp"><div><b>' + (avg != null ? avg + '<span style="font-size:13px">/36</span>' : '—') + '</b><span>average trial score</span></div><div><b>' + (best ? best : '—') + '</b><span>' + (best ? 'enrols best · ' + Math.round(lv[best].e / lv[best].n * 100) + '%' : 'best level to enrol') + '</span></div></div></div>'; }
  const _r = window.renderTP; if(_r) window.renderTP = function(){ const r = _r.apply(this, arguments); try{ levels(); }catch(e){ console.warn('tp35', e); } return r; };
  try{ if(typeof VIEW !== 'undefined' && VIEW === 'trials') renderTP(); }catch(e){}
})();
