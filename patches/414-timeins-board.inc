/* 20 Oct · 414 · Time-ins bottom part as pictures (Misty: "use graph, visual, chart, especially the bottom parts").
   Under the timeline a board of small chart cards; each opens its full details (the folded rows stay, under "Full details"):
   · Office hours this month — bars of hours per person, with days and late.
   · Last night's class records — three rings (videos, homework, notes) and who still has records to check.
   · Class visits today — a ring (done of target) and "who to visit next" as bars of days since the last visit.
   · System health — a half-gauge of the Google daily allowance and the status line.
   · Today in the app — changes per hour as small columns, and the latest four. */
(function(){
  const css = document.createElement('style');
  css.textContent = `
#v-team .bd14{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;margin-top:18px}
#v-team .bd14 .c{background:#fff;border:1px solid var(--line);border-radius:var(--r-lg);box-shadow:var(--sh1);padding:14px 16px;cursor:pointer;display:flex;flex-direction:column;gap:10px;min-width:0}
#v-team .bd14 .c:hover{box-shadow:0 0 0 1px var(--teal) inset,var(--sh1)}
#v-team .bd14 .c.w{grid-column:1/-1}
#v-team .bd14 .h{display:flex;justify-content:space-between;align-items:baseline;gap:8px}
#v-team .bd14 .h b{font-size:14.5px;color:var(--ink)}
#v-team .bd14 .h span{font-size:11.5px;color:#8A86A0;white-space:nowrap}
#v-team .bd14 .bars{display:flex;flex-direction:column;gap:7px}
#v-team .bd14 .br{display:grid;grid-template-columns:96px minmax(0,1fr) auto;gap:10px;align-items:center;font-size:12.5px;color:#55526E}
#v-team .bd14 .br>span{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#v-team .bd14 .br p{margin:0;height:10px;border-radius:5px;background:var(--soft);overflow:hidden}
#v-team .bd14 .br p i{display:block;height:100%;border-radius:0 5px 5px 0}
#v-team .bd14 .br b{color:var(--ink);font-weight:600;white-space:nowrap}
#v-team .bd14 .br em{font-style:normal;color:#8A86A0;font-weight:400}
#v-team .bd14 .rings{display:flex;gap:14px;align-items:center;flex-wrap:wrap}
#v-team .bd14 .rg{display:flex;flex-direction:column;align-items:center;gap:2px;font-size:11.5px;color:#6F6B85}
#v-team .bd14 .rg svg text{font-family:var(--brand)}
#v-team .bd14 .side{display:flex;align-items:center;gap:16px}
#v-team .bd14 .big{font-family:var(--brand);font-weight:400;font-size:26px;color:var(--ink);line-height:1}
#v-team .bd14 .sm{font-size:12.5px;color:#6F6B85;line-height:1.5}
#v-team .bd14 .bad{color:#B4442F}#v-team .bd14 .ok{color:#1C7A55}#v-team .bd14 .warn{color:#8A5A0F}
#v-team .bd14 .cols{display:flex;align-items:flex-end;gap:4px;height:74px}
#v-team .bd14 .cols div{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;height:100%;min-width:0}
#v-team .bd14 .cols i{display:block;width:100%;max-width:18px;background:#00A3AD;border-radius:3px 3px 0 0}
#v-team .bd14 .cols b{font-size:10px;color:var(--ink);font-weight:600}
#v-team .bd14 .cols span{font-size:10px;color:#8A86A0;margin-top:3px}
#v-team .bd14 .feed4{display:flex;flex-direction:column;gap:4px;font-size:12.5px;color:#3F3B5C;min-width:0}
#v-team .bd14 .feed4 div{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#v-team .bd14 .feed4 b{color:#00737B;font-weight:600;margin-right:6px}
#v-team .bd14 .two{display:grid;grid-template-columns:minmax(0,1.2fr) minmax(0,1fr);gap:18px;align-items:end}
@media(max-width:820px){#v-team .bd14{grid-template-columns:1fr}#v-team .bd14 .two{grid-template-columns:1fr}}`;
  document.head.appendChild(css);
  const ring = (v, max, c, lab, sz) => { sz = sz || 66; const R = sz / 2 - 6, C = 2 * Math.PI * R, p = max ? Math.min(1, v / max) : 0;
    return '<div class="rg"><svg width="' + sz + '" height="' + sz + '" viewBox="0 0 ' + sz + ' ' + sz + '"><circle cx="' + sz / 2 + '" cy="' + sz / 2 + '" r="' + R + '" fill="none" stroke="#F1F0F6" stroke-width="7"/>' +
      '<circle cx="' + sz / 2 + '" cy="' + sz / 2 + '" r="' + R + '" fill="none" stroke="' + c + '" stroke-width="7" stroke-linecap="round" stroke-dasharray="' + (p * C) + ' ' + C + '" transform="rotate(-90 ' + sz / 2 + ' ' + sz / 2 + ')"/>' +
      '<text x="50%" y="54%" text-anchor="middle" font-size="' + (sz > 70 ? 17 : 14) + '" fill="#2B2253">' + (max ? Math.round(p * 100) + '%' : '—') + '</text></svg>' + lab + '</div>'; };
  const col = p => p >= .95 ? '#00A3AD' : p >= .75 ? '#E0A030' : '#D4705A';
  function cards(){ const out = [];
    try{ if(typeof HRS !== 'undefined' && HRS && HRS.people){ const P = HRS.people.filter(p => p.days.length || p.base != null), mx = Math.max(1, ...P.map(p => +p.hours || 0));
      if(P.length) out.push('<div class="c" data-k="hrs"><div class="h"><b>Office hours</b><span>' + esc(HRS.label || '') + '</span></div><div class="bars">' +
        P.map(p => '<div class="br" title="' + esc(p.name) + ': ' + p.days.length + ' days · ' + p.hours + ' h · ' + p.late + ' late"><span>' + esc(p.name) + '</span><p><i style="width:' + Math.round((+p.hours || 0) / mx * 100) + '%;background:#6C5FC7"></i></p><b>' + Math.round(+p.hours || 0) + ' h <em>· ' + p.days.length + ' days' + (p.late ? ' · <span class="bad">' + p.late + ' late</span>' : '') + '</em></b></div>').join('') + '</div>' +
        (P.some(p => p.auto || p.open) ? '<div class="sm warn">' + P.filter(p => p.auto || p.open).map(p => esc(p.name) + ': ' + [p.auto ? p.auto + ' forgot to time out' : '', p.open ? p.open + ' still open' : ''].filter(Boolean).join(', ')).join(' · ') + '</div>' : '') + '</div>'); } }catch(e){}
    try{ if(typeof NG !== 'undefined' && NG && NG.tot){ const t = NG.tot, T = (NG.teachers || []).filter(x => x.fix).sort((a, b) => b.fix - a.fix).slice(0, 4), mx = Math.max(1, ...T.map(x => x.fix));
      out.push('<div class="c" data-k="ng"><div class="h"><b>Class records · ' + esc(NG.label || '') + '</b><span>' + (t.fix ? '<span class="bad">' + t.fix + ' to check</span>' : '<span class="ok">✓ all in</span>') + '</span></div><div class="side"><div class="rings">' +
        ring(t.vid, t.vidNeed, col(t.vidNeed ? t.vid / t.vidNeed : 1), 'videos ' + (t.vid || 0) + '/' + (t.vidNeed || 0)) + ring(t.hw, t.hwNeed, col(t.hwNeed ? t.hw / t.hwNeed : 1), 'homework ' + (t.hw || 0) + '/' + (t.hwNeed || 0)) + ring(t.note, t.noteNeed, col(t.noteNeed ? t.note / t.noteNeed : 1), 'notes ' + (t.note || 0) + '/' + (t.noteNeed || 0)) + '</div></div>' +
        (T.length ? '<div class="bars">' + T.map(x => '<div class="br"><span>' + esc(String(x.name).replace(/^teacher\s+/i, '')) + '</span><p><i style="width:' + Math.round(x.fix / mx * 100) + '%;background:#D4705A"></i></p><b>' + x.fix + ' <em>to check</em></b></div>').join('') + '</div>' : '') + '</div>'); } }catch(e){}
    try{ const vis = (typeof MVD !== 'undefined' && MVD) ? Object.keys(MVD).length : null, tgt = typeof VIS_TARGET !== 'undefined' ? VIS_TARGET : 5, L = (typeof COV !== 'undefined' && COV) ? COV.slice(0, 5) : [];
      if(vis != null || L.length){ const mx = Math.max(14, ...L.map(x => x.days == null ? 30 : x.days));
        out.push('<div class="c" data-k="hl"><div class="h"><b>Class visits today</b><span>each visit = quick QA</span></div><div class="side">' + ring(vis || 0, tgt, (vis || 0) >= tgt ? '#00A3AD' : '#E0A030', (vis || 0) + ' of ' + tgt + ' done', 78) +
          '<div style="flex:1;min-width:0"><div class="sm" style="margin-bottom:6px">Who to visit next · days since the last visit</div><div class="bars">' + L.map(x => { const d = x.days == null ? null : +x.days, c = d == null || d >= 14 ? '#D4705A' : d >= 7 ? '#E0A030' : '#00A3AD';
            return '<div class="br"><span>' + esc(String(x.teacher || '').replace(/^teacher\s+/i, '')) + '</span><p><i style="width:' + Math.round((d == null ? mx : d) / mx * 100) + '%;background:' + c + '"></i></p><b>' + (d == null ? 'never' : d + ' d') + '</b></div>'; }).join('') + '</div></div></div></div>'); } }catch(e){}
    try{ if(typeof HL !== 'undefined' && HL){ const T = HL.today || {}, used = +T.hours || 0, cap = +T.budget || 6, p = Math.min(1, used / cap), c = p >= .85 ? '#D4705A' : p >= .6 ? '#E0A030' : '#00A3AD';
      const R = 44, L = Math.PI * R, arc = '<svg width="110" height="66" viewBox="0 0 110 66"><path d="M11 58 A44 44 0 0 1 99 58" fill="none" stroke="#F1F0F6" stroke-width="10" stroke-linecap="round"/><path d="M11 58 A44 44 0 0 1 99 58" fill="none" stroke="' + c + '" stroke-width="10" stroke-linecap="round" stroke-dasharray="' + (p * L) + ' ' + L + '"/><text x="55" y="56" text-anchor="middle" font-size="15" fill="#2B2253" font-family="var(--brand)">' + used + '/' + cap + ' h</text></svg>';
      out.push('<div class="c" data-k="hl2"><div class="h"><b>System health</b><span>' + esc(HL.time || '') + '</span></div><div class="side">' + arc + '<div class="sm"><div class="' + (HL.ok ? 'ok' : 'bad') + '" style="font-weight:600">' + (HL.ok ? '✓ All systems normal' : esc(HL.issues[0] || '')) + '</div>Google daily allowance used today' + (HL.issues.length > 1 ? '<br>' + HL.issues.slice(1, 3).map(esc).join('<br>') : '') + '</div></div></div>'); } }catch(e){}
    try{ if(typeof PULSE !== 'undefined' && PULSE && PULSE.items && PULSE.items.length){ const I = PULSE.items, by = {}; I.forEach(x => { const h = parseInt(String(x.time || '').split(':')[0], 10); if(!isNaN(h)) by[h] = (by[h] || 0) + 1; });
      const hs = Object.keys(by).map(Number), a = Math.min(8, ...hs), b = Math.max(new Date().getHours(), ...hs), H = []; for(let h = a; h <= b; h++) H.push(h); const mx = Math.max(1, ...H.map(h => by[h] || 0));
      out.push('<div class="c w" data-k="feed"><div class="h"><b>Today in the app</b><span>' + I.length + ' changes</span></div><div class="two"><div class="cols">' + H.map(h => '<div title="' + h + ':00 · ' + (by[h] || 0) + '"><b>' + (by[h] || '') + '</b><i style="height:' + Math.round((by[h] || 0) / mx * 52) + 'px"></i><span>' + h + '</span></div>').join('') + '</div>' +
        '<div class="feed4">' + I.slice(0, 4).map(x => '<div><b>' + esc(x.time) + '</b>' + esc(x.kind || '') + ' · ' + esc(x.detail || '') + '</div>').join('') + '</div></div></div>'); } }catch(e){}
    return out; }
  const MAP = { hrs: 'hrs', ng: 'ng', hl: 'hl', hl2: 'hl', feed: 'feed' };
  window.bd14Open = function(k){ const d = [...document.querySelectorAll('#v-team details.tgrp')].find(x => x.querySelector('#' + { hrs: 'hrsBox', ng: 'ngBox', hl: 'hlBox', feed: 'feed' }[MAP[k]]));
    if(d){ d.open = true; d.scrollIntoView({ behavior: 'smooth', block: 'start' }); } };
  function paint(){ const v = $('v-team'); if(!v) return; const C = cards(); let bd = v.querySelector('.bd14');
    if(!C.length){ if(bd) bd.remove(); return; }
    const html = C.join(''); if(!bd){ const anchor = v.querySelector('.tgrp-h') || v.querySelector('.t13h'); if(!anchor) return; anchor.insertAdjacentHTML('beforebegin', '<div class="bd14"></div>'); bd = v.querySelector('.bd14'); }
    if(bd.innerHTML !== html){ bd.innerHTML = html; bd.querySelectorAll('.c').forEach(c => c.onclick = () => bd14Open(c.dataset.k)); }
    const m = v.querySelector('.tgrp-h'); if(m && m.textContent !== 'Full details') m.textContent = 'Full details'; }
  let t = 0; const later = () => { clearTimeout(t); t = setTimeout(() => { try{ paint(); }catch(e){} }, 150); };
  const r0 = window.renderTeam; if(r0) window.renderTeam = function(){ const r = r0.apply(this, arguments); later(); try{ ['hrsBox', 'ngBox', 'hlBox', 'feed'].forEach(id => { const b = $(id); if(b && !b._o14){ b._o14 = 1; new MutationObserver(later).observe(b, { childList: true }); } }); }catch(e){} return r; };
  try{ if(typeof VIEW !== 'undefined' && VIEW === 'team') renderTeam(); }catch(e){}
})();
/* Latest changes list: a coloured label per kind of change, filter pills (All · Schedule · Students · Time-ins · Leave · Money …),
   one quiet line each, grouped by hour. */
