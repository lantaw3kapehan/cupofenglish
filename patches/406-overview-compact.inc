/* 20 Oct · 406 · Overview on one laptop screen (Misty: "boxes too big, keep scrolling · be creative, best fitting charts").
   · Top band: greeting + today's sentence + three numbers + the To do line, all in one short card.
   · Four small cards side by side (two on narrower screens), each the chart that fits the question:
     Students by source = donut with the total inside + top 3 partners · Packages = donut (healthy / 5 or fewer / ran out)
     + "may not renew" link · Levels = column chart Pre-A1 → C2 · Students per teacher = compact bars, top 8.
   · Business and Quality sit side by side under it (wider Business), Last week beside nothing else, tighter.
   Values are written next to every slice and bar (colour is never the only cue); colours checked for colour-blind safety. */
(function(){
  const css = document.createElement('style');
  css.textContent = `
.ovc{gap:14px!important;margin-top:16px!important}
.ovc .x-top{background:linear-gradient(135deg,#F2FAFA 0%,#FFFFFF 55%);border:1px solid var(--line);border-radius:var(--r-lg);box-shadow:var(--sh1);padding:16px 20px;display:grid;grid-template-columns:minmax(0,1fr) auto;gap:8px 20px;align-items:center}
.ovc .x-top .d{font-size:12.5px;color:#8A86A0}
.ovc .x-top h1{font-family:var(--brand);font-weight:400;font-size:26px;line-height:1.15;margin:2px 0 2px;color:var(--ink)}
.ovc .x-top p{margin:0;font-size:14px;color:#55526E}
.ovc .x-top p b{color:var(--ink);font-weight:600}
.ovc .x-st{display:flex;gap:8px}
.ovc .x-st a{min-width:112px;background:#fff;border:1px solid var(--line);border-radius:var(--r-md);padding:9px 12px;cursor:pointer;color:var(--ink)!important;text-decoration:none}
.ovc .x-st span{display:block;font-size:10.5px;letter-spacing:.07em;text-transform:uppercase;color:#8A86A0}
.ovc .x-st b{display:block;font-family:var(--brand);font-weight:400;font-size:22px;line-height:1.2}
.ovc .x-st small{display:block;font-size:12px;color:#6F6B85;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:150px}
.ovc .x-todo{grid-column:1/-1;display:flex;align-items:center;gap:10px;border-top:1px solid var(--line);padding-top:10px;margin-top:4px;cursor:pointer;color:var(--ink)!important;text-decoration:none;min-width:0}
.ovc .x-todo i{width:9px;height:9px;border-radius:5px;background:var(--teal);flex:none}.ovc .x-todo.warm i{background:#E0A030}
.ovc .x-todo b{font-weight:600;font-size:14px;white-space:nowrap}
.ovc .x-todo span{flex:1;min-width:0;color:#8A86A0;font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ovc .x-todo em{font-style:normal;font-weight:700;color:var(--teal);white-space:nowrap}
.ovc .x-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px}
.ovc .x-c{background:#fff;border:1px solid var(--line);border-radius:var(--r-lg);box-shadow:var(--sh1);padding:14px 16px;cursor:pointer;display:flex;flex-direction:column;gap:10px;color:var(--ink)!important;text-decoration:none;min-width:0}
.ovc .x-c:hover,.ovc .x-st a:hover,.ovc .x-top:has(.x-todo:hover){box-shadow:0 0 0 1px var(--teal) inset,var(--sh1)}
.ovc .x-h{display:flex;align-items:baseline;justify-content:space-between;gap:8px}
.ovc .x-h b{font-size:14.5px;font-weight:700}
.ovc .x-h span{font-size:11.5px;color:#8A86A0;white-space:nowrap}
.ovc .x-dn{display:flex;align-items:center;gap:12px}
.ovc .x-dn svg{flex:none}
.ovc .x-dn svg text{font-family:var(--brand)}
.ovc .x-lg{display:flex;flex-direction:column;gap:4px;font-size:12.5px;color:#55526E;min-width:0}
.ovc .x-lg span{display:flex;align-items:center;gap:6px;white-space:nowrap}
.ovc .x-lg span:before{content:'';width:8px;height:8px;border-radius:4px;background:var(--c);flex:none}
.ovc .x-lg b{color:var(--ink);font-weight:600;margin-left:auto;padding-left:6px}
.ovc .x-mini{border-top:1px solid var(--line);padding-top:8px;display:flex;flex-direction:column;gap:3px;font-size:12px;color:#55526E}
.ovc .x-mini div{display:flex;gap:6px;align-items:center}.ovc .x-mini div span{flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ovc .x-mini div b{color:var(--ink);font-weight:600}
.ovc .x-mini em{font-style:normal;font-size:10.5px;letter-spacing:.07em;text-transform:uppercase;color:#8A86A0}
.ovc .x-warn{font-size:12.5px;color:#8A5A0F;background:#FBF4E6;border-radius:10px;padding:7px 10px}
.ovc .x-col{display:flex;align-items:flex-end;gap:6px;height:112px;padding-top:14px}
.ovc .x-col>div{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;height:100%;min-width:0}
.ovc .x-col i{display:block;width:100%;max-width:30px;border-radius:4px 4px 0 0;background:#00A3AD}
.ovc .x-col b{font-size:11.5px;color:var(--ink);font-weight:600;margin-bottom:3px}
.ovc .x-col span{font-size:11px;color:#8A86A0;margin-top:5px;white-space:nowrap}
.ovc .x-tb{display:flex;flex-direction:column;gap:5px}
.ovc .x-tb div{display:grid;grid-template-columns:62px minmax(0,1fr) 22px;gap:6px;align-items:center;font-size:12px;color:#55526E}
.ovc .x-tb div span{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ovc .x-tb div p{margin:0;height:6px;border-radius:3px;background:var(--soft);overflow:hidden}.ovc .x-tb div p i{display:block;height:100%;background:#8D87B8;border-radius:0 3px 3px 0}
.ovc .x-tb div b{text-align:right;color:var(--ink);font-weight:600}
.ovc .ov-two{grid-template-columns:minmax(0,1.6fr) minmax(0,1fr)!important;gap:14px!important}
.ovc .ov-two .ov-card,.ovc section.ov-card{padding:16px 18px!important;gap:10px!important}
.ovc section.ov-card>*:first-child,.ovc section.ov-card .ov-hd{margin-top:0!important}
.ovc section.ov-card h2{margin:0!important;font-size:16px}
@media(max-width:1250px){.ovc .x-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(max-width:900px){.ovc .x-top{grid-template-columns:1fr}.ovc .x-st{flex-wrap:wrap}.ovc .ov-two{grid-template-columns:1fr!important}}
@media(max-width:560px){.ovc .x-grid{grid-template-columns:1fr}}`;
  document.head.appendChild(css);
  const SRC = [['coe', 'CupOfEnglish', '#00A3AD'], ['pt', 'Partners', '#6C5FC7'], ['ref', 'Referrals', '#2E9E6F'], ['none', 'Not set', '#C9C6D6']];
  const LV = ['Pre-A1', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
  function donut(parts, center, sub){ const R = 34, C = 2 * Math.PI * R, tot = parts.reduce((a, p) => a + p[1], 0) || 1; let off = 0;
    const segs = parts.filter(p => p[1] > 0).map(([l, v, c]) => { const L = v / tot * C, gap = parts.filter(p => p[1] > 0).length > 1 ? 2 : 0;
      const s = '<circle cx="45" cy="45" r="' + R + '" fill="none" stroke="' + c + '" stroke-width="12" stroke-dasharray="' + Math.max(0, L - gap) + ' ' + (C - Math.max(0, L - gap)) + '" stroke-dashoffset="' + (-off) + '" transform="rotate(-90 45 45)"><title>' + esc(l) + ': ' + v + ' (' + Math.round(v / tot * 100) + '%)</title></circle>'; off += L; return s; }).join('');
    return '<svg width="90" height="90" viewBox="0 0 90 90" role="img" aria-label="' + esc(sub) + '"><circle cx="45" cy="45" r="' + R + '" fill="none" stroke="#F1F0F6" stroke-width="12"/>' + segs +
      '<text x="45" y="47" text-anchor="middle" font-size="20" fill="#2B2253">' + center + '</text><text x="45" y="61" text-anchor="middle" font-size="9" fill="#8A86A0" font-family="inherit">' + esc(sub) + '</text></svg>'; }
  function students(){ if(!(AT && AT.cols)) return null; const C = {}; AT.cols.forEach((c, i) => C[c] = i);
    const A = AT.rows.filter(r => r[C.active] === true || r[C.active] === 'TRUE'), seen = {}, out = [];
    A.forEach(r => { const code = String(r[C.code] || '').toUpperCase(); if(!/^ST-/.test(code) || seen[code]) return; seen[code] = 1; out.push({ code, teacher: String(r[C.teacher] || '').trim(), left: r[C.available] === '' ? null : +r[C.available], src: C.source != null ? String(r[C.source] || '').trim() : '' }); });
    return out; }
  function srcOf(L){ const M = {}; try{ if(DB && DB.rows){ const H = (DB.head || []).map(h => String(h || '').trim().toUpperCase()); let j = H.indexOf('SOURCE'); if(j < 0) j = 22; DB.rows.forEach(r => { const k = String(r[0] || '').toUpperCase(); if(/^ST-/.test(k) && !(k in M)) M[k] = String(r[j] || '').trim(); }); } }catch(e){}
    const kind = {}, partner = {}; L.forEach(s => { const v = M[s.code] || s.src || '', k = window.coeSrcKind ? coeSrcKind(v) : (v ? 'pt' : 'none'); kind[k] = (kind[k] || 0) + 1; if(k === 'pt'){ const p = v.replace(/^Partner\s*[–:-]\s*/i, '').replace(/\s+/g, ' ').trim(); partner[p] = (partner[p] || 0) + 1; } });
    return { kind, partner }; }
  const base = window.renderHome;
  window.renderHome = function(){
    const r = base.apply(this, arguments);
    try{ const v = $('v-home'), box = v && v.querySelector('.ovc'); if(!box || !D || !D.mgr) return r;
      const now = new Date(), hr = now.getHours(), first = String((D.me || {}).name || '').split(' ')[0];
      const hi = (hr < 12 ? 'Good morning' : hr < 18 ? 'Good afternoon' : 'Good evening') + (first && !/^CupOf/i.test(first) ? ', ' + esc(first) : '');
      const qq = hmQueue(), Q = qq.Q.filter(x => x.t !== 'App check'), W = qq.W, hotN = Q.filter(x => x.tone === 'hot').length;
      const sc = hmSched(), E = sc ? (sc.events || []) : null, live = E ? E.filter(e => !e.cancelled) : [], t = now.getTime();
      const done = live.filter(e => new Date(e.end) <= t), on = live.filter(e => new Date(e.start) <= t && new Date(e.end) > t), next = live.filter(e => new Date(e.start) > t).sort((a, b) => new Date(a.start) - new Date(b.start));
      const team = (MO && MO.team) || [], tc = s => team.filter(x => x.status === s).length, ontime = tc('On time'), due = ontime + tc('Late') + tc('Missing');
      let say = E ? (live.length ? '<b>' + live.length + ' classes</b> today' + (done.length ? ', ' + done.length + ' done' : '') + (on.length ? ', <b>' + on.length + ' on now</b>' : '') + '.' : 'No classes today.') : 'Reading today’s classes…';
      if(team.length) say += ' ' + team.length + ' teacher' + (team.length === 1 ? '' : 's') + ' teaching' + (due ? ', ' + ontime + ' of ' + due + ' on time so far' : '') + '.';
      const names = Q.map(x => x.t).concat(W.map(x => x.t));
      let h = '<section class="x-top"><div><div class="d">' + now.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' }) + '</div><h1>' + hi + '</h1><p>' + say + '</p></div><div class="x-st">' +
        '<a onclick="go(\'schedule\')"><span>Classes</span><b>' + (E ? done.length + '/' + live.length : '—') + '</b><small>' + (E ? (next.length ? next.length + ' to go' : 'all done') : '') + '</small></a>' +
        '<a onclick="go(\'team\')"><span>On time</span><b>' + (due ? ontime + '/' + due : '—') + '</b><small>' + (team.length ? team.length + ' teaching' : 'no classes') + '</small></a>' +
        '<a onclick="go(\'schedule\')"><span>' + (on.length ? 'On now' : 'Next') + '</span><b>' + (on.length ? on.length : next.length ? tm(next[0].start) : '—') + '</b><small>' + (on.length ? esc(on.map(e => tName(e.teacher)).slice(0, 2).join(', ')) : next.length ? esc(tName(next[0].teacher)) : 'no more today') + '</small></a></div>' +
        '<a class="x-todo ' + (hotN ? 'warm' : '') + '" onclick="go(\'mtoday\')"><i></i><b>' + (Q.length ? Q.length + (Q.length === 1 ? ' thing needs' : ' things need') + ' you' : 'Nothing needs you right now') + (W.length ? ' · ' + W.length + ' waiting on teachers' : '') + '</b><span>' + esc(names.slice(0, 4).join(' · ')) + '</span><em>To do ›</em></a></section>';
      const S = students();
      if(S){ const n = S.length, K = srcOf(S), kind = K.kind, P = Object.entries(K.partner).sort((a, b) => b[1] - a[1]).slice(0, 3), tot = n || 1;
        const c1 = '<a class="x-c" onclick="go(\'astudents\')"><div class="x-h"><b>Where students come from</b><span>active</span></div><div class="x-dn">' + donut(SRC.map(([k, l, c]) => [l, kind[k] || 0, c]), n, 'students') +
          '<div class="x-lg">' + SRC.filter(([k]) => kind[k]).map(([k, l, c]) => '<span style="--c:' + c + '">' + l + '<b>' + Math.round(kind[k] / tot * 100) + '%</b></span>').join('') + '</div></div>' +
          (P.length ? '<div class="x-mini"><em>Top partners</em>' + P.map(([p, c]) => '<div><span>' + esc(p) + '</span><b>' + c + '</b></div>').join('') + '</div>' : '') + '</a>';
        const out = S.filter(s => s.left != null && s.left <= 0).length, low = S.filter(s => s.left != null && s.left > 0 && s.left <= 5).length, ok = n - out - low;
        const rh = $('rnHome'), rk = rh ? (rh.textContent.match(/(\d+)\s+students?\s+may not renew/) || [])[1] : '';
        const c2 = '<a class="x-c" onclick="go(\'active\')"><div class="x-h"><b>Packages</b><span>lessons left</span></div><div class="x-dn">' + donut([['Healthy', ok, '#00A3AD'], ['5 or fewer left', low, '#E0A030'], ['Ran out', out, '#B4442F']], Math.round(ok / tot * 100) + '%', 'healthy') +
          '<div class="x-lg"><span style="--c:#00A3AD">Healthy<b>' + ok + '</b></span><span style="--c:#E0A030">5 or fewer<b>' + low + '</b></span><span style="--c:#B4442F">Ran out<b>' + out + '</b></span></div></div>' +
          (rk ? '<div class="x-warn"><b>' + rk + '</b> may not renew · see why ›</div>' : '') + '</a>';
        const LC = {}; ((typeof MS !== 'undefined' && MS) || []).forEach(s => { const l = (String(s.cefr || '').match(/Pre-A1|A1|A2|B1|B2|C1|C2/) || [])[0]; if(l) LC[l] = (LC[l] || 0) + 1; });
        const lmax = Math.max(1, ...LV.map(l => LC[l] || 0)), lsum = LV.reduce((a, l) => a + (LC[l] || 0), 0);
        const c3 = '<a class="x-c" onclick="go(\'astudents\')"><div class="x-h"><b>Levels</b><span>CEFR · ' + lsum + ' checked</span></div>' + (lsum ? '<div class="x-col">' + LV.map(l => '<div title="' + l + ': ' + (LC[l] || 0) + '"><b>' + (LC[l] || '') + '</b><i style="height:' + Math.max(LC[l] ? 4 : 0, Math.round((LC[l] || 0) / lmax * 78)) + 'px"></i><span>' + l + '</span></div>').join('') + '</div>' : '<div class="small mute">Open Students once to load the levels.</div>') + '</a>';
        const TC = {}; S.forEach(s => { const k = String(s.teacher || '—').replace(/^teacher\s+/i, ''); TC[k] = (TC[k] || 0) + 1; }); const TL = Object.entries(TC).sort((a, b) => b[1] - a[1]), tmax = TL.length ? TL[0][1] : 1;
        const c4 = '<a class="x-c" onclick="go(\'teachers\')"><div class="x-h"><b>Students per teacher</b><span>' + TL.length + ' teachers</span></div><div class="x-tb">' + TL.slice(0, 8).map(([k, c]) => '<div title="Teacher ' + esc(k) + ': ' + c + '"><span>' + esc(k) + '</span><p><i style="width:' + Math.round(c / tmax * 100) + '%"></i></p><b>' + c + '</b></div>').join('') + (TL.length > 8 ? '<div><span class="mute">+' + (TL.length - 8) + ' more</span><p style="background:none"></p><b></b></div>' : '') + '</div></a>';
        h += '<div class="x-grid">' + c1 + c2 + c3 + c4 + '</div>'; }
      [...box.children].forEach(el => { if(el.matches('.c-hi, .c-todo, .c-grid')) el.remove(); });
      box.insertAdjacentHTML('afterbegin', h);
      const two = box.querySelector('.ov-two'), ws = box.querySelector(':scope > section.ov-card');
      if(two && ws) box.insertBefore(two, ws);   /* Business + Quality first, Last week after */
    }catch(e){ console.warn('compact overview', e); }
    return r; };
  try{ if(typeof VIEW !== 'undefined' && VIEW === 'home') renderHome(); }catch(e){}
})();
