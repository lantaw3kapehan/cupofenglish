/* 20 Oct · 415 · Time-ins › Full details without repeats, and as charts (Misty: "management seemed repetitive · better with charts").
   · No second title inside an opened row (Management hours, Latest changes), no second copy of what the chart cards show
     (class-record totals, class visits, who to visit next).
   · Management hours: per person a day-by-day column chart of the month (hours each day; coral = late, striped = forgot to
     time out), with days · hours · late · base pay as small chips. Click a person for the full table as before. */
(function(){
  const css = document.createElement('style');
  css.textContent = `
#v-team details.tgrp #hrsBox>h2,#v-team details.tgrp h2:has(+ .fd14),#v-team details.tgrp h2:has(+ #feed){display:none!important}
#v-team details.tgrp #ngBox .stats{display:none!important}
#v-team details.tgrp #hlBox>div.card{display:none!important}
#v-team details.tgrp #hlBox>details.card{margin-top:4px!important}
.hr15{display:grid;grid-template-columns:repeat(auto-fit,minmax(380px,1fr));gap:12px;margin-top:10px}
.hr15 .p{border:1px solid var(--line);border-radius:var(--r-md);padding:12px 14px;cursor:pointer;background:#fff}
.hr15 .p:hover{box-shadow:0 0 0 1px var(--teal) inset}
.hr15 .t{display:flex;align-items:center;gap:10px;flex-wrap:wrap}
.hr15 .t b{font-size:14.5px;color:var(--ink)}
.hr15 .t small{color:#8A86A0;font-size:12px}
.hr15 .ch{display:flex;gap:6px;flex-wrap:wrap;margin-left:auto}
.hr15 .ch span{font-size:12px;padding:3px 9px;border-radius:999px;background:var(--soft);color:#3F3B5C}
.hr15 .ch span b{font-size:12px}
.hr15 .ch span.bad{background:#FBECE8;color:#A13C28}.hr15 .ch span.warn{background:#FDF4E3;color:#8A5A0F}
.hr15 .cols{display:flex;align-items:flex-end;gap:2px;height:84px;margin-top:12px;border-bottom:1px solid #E3E1EC;position:relative}
.hr15 .cols div{flex:1;display:flex;flex-direction:column;justify-content:flex-end;height:100%;min-width:0}
.hr15 .cols i{display:block;background:#6C5FC7;border-radius:3px 3px 0 0;opacity:.85}
.hr15 .cols i.late{background:#D4705A}
.hr15 .cols i.auto{background:repeating-linear-gradient(135deg,#E0A030 0 3px,#F6D9A0 3px 6px)}
.hr15 .cols i.none{background:transparent}
.hr15 .ax{display:flex;gap:2px;font-size:10px;color:#8A86A0;margin-top:3px}
.hr15 .ax span{flex:1;text-align:center;min-width:0}
.hr15 .lg{display:flex;gap:12px;font-size:11px;color:#8A86A0;margin-top:6px}
.hr15 .lg i{display:inline-block;width:10px;height:8px;border-radius:2px;margin-right:4px}
.hr15 .ln{display:block;height:0;position:absolute;left:0;right:0;border-top:1px dashed #C9C6D6}
.hr15 .ln span{font-weight:400;position:absolute;right:0;top:-14px;font-size:10px;color:#8A86A0}`;
  document.head.appendChild(css);
  const base = window.hrsHtml;
  window.hrsHtml = function(){
    if(typeof HRS === 'undefined' || !HRS) return base ? base.apply(this, arguments) : '';
    try{ const P = (HRS.people || []).filter(p => p.days.length || p.base != null);
      const m = HRS.month || '', y = +m.slice(0, 4), mo = +m.slice(5, 7), dim = y && mo ? new Date(y, mo, 0).getDate() : 31;
      let h = `<h2>Management hours <span class="c">${esc(HRS.label)} · from the app time-ins</span></h2><div class="seg">${(HRS.months || []).map(x => `<button class="${HRS.month === x ? 'on' : ''}" onclick="loadHours('${x}')">${esc(new Date(x + '-15').toLocaleDateString('en-US', { month: 'long' }))}</button>`).join('')}</div>`;
      if(!P.length) return h + '<div class="empty small">No Management time-ins this month yet.</div>';
      const mx = Math.max(10, ...P.flatMap(p => p.days.map(d => +d.hours || 0)));
      h += '<div class="hr15">' + P.map(p => { const by = {}; p.days.forEach(d => { const k = +String(d.day).slice(8, 10); by[k] = d; });
        const avg = p.days.length ? (+p.hours || 0) / p.days.length : 0;
        const cols = []; for(let i = 1; i <= dim; i++){ const d = by[i], hv = d ? +d.hours || (d.out ? 0 : 0.6) : 0;
          cols.push('<div title="' + (d ? esc(d.day + ' · in ' + d.in + ' · out ' + (d.out || '—') + ' · ' + (d.hours || '?') + ' h' + (d.auto ? ' · auto-closed' : '') + (/^Late/.test(d.status || '') ? ' · late' : '')) : i + ' · no time-in') + '"><i class="' + (!d ? 'none' : d.auto ? 'auto' : /^Late/.test(d.status || '') ? 'late' : '') + '" style="height:' + Math.round(hv / mx * 80) + 'px"></i></div>'); }
        const ax = []; for(let i = 1; i <= dim; i++) ax.push('<span>' + (i === 1 || i % 5 === 0 ? i : '') + '</span>');
        return '<div class="p" onclick="hrsSheet(' + HRS.people.indexOf(p) + ')"><div class="t"><div class="av">' + esc(String(p.name)[0]) + '</div><div><b>' + esc(p.name) + '</b><br><small>' + esc(p.title || '') + '</small></div><div class="ch">' +
          '<span><b>' + p.days.length + '</b> days</span><span><b>' + p.hours + '</b> h</span>' + (p.late ? '<span class="bad"><b>' + p.late + '</b> late</span>' : '<span><b>0</b> late</span>') + (p.base != null ? '<span><b>' + peso(p.base) + '</b> base pay</span>' : '') + (p.auto ? '<span class="warn"><b>' + p.auto + '</b> forgot to time out</span>' : '') + (p.open ? '<span class="warn"><b>' + p.open + '</b> still open</span>' : '') + '</div></div>' +
          '<div class="cols">' + cols.join('') + (avg ? '<b class="ln" style="bottom:' + Math.round(avg / mx * 80) + 'px"><span>avg ' + avg.toFixed(1) + ' h</span></b>' : '') + '</div><div class="ax">' + ax.join('') + '</div>' +
          '<div class="lg"><span><i style="background:#6C5FC7"></i>hours that day</span><span><i style="background:#D4705A"></i>late</span><span><i style="background:repeating-linear-gradient(135deg,#E0A030 0 3px,#F6D9A0 3px 6px)"></i>forgot to time out</span></div></div>'; }).join('') + '</div>';
      return h; }catch(e){ return base ? base.apply(this, arguments) : ''; } };
  css.textContent += `
#ngBox details.ng .m15{display:flex;gap:10px;margin-top:6px;flex-wrap:wrap}
#ngBox details.ng .m15 span{display:flex;align-items:center;gap:6px;font-size:11.5px;color:#6F6B85}
#ngBox details.ng .m15 i{display:block;width:70px;height:6px;border-radius:3px;background:var(--soft);overflow:hidden}
#ngBox details.ng .m15 i u{display:block;height:100%}`;
  function ngBars(){ document.querySelectorAll('#ngBox details.ng>summary').forEach(s => { if(s.querySelector('.m15')) return; const t = s.textContent;
    const g = re => { const m = t.match(re); return m ? [+m[1], +m[2]] : null; }; const V = [['video', g(/video (\d+)\/(\d+)/)], ['homework', g(/homework (\d+)\/(\d+)/)], ['notes', g(/notes (\d+)\/(\d+)/)]].filter(x => x[1] && x[1][1]);
    if(!V.length) return; const box = s.querySelector('.grow'); if(!box) return;
    box.insertAdjacentHTML('beforeend', '<div class="m15">' + V.map(([l, [a, b]]) => { const p = a / b, c = p >= .95 ? '#00A3AD' : p >= .5 ? '#E0A030' : '#D4705A'; return '<span>' + l + '<i><u style="width:' + Math.round(p * 100) + '%;background:' + c + '"></u></i>' + a + '/' + b + '</span>'; }).join('') + '</div>'); }); }
  try{ let t2 = 0; new MutationObserver(() => { clearTimeout(t2); t2 = setTimeout(ngBars, 100); }).observe(document.body, { childList: true, subtree: true }); }catch(e){}
  const rn = window.renderTeam; if(rn) window.renderTeam = function(){ const r = rn.apply(this, arguments);
    try{ document.querySelectorAll('#v-team details.tgrp>summary').forEach(s => { if(/^Class checks & visits/.test(s.textContent)) s.innerHTML = 'Class records by teacher<span>each class: video, homework and notes</span>'; else if(/^System health/.test(s.textContent)) s.innerHTML = 'System health<span>speed, slow screens and background checks</span>'; else if(/^Management hours/.test(s.textContent)) s.innerHTML = 'Management hours<span>day by day this month</span>'; }); }catch(e){}
    return r; };
  try{ if(typeof VIEW !== 'undefined' && VIEW === 'team') renderTeam(); }catch(e){}
})();
