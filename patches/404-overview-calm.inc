/* 20 Oct · 404 · A calm Overview (Misty: "it makes me stressed instead of motivated · chaotic · focus more on visuals").
   Overview is for looking, not acting. Light and quiet, one idea per card, every card opens its own screen:
   · Welcome: greeting, date and one sentence about today; three soft numbers (classes, teachers on time, next class).
   · To do: one calm line · "2 things need you ›" (no red unless something is urgent).
   · Four pictures of the school: Students by source (+ top partners) · Packages (healthy / low / ran out, and the
     "may not renew" count as a link) · Levels (CEFR) · Students per teacher.
   · Below: Last week (Mon–Tue), Business and Quality as before. Phone alerts and the warning banner move to small links.
   Colours: teal CupOfEnglish, purple partners, green referrals, grey not set (checked for colour-blind safety); values
   always written next to the bars. Nothing is removed from the app: each number still opens the screen with the full list. */
(function(){
  const css = document.createElement('style');
  css.textContent = `
#v-home #rnHome,#v-home #pushAl{display:none!important}
.ovc{display:flex;flex-direction:column;gap:18px;margin-top:22px}
.ovc .c-hi{background:linear-gradient(135deg,#F2FAFA 0%,#FFFFFF 60%);border:1px solid var(--line);border-radius:var(--r-lg);box-shadow:var(--sh1);padding:22px 26px;display:grid;grid-template-columns:minmax(0,1fr) auto;gap:20px;align-items:center}
.ovc .c-hi .d{font-size:13px;color:#8A86A0;letter-spacing:.02em}
.ovc .c-hi h1{font-family:var(--brand);font-weight:400;font-size:32px;line-height:1.15;margin:4px 0 6px;color:var(--ink)}
.ovc .c-hi p{margin:0;font-size:15px;color:#55526E;line-height:1.5}
.ovc .c-hi p b{color:var(--ink);font-weight:600}
.ovc .c-st{display:grid;grid-template-columns:repeat(3,minmax(120px,160px));gap:10px}
.ovc .c-st a{display:block;background:#fff;border:1px solid var(--line);border-radius:var(--r-md);padding:12px 14px;cursor:pointer;color:var(--ink)!important;text-decoration:none}
.ovc .c-st a:hover,.ovc .c-card:hover,.ovc .c-todo:hover{box-shadow:0 0 0 1px var(--teal) inset,var(--sh1)}
.ovc .c-st span{display:block;font-size:11.5px;letter-spacing:.06em;text-transform:uppercase;color:#8A86A0}
.ovc .c-st b{display:block;font-family:var(--brand);font-weight:400;font-size:26px;line-height:1.2;color:var(--ink)}
.ovc .c-st small{display:block;font-size:12.5px;color:#6F6B85;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ovc .c-todo{display:flex;align-items:center;gap:14px;background:#fff;border:1px solid var(--line);border-radius:var(--r-lg);box-shadow:var(--sh1);padding:14px 20px;cursor:pointer;color:var(--ink)!important;text-decoration:none}
.ovc .c-todo i{width:10px;height:10px;border-radius:5px;background:var(--teal);flex:none}
.ovc .c-todo.warm i{background:#D9962B}
.ovc .c-todo b{font-weight:600;font-size:15px}
.ovc .c-todo span{flex:1;min-width:0;color:#8A86A0;font-size:13.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ovc .c-todo em{font-style:normal;font-weight:700;color:var(--teal);white-space:nowrap}
.ovc .c-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px}
.ovc .c-card{background:#fff;border:1px solid var(--line);border-radius:var(--r-lg);box-shadow:var(--sh1);padding:18px 22px 20px;cursor:pointer;display:flex;flex-direction:column;gap:12px;color:var(--ink)!important;text-decoration:none;min-width:0}
.ovc .c-h{display:flex;align-items:baseline;justify-content:space-between;gap:10px}
.ovc .c-h h2{font-size:17px;margin:0;color:var(--ink)}
.ovc .c-h span{font-size:12.5px;color:#8A86A0}
.ovc .c-big{font-family:var(--brand);font-weight:400;font-size:30px;line-height:1;color:var(--ink)}
.ovc .c-big small{font-family:var(--f);font-size:13px;color:#8A86A0;margin-left:6px}
.ovc .c-bar{display:flex;height:12px;border-radius:6px;overflow:hidden;gap:2px;background:var(--soft)}
.ovc .c-bar i{display:block;min-width:3px}
.ovc .c-key{display:flex;flex-wrap:wrap;gap:6px 16px;font-size:13px;color:#55526E}
.ovc .c-key span{display:inline-flex;align-items:center;gap:6px}
.ovc .c-key span:before{content:'';width:9px;height:9px;border-radius:5px;background:var(--c)}
.ovc .c-key b{color:var(--ink);font-weight:600}
.ovc .c-rows{display:flex;flex-direction:column;gap:8px}
.ovc .c-r{display:grid;grid-template-columns:minmax(80px,140px) minmax(0,1fr) 44px;align-items:center;gap:10px;font-size:13px;color:#55526E}
.ovc .c-r>span{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ovc .c-r>div{height:8px;border-radius:4px;background:var(--soft);overflow:hidden}
.ovc .c-r>div i{display:block;height:100%;border-radius:0 4px 4px 0;background:var(--c,#00A3AD)}
.ovc .c-r>b{text-align:right;color:var(--ink);font-weight:600}
.ovc .c-sub{font-size:11.5px;letter-spacing:.06em;text-transform:uppercase;color:#8A86A0;margin-top:2px}
.ovc .c-link{font-size:13px;color:#8A5A0F;background:#FBF4E6;border-radius:10px;padding:8px 12px}
.ovc .c-link b{font-weight:700}
.ovc .c-foot{display:flex;flex-wrap:wrap;gap:8px 18px;font-size:13px;color:#8A86A0;padding:0 4px}
.ovc .c-foot a{color:var(--teal);cursor:pointer}
.ovc section.ov-card{border:1px solid var(--line)!important;border-radius:var(--r-lg)!important;box-shadow:var(--sh1)!important;background:#fff}
.ovc .ov-two{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px}
@media(max-width:1000px){.ovc .c-hi{grid-template-columns:1fr}.ovc .c-grid,.ovc .ov-two{grid-template-columns:1fr}}
@media(max-width:560px){.ovc .c-st{grid-template-columns:repeat(3,minmax(0,1fr))}.ovc .c-hi h1{font-size:26px}}`;
  document.head.appendChild(css);
  const SRC = [['coe', 'CupOfEnglish', '#00A3AD'], ['pt', 'Partners', '#6C5FC7'], ['ref', 'Referrals', '#2E9E6F'], ['none', 'Not set', '#C9C6D6']];
  const LV = ['Pre-A1', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
  let askedDb = 0;
  const bars = (L, max, c) => '<div class="c-rows">' + L.map(([k, n]) => '<div class="c-r" title="' + esc(k) + ': ' + n + '"><span>' + esc(k) + '</span><div><i style="width:' + (max ? Math.max(3, Math.round(n / max * 100)) : 0) + '%;--c:' + c + '"></i></div><b>' + n + '</b></div>').join('') + '</div>';
  function students(){ if(!(AT && AT.cols)) return null; const C = {}; AT.cols.forEach((c, i) => C[c] = i);
    const A = AT.rows.filter(r => r[C.active] === true || r[C.active] === 'TRUE'), seen = {}, out = [];
    A.forEach(r => { const code = String(r[C.code] || '').toUpperCase(); if(!/^ST-/.test(code) || seen[code]) return; seen[code] = 1; out.push({ code, teacher: String(r[C.teacher] || '').trim(), left: r[C.available] === '' ? null : +r[C.available], src: C.source != null ? String(r[C.source] || '').trim() : '' }); });
    return out; }
  function srcOf(L){ const M = {}; try{ if(DB && DB.rows){ const H = (DB.head || []).map(h => String(h || '').trim().toUpperCase()); let j = H.indexOf('SOURCE'); if(j < 0) j = 22; DB.rows.forEach(r => { const k = String(r[0] || '').toUpperCase(); if(/^ST-/.test(k) && !(k in M)) M[k] = String(r[j] || '').trim(); }); } }catch(e){}
    const kind = {}, partner = {}; L.forEach(s => { const v = M[s.code] || s.src || '', k = window.coeSrcKind ? coeSrcKind(v) : (v ? 'pt' : 'none'); kind[k] = (kind[k] || 0) + 1; if(k === 'pt'){ const p = v.replace(/^Partner\s*[–:-]\s*/i, '').replace(/\s+/g, ' ').trim(); partner[p] = (partner[p] || 0) + 1; } });
    return { kind, partner, have: !!(DB && DB.rows) }; }
  const base = window.renderHome;
  window.renderHome = function(){
    const r = base.apply(this, arguments);
    try{ const v = $('v-home'); if(!v || !D || !D.mgr) return r;
      const keepTwo = v.querySelector('.ov-two'), keepWs = v.querySelector('.ov2 > section.ov-card'), app = v.querySelector('.o2-foot');
      const now = new Date(), hr = now.getHours(), first = String((D.me || {}).name || '').split(' ')[0];
      const hi = (hr < 12 ? 'Good morning' : hr < 18 ? 'Good afternoon' : 'Good evening') + (first && !/^CupOf/i.test(first) ? ', ' + esc(first) : '');
      const qq = hmQueue(), Q = qq.Q.filter(x => x.t !== 'App check'), W = qq.W, hotN = Q.filter(x => x.tone === 'hot').length;
      const sc = hmSched(), E = sc ? (sc.events || []) : null, live = E ? E.filter(e => !e.cancelled) : [], t = now.getTime();
      const done = live.filter(e => new Date(e.end) <= t), on = live.filter(e => new Date(e.start) <= t && new Date(e.end) > t), next = live.filter(e => new Date(e.start) > t).sort((a, b) => new Date(a.start) - new Date(b.start));
      const team = (MO && MO.team) || [], tc = s => team.filter(x => x.status === s).length, ontime = tc('On time'), due = ontime + tc('Late') + tc('Missing');
      const S = students();
      let say = E ? (live.length ? '<b>' + live.length + ' classes</b> today' + (done.length ? ', ' + done.length + ' done' : '') + (on.length ? ', <b>' + on.length + ' on now</b>' : '') + '.' : 'No classes today.') : 'Reading today’s classes…';
      if(team.length) say += ' ' + team.length + ' teacher' + (team.length === 1 ? '' : 's') + ' teaching' + (due ? ', ' + ontime + ' of ' + due + ' on time so far' : '') + '.';
      let h = '<section class="c-hi"><div><div class="d">' + now.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' }) + '</div><h1>' + hi + '</h1><p>' + say + '</p></div><div class="c-st">' +
        '<a onclick="go(\'schedule\')"><span>Classes</span><b>' + (E ? done.length + '/' + live.length : '—') + '</b><small>' + (E ? (next.length ? next.length + ' to go' : 'all done') : '') + '</small></a>' +
        '<a onclick="go(\'team\')"><span>On time</span><b>' + (due ? ontime + '/' + due : team.length ? '—' : '—') + '</b><small>' + (team.length ? team.length + ' teaching' : 'no classes') + '</small></a>' +
        '<a onclick="go(\'schedule\')"><span>' + (on.length ? 'On now' : 'Next') + '</span><b>' + (on.length ? on.length : next.length ? tm(next[0].start) : '—') + '</b><small>' + (on.length ? esc(on.map(e => tName(e.teacher)).slice(0, 2).join(', ')) : next.length ? esc(tName(next[0].teacher)) : 'no more today') + '</small></a></div></section>';
      const names = Q.map(x => x.t).concat(W.map(x => x.t));
      h += '<a class="c-todo ' + (hotN ? 'warm' : '') + '" onclick="go(\'mtoday\')"><i></i><b>' + (Q.length ? Q.length + ' thing' + (Q.length === 1 ? '' : 's') + ' need you' : 'Nothing needs you right now') + (W.length ? ' · ' + W.length + ' waiting on teachers' : '') + '</b><span>' + esc(names.slice(0, 4).join(' · ')) + '</span><em>To do ›</em></a>';
      if(S){ const n = S.length, src = srcOf(S), K = src.kind;
        if(!src.have && !askedDb && typeof loadDb === 'function'){ askedDb = 1; loadDb(true).then(() => { if(VIEW === 'home') renderHome(); }).catch(() => 0); }
        const tot = SRC.reduce((a, [k]) => a + (K[k] || 0), 0) || 1;
        const P = Object.entries(src.partner).sort((a, b) => b[1] - a[1]).slice(0, 5);
        const c1 = '<a class="c-card" onclick="go(\'astudents\')"><div class="c-h"><h2>Where students come from</h2><span>active students</span></div><div class="c-big">' + n + '<small>active</small></div>' +
          '<div class="c-bar">' + SRC.map(([k, l, c]) => K[k] ? '<i title="' + l + ': ' + K[k] + ' (' + Math.round(K[k] / tot * 100) + '%)" style="flex:' + K[k] + ';background:' + c + '"></i>' : '').join('') + '</div>' +
          '<div class="c-key">' + SRC.filter(([k]) => K[k]).map(([k, l, c]) => '<span style="--c:' + c + '">' + l + ' <b>' + Math.round(K[k] / tot * 100) + '%</b> · ' + K[k] + '</span>').join('') + '</div>' +
          (P.length ? '<div class="c-sub">Top partners</div>' + bars(P, P[0][1], '#6C5FC7') : '') + '</a>';
        const out = S.filter(s => s.left != null && s.left <= 0).length, low = S.filter(s => s.left != null && s.left > 0 && s.left <= 5).length, ok = n - out - low;
        const risk = $('rnHome'), rk = risk ? (risk.textContent.match(/(\d+)\s+students?\s+may not renew/) || [])[1] : '';
        const c2 = '<a class="c-card" onclick="go(\'active\')"><div class="c-h"><h2>Packages</h2><span>lessons left</span></div><div class="c-big">' + ok + '<small>healthy</small></div>' +
          '<div class="c-bar"><i title="Healthy: ' + ok + '" style="flex:' + ok + ';background:#00A3AD"></i><i title="5 or fewer left: ' + low + '" style="flex:' + low + ';background:#D9962B"></i><i title="Ran out: ' + out + '" style="flex:' + out + ';background:#D4705A"></i></div>' +
          '<div class="c-key"><span style="--c:#00A3AD">Healthy <b>' + ok + '</b></span><span style="--c:#D9962B">5 or fewer left <b>' + low + '</b></span><span style="--c:#D4705A">Ran out <b>' + out + '</b></span></div>' +
          (rk ? '<div class="c-link"><b>' + rk + '</b> may not renew · see who and why ›</div>' : '') + '</a>';
        const LC = {}; ((typeof MS !== 'undefined' && MS) || []).forEach(s => { const l = (String(s.cefr || '').match(/Pre-A1|A1|A2|B1|B2|C1|C2/) || [])[0] || 'No check yet'; LC[l] = (LC[l] || 0) + 1; });
        const LL = LV.filter(l => LC[l]).map(l => [l, LC[l]]).concat(LC['No check yet'] ? [['No check yet', LC['No check yet']]] : []), lmax = Math.max(1, ...LL.map(x => x[1]));
        const c3 = '<a class="c-card" onclick="go(\'astudents\')"><div class="c-h"><h2>Levels</h2><span>CEFR from progress checks</span></div>' + (LL.length ? bars(LL, lmax, '#00A3AD') : '<div class="small mute">Open Students once to load the levels.</div>') + '</a>';
        const TC = {}; S.forEach(s => { const k = tName(s.teacher || '—'); TC[k] = (TC[k] || 0) + 1; }); const TL = Object.entries(TC).sort((a, b) => b[1] - a[1]).slice(0, 8);
        const c4 = '<a class="c-card" onclick="go(\'teachers\')"><div class="c-h"><h2>Students per teacher</h2><span>' + Object.keys(TC).length + ' teachers</span></div>' + bars(TL, TL.length ? TL[0][1] : 1, '#8D87B8') + '</a>';
        h += '<div class="c-grid">' + c1 + c2 + c3 + c4 + '</div>'; }
      v.innerHTML = '<div class="ovc">' + h + '</div>';
      const box = v.querySelector('.ovc');
      if(keepWs) box.appendChild(keepWs);
      if(keepTwo) box.appendChild(keepTwo);
      const ft = document.createElement('div'); ft.className = 'c-foot';
      ft.innerHTML = '<a onclick="window.pushAlSheet && pushAlSheet()">Phone alerts ›</a>' + (app ? app.innerHTML.replace(/<span>/, '<span>').replace('Open ›', 'App check ›') : '');
      box.appendChild(ft);
    }catch(e){ console.warn('calm overview', e); }
    return r; };
  try{ if(typeof VIEW !== 'undefined' && VIEW === 'home') renderHome(); }catch(e){}
})();
