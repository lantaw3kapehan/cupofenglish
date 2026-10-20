/* 20 Oct · 417 · Teachers' time-ins day by day, like Management hours (Misty). Full details › "Teachers' time-ins":
   per teacher a chart of the month — a column per day for how many minutes before class they timed in (teal; amber when
   under 5 minutes; coral below the line when late), with days · on time % · late · average minutes as chips.
   Office staff stay in Management hours. Data: T-TIMEIN copy (coe-trials v5 `tpunct`). */
(function(){
  const css = document.createElement('style');
  css.textContent = `
.tp17 .p .cols{height:96px;border-bottom:0}
.tp17 .zl{position:absolute;left:0;right:0;border-top:1px solid #C9C6D6}
.tp17 .cols div{position:relative}
.tp17 .cols i{position:absolute;left:1px;right:1px;border-radius:2px}
.tp17 .cols i.ok{background:#00A3AD}.tp17 .cols i.edge{background:#E0A030}.tp17 .cols i.late{background:#D4705A}.tp17 .cols i.na{background:#C9C6D6}`;
  document.head.appendChild(css);
  let TP = null, TPM = '', busy = 0;
  async function load(m){ if(busy) return; busy = 1; try{ const r = await fetch(FAST_URL + '-trials', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ token: TOKEN, tpunct: m || true }) }).then(x => x.json()); if(r && r.ok){ TP = r; TPM = r.month; paint(); } }catch(e){} busy = 0; }
  window.tp17Load = m => { TP = null; paint(); load(m); };
  function html(){ if(!TP) return '<div class="sk"></div><div class="sk"></div>';
    const office = new Set(((typeof HRS !== 'undefined' && HRS && HRS.people) || []).map(p => String(p.name).toLowerCase()).concat(['celine', 'cupofenglish']));
    const L = (TP.list || []).filter(t => !office.has(String(t.name).toLowerCase()));
    const y = +TPM.slice(0, 4), mo = +TPM.slice(5, 7), dim = new Date(y, mo, 0).getDate();
    const months = []; for(let k = 0; k < 3; k++){ const d = new Date(); d.setDate(1); d.setMonth(d.getMonth() - k); months.push(d.toISOString().slice(0, 7)); }
    let h = '<div class="seg">' + months.map(m => '<button class="' + (m === TPM ? 'on' : '') + '" onclick="tp17Load(\'' + m + '\')">' + new Date(m + '-15').toLocaleDateString('en-US', { month: 'long' }) + '</button>').join('') + '</div>';
    if(!L.length) return h + '<div class="empty small">No teacher time-ins this month yet.</div>';
    const MAXE = 45, MAXL = 20, H = 96, zero = Math.round(H * MAXE / (MAXE + MAXL)), up = v => Math.round(Math.min(MAXE, v) / MAXE * zero), dn = v => Math.round(Math.min(MAXL, v) / MAXL * (H - zero));
    h += '<div class="hr15 tp17">' + L.map(t => { const by = {}; t.days.forEach(d => { const k = +d.day.slice(8, 10); if(!by[k] || (d.min != null && (by[k].min == null || d.min < by[k].min))) by[k] = d; });
      const D = Object.values(by), late = D.filter(d => /late|missing/i.test(d.st) || (d.min != null && d.min < 0)).length, ok = D.length - late, M = D.filter(d => d.min != null), avg = M.length ? M.reduce((a, d) => a + d.min, 0) / M.length : null;
      const cols = []; for(let i = 1; i <= dim; i++){ const d = by[i]; let bar = '';
        if(d){ const m = d.min; const tip = esc(d.day + ' · ' + (m == null ? 'no class time' : m >= 0 ? m + ' min before class' : -m + ' min late') + (d.st ? ' · ' + d.st : ''));
          if(m == null) bar = '<i class="na" title="' + tip + '" style="bottom:' + (H - zero) + 'px;height:4px"></i>';
          else if(m >= 0 && !/late/i.test(d.st)) bar = '<i class="' + (m < 5 ? 'edge' : 'ok') + '" title="' + tip + '" style="bottom:' + (H - zero) + 'px;height:' + Math.max(3, up(m)) + 'px"></i>';
          else bar = '<i class="late" title="' + tip + '" style="top:' + zero + 'px;height:' + Math.max(3, dn(Math.abs(m || 1))) + 'px"></i>'; }
        cols.push('<div>' + bar + '</div>'); }
      const ax = []; for(let i = 1; i <= dim; i++) ax.push('<span>' + (i === 1 || i % 5 === 0 ? i : '') + '</span>');
      return '<div class="p"><div class="t"><div class="av">' + esc(String(t.name)[0]) + '</div><div><b>Teacher ' + esc(t.name) + '</b></div><div class="ch"><span><b>' + D.length + '</b> days</span><span><b>' + (D.length ? Math.round(ok / D.length * 100) : 0) + '%</b> on time</span>' +
        (late ? '<span class="bad"><b>' + late + '</b> late</span>' : '<span><b>0</b> late</span>') + (avg != null ? '<span><b>' + Math.round(avg) + '</b> min early on average</span>' : '') + '</div></div>' +
        '<div class="cols" style="height:' + H + 'px"><b class="zl" style="top:' + zero + 'px"></b>' + cols.join('') + '</div><div class="ax">' + ax.join('') + '</div>' +
        '<div class="lg"><span><i style="background:#00A3AD"></i>minutes before class</span><span><i style="background:#E0A030"></i>under 5 min</span><span><i style="background:#D4705A"></i>late (below the line)</span></div></div>'; }).join('') + '</div>';
    return h; }
  function paint(){ const v = $('v-team'); if(!v) return; let d = v.querySelector('details.tgrp.tp17d');
    const hrsD = [...v.querySelectorAll('details.tgrp')].find(x => x.querySelector('#hrsBox'));
    if(!d){ if(!hrsD) return; const O = (() => { try{ return JSON.parse(localStorage.getItem('coe.tgrp') || '{}') || {}; }catch(e){ return {}; } })();
      d = document.createElement('details'); d.className = 'tgrp tp17d'; if(O.tp17) d.open = true; d.setAttribute('ontoggle', "tgrpT('tp17',this);if(this.open&&!window._tp17)tp17Load()");
      d.innerHTML = '<summary>Teachers’ time-ins<span>day by day this month · minutes before class, late</span></summary><div id="tp17Box"></div>'; hrsD.insertAdjacentElement('beforebegin', d); }
    const b = $('tp17Box'); if(b){ const x = html(); if(b.innerHTML !== x) b.innerHTML = x; }
    if(d.open && !TP && !busy) load(TPM); }
  const r0 = window.renderTeam; if(r0) window.renderTeam = function(){ const r = r0.apply(this, arguments); try{ paint(); }catch(e){ console.warn('tp17', e); } return r; };
  try{ if(typeof VIEW !== 'undefined' && VIEW === 'team') renderTeam(); }catch(e){}
})();