(function(){
  const K = [[/schedule|class/i, 'Schedule', '#00808A', '#E3F6F6'], [/time-in|late review/i, 'Time-ins', '#6C5FC7', '#EEEBFA'], [/leave/i, 'Leave', '#B7791F', '#FDF4E3'],
    [/expense|sale|pay|invoice|money/i, 'Money', '#1C7A55', '#E8F6EE'], [/trial|follow-up|enquir/i, 'Trials', '#C2410C', '#FFF1E8'], [/student|data fix|renew|report|agreement/i, 'Students', '#2B2253', '#EFEEF6']];
  const css = document.createElement('style'); css.textContent = `
#v-team .fd14{display:flex;flex-wrap:wrap;gap:6px;margin:4px 0 10px}
#v-team .fd14 button{border:1px solid var(--line);background:#fff;border-radius:999px;padding:5px 12px;font:inherit;font-size:12.5px;font-weight:600;color:var(--ink2);cursor:pointer}
#v-team .fd14 button.on{background:var(--ink);color:#fff;border-color:var(--ink)}
#v-team .fd14 button i{display:inline-block;width:8px;height:8px;border-radius:4px;margin-right:6px}
#v-team #feed .it{display:flex;gap:12px;align-items:baseline;padding:7px 4px!important;border-bottom:1px solid #F3F2F7;font-size:13.5px}
#v-team #feed .it .tm{font-weight:600;color:#8A86A0;width:44px;flex:none;font-size:12.5px}
#v-team #feed .it b:first-child{display:inline-block;font-size:11px;letter-spacing:.04em;text-transform:uppercase;padding:2px 8px;border-radius:999px;background:var(--kT,#F4F3F8);color:var(--k,#55526E);margin-right:4px}
#v-team #feed .hr14{font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:#8A86A0;margin:12px 0 2px}
#v-team #feed .it.x14{display:none}`;
  document.head.appendChild(css);
  let F = '';
  function kindOf(t){ const k = K.find(x => x[0].test(t)); return k || null; }
  window.fd14 = function(k){ F = F === k ? '' : k; tag(); };
  function tag(){ const f = $('feed'); if(!f) return; const items = [...f.querySelectorAll('.it')]; if(!items.length) return;
    const seen = {}; let lastH = '';
    f.querySelectorAll('.hr14').forEach(x => x.remove());
    items.forEach(it => { const b = it.querySelector('.grow b, b'); const kd = b ? b.textContent : ''; const k = kindOf(kd); const name = k ? k[1] : 'Other';
      it.dataset.k = name; if(k){ it.style.setProperty('--k', k[2]); it.style.setProperty('--kT', k[3]); } seen[name] = (seen[name] || 0) + 1;
      it.classList.toggle('x14', !!F && F !== name);
      const tmEl = it.querySelector('.tm'), h = tmEl ? String(tmEl.textContent).split(':')[0] : '';
      if(!it.classList.contains('x14') && h && h !== lastH){ lastH = h; it.insertAdjacentHTML('beforebegin', '<div class="hr14">' + h + ':00</div>'); } });
    let bar = f.previousElementSibling && f.previousElementSibling.classList.contains('fd14') ? f.previousElementSibling : null;
    if(!bar){ f.insertAdjacentHTML('beforebegin', '<div class="fd14"></div>'); bar = f.previousElementSibling; }
    const html = '<button class="' + (F ? '' : 'on') + '" onclick="fd14(\'\')">All · ' + items.length + '</button>' + K.filter(x => seen[x[1]]).map(x => '<button class="' + (F === x[1] ? 'on' : '') + '" onclick="fd14(\'' + x[1] + '\')"><i style="background:' + x[2] + '"></i>' + x[1] + ' · ' + seen[x[1]] + '</button>').join('') + (seen.Other ? '<button class="' + (F === 'Other' ? 'on' : '') + '" onclick="fd14(\'Other\')">Other · ' + seen.Other + '</button>' : '');
    if(bar.innerHTML !== html) bar.innerHTML = html; }
  let t = 0; const later = () => { clearTimeout(t); t = setTimeout(() => { try{ tag(); }catch(e){} }, 120); };
  const r0 = window.renderTeam; if(r0) window.renderTeam = function(){ const r = r0.apply(this, arguments); later(); try{ const f = $('feed'); if(f && !f._o15){ f._o15 = 1; new MutationObserver(m => { if(m.some(x => [...x.addedNodes].some(n => n.classList && n.classList.contains('it')))) later(); }).observe(f, { childList: true }); } }catch(e){} return r; };
})();
