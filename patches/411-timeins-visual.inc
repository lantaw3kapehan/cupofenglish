/* 20 Oct · 411 · Time-ins at a glance (Misty: "go to Time-ins").
   · One summary card: a ring "1 of 9 timed in", the six counts as small coloured keys (on time teal · late coral ·
     missing coral · not on app amber · not yet slate · no class grey) and "Next due 17:00 · Teacher Mayi" on the right.
   · "Today's timeline": every teacher on one line from the first due time to the last class — a tick where the
     time-in is due (30 min before the first class), a dot where they timed in (teal on time, coral late), a hollow dot
     while still waiting, and a line for "now". Problems stand out without reading the list.
   · My time-in becomes a slim line. The full list (Teachers today, Office) stays below as before. */
(function(){
  const css = document.createElement('style');
  css.textContent = `
#v-team .ti-sum,#v-team .ti2-bar{display:none!important}
#v-team .t11{display:grid;grid-template-columns:auto minmax(0,1fr) auto;gap:18px;align-items:center;background:#fff;border:1px solid var(--line);border-radius:var(--r-lg);box-shadow:var(--sh1);padding:14px 18px;margin-top:16px}
#v-team .t11 .rg{position:relative;width:64px;height:64px}
#v-team .t11 .rg b{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-family:var(--brand);font-weight:400;font-size:18px;color:var(--ink)}
#v-team .t11 .ks{display:flex;flex-wrap:wrap;gap:6px 18px}
#v-team .t11 .ks span{display:flex;align-items:baseline;gap:6px;font-size:13px;color:#55526E}
#v-team .t11 .ks span:before{content:'';width:9px;height:9px;border-radius:5px;background:var(--c);align-self:center}
#v-team .t11 .ks b{font-family:var(--brand);font-weight:400;font-size:20px;color:var(--ink)}
#v-team .t11 .ks span.z{opacity:.45}
#v-team .t11 .nx{text-align:right;font-size:13px;color:#8A86A0}
#v-team .t11 .nx b{display:block;font-size:15px;color:#00737B}
#v-team .t11h{font-size:11px;letter-spacing:.07em;text-transform:uppercase;color:#8A86A0;margin-bottom:4px}
#v-team .tl11{background:#fff;border:1px solid var(--line);border-radius:var(--r-lg);box-shadow:var(--sh1);padding:14px 18px 10px;margin-top:14px}
#v-team .tl11 .hd{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:8px}
#v-team .tl11 .hd b{font-size:15px;color:var(--ink)}
#v-team .tl11 .hd span{font-size:12px;color:#8A86A0}
#v-team .tl11 .ax,#v-team .tl11 .r{display:grid;grid-template-columns:110px minmax(0,1fr) 70px;gap:10px;align-items:center}
#v-team .tl11 .ax div{position:relative;height:16px}
#v-team .tl11 .ax i{position:absolute;transform:translateX(-50%);font-style:normal;font-size:10.5px;color:#8A86A0}
#v-team .tl11 .r{height:24px}
#v-team .tl11 .r>span{font-size:12.5px;color:#3F3B5C;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#v-team .tl11 .r>em{font-style:normal;font-size:11.5px;color:#8A86A0;text-align:right;white-space:nowrap}
#v-team .tl11 .tr{position:relative;height:24px}
#v-team .tl11 .tr:before{content:'';position:absolute;left:0;right:0;top:11px;height:2px;background:var(--soft);border-radius:1px}
#v-team .tl11 .cl{position:absolute;top:9px;height:6px;border-radius:3px;background:#E3E1EC}
#v-team .tl11 .du{position:absolute;top:5px;width:2px;height:14px;background:#8A86A0;border-radius:1px}
#v-team .tl11 .dt{position:absolute;top:6px;width:12px;height:12px;border-radius:6px;transform:translateX(-50%);box-shadow:0 0 0 2px #fff}
#v-team .tl11 .dt.ok{background:#00A3AD}#v-team .tl11 .dt.late{background:#D4705A}#v-team .tl11 .dt.wait{background:#fff;border:2px solid #8A86A0;box-sizing:border-box}#v-team .tl11 .dt.miss{background:#fff;border:2px solid #D4705A;box-sizing:border-box}
#v-team .tl11 .now{position:absolute;top:0;bottom:0;width:0;border-left:1.5px dashed #00A3AD;z-index:1}
#v-team .tl11 .lg{display:flex;flex-wrap:wrap;gap:4px 16px;font-size:11.5px;color:#8A86A0;margin-top:6px;padding-left:120px}
#v-team .tl11 .lg span{display:inline-flex;align-items:center;gap:5px}
#v-team .tl11 .lg i{display:inline-block}
#v-team .tin{padding:10px 16px!important}
#v-team .tin .big{font-size:22px!important}
@media(max-width:700px){#v-team .t11{grid-template-columns:auto minmax(0,1fr)}#v-team .t11 .nx{grid-column:1/-1;text-align:left}#v-team .tl11 .ax,#v-team .tl11 .r{grid-template-columns:70px minmax(0,1fr) 46px}#v-team .tl11 .lg{padding-left:0}}`;
  document.head.appendChild(css);
  const hhmm = d => String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
  const toDate = (t, base) => { const m = String(t || '').match(/(\d{1,2}):(\d{2})/); if(!m) return null; const d = new Date(base); d.setHours(+m[1], +m[2], 0, 0); return d; };
  function build(){ const v = $('v-team'); if(!v || v.querySelector('.t11')) return;
    const T = ((MO && MO.team) || (D && D.team) || []).slice(), cnt = {}; T.forEach(x => cnt[x.status] = (cnt[x.status] || 0) + 1);
    const work = T.filter(x => x.status !== 'No class'), inN = work.filter(x => x.timeIn).length, now = new Date();
    const K = [['On time', 'on time', '#00A3AD'], ['Late', 'late', '#D4705A'], ['Missing', 'missing', '#B4442F'], ['Not on app', 'not on app', '#E0A030'], ['_wait', 'not yet', '#8A86A0'], ['No class', 'no class', '#C9C6D6']];
    const wait = work.filter(x => !x.timeIn && !/^(Late|Missing|Not on app)$/.test(x.status || '')).length; cnt._wait = wait; cnt['On time'] = work.filter(x => x.status === 'On time').length;
    const due = x => { const f = x.first ? new Date(x.first) : null; return f && !isNaN(f) ? new Date(f.getTime() - 30 * 6e4) : null; };
    const nxt = work.filter(x => !x.timeIn && due(x) && due(x) > now).sort((a, b) => due(a) - due(b))[0];
    const R = 26, C = 2 * Math.PI * R, pct = work.length ? inN / work.length : 0;
    const ring = '<div class="rg"><svg width="64" height="64" viewBox="0 0 64 64"><circle cx="32" cy="32" r="' + R + '" fill="none" stroke="#F1F0F6" stroke-width="8"/><circle cx="32" cy="32" r="' + R + '" fill="none" stroke="#00A3AD" stroke-width="8" stroke-linecap="round" stroke-dasharray="' + (pct * C) + ' ' + C + '" transform="rotate(-90 32 32)"/></svg><b>' + inN + '/' + work.length + '</b></div>';
    const head = '<div class="t11">' + ring + '<div><div class="t11h">Timed in today</div><div class="ks">' + K.map(([k, l, c]) => '<span class="' + (cnt[k] ? '' : 'z') + '" style="--c:' + c + '"><b>' + (cnt[k] || 0) + '</b>' + l + '</span>').join('') + '</div></div>' +
      '<div class="nx">' + (nxt ? 'Next due<b>' + hhmm(due(nxt)) + ' · ' + esc(tName(nxt.name)) + '</b>' : work.length ? (inN === work.length ? '<b>✓ Everyone is in</b>' : '') : 'No classes today') + '</div></div>';
    let tl = '';
    const W = work.filter(x => due(x)).sort((a, b) => due(a) - due(b));
    if(W.length){ const ends = W.map(x => { const f = new Date(x.first); const n = +x.classes || 1; return new Date(f.getTime() + Math.max(1, n) * 30 * 6e4); });
      let a = new Date(Math.min(...W.map(x => due(x).getTime()))); a.setMinutes(0, 0, 0); let b = new Date(Math.max(...ends.map(d => d.getTime()), now.getTime())); b.setMinutes(60, 0, 0);
      const span = b - a, x = d => Math.max(0, Math.min(100, (d - a) / span * 100));
      const hrs = []; for(let t = new Date(a); t <= b; t = new Date(t.getTime() + 36e5)) hrs.push(t);
      const step = hrs.length > 9 ? 2 : 1;
      tl = '<div class="tl11"><div class="hd"><b>Today’s timeline</b><span>tick = due (30 min before the first class) · dot = timed in</span></div>' +
        '<div class="ax"><span></span><div>' + hrs.filter((_, i) => i % step === 0).map(t => '<i style="left:' + x(t) + '%">' + hhmm(t) + '</i>').join('') + '</div><span></span></div>' +
        W.map((p, i) => { const d = due(p), f = new Date(p.first), ti = p.timeIn ? toDate(p.timeIn, f) : null, late = /Late|Missing/.test(p.status || '');
          const k = ti ? (late ? 'late' : 'ok') : (now > d ? 'miss' : 'wait'), pos = ti ? x(ti) : x(d);
          return '<div class="r" title="' + esc(tName(p.name) + ' · due ' + hhmm(d) + ' · first class ' + hhmm(f) + (ti ? ' · in ' + p.timeIn : ' · not yet')) + '"><span>' + esc(String(p.name || '').replace(/^teacher\s+/i, '')) + '</span><div class="tr">' +
            '<i class="cl" style="left:' + x(f) + '%;width:' + Math.max(1, x(ends[i]) - x(f)) + '%"></i><i class="du" style="left:' + x(d) + '%"></i><i class="dt ' + k + '" style="left:' + pos + '%"></i>' + (i === 0 ? '' : '') + '</div><em>' + (ti ? esc(p.timeIn) : 'by ' + hhmm(d)) + '</em></div>'; }).join('') +
        '<div class="lg"><span><i style="width:12px;height:12px;border-radius:6px;background:#00A3AD"></i>on time</span><span><i style="width:12px;height:12px;border-radius:6px;background:#D4705A"></i>late</span><span><i style="width:10px;height:10px;border-radius:6px;border:2px solid #8A86A0"></i>waiting</span><span><i style="width:10px;height:10px;border-radius:6px;border:2px solid #D4705A"></i>past due, no time-in</span><span><i style="width:16px;height:6px;border-radius:3px;background:#E3E1EC"></i>classes</span><span><i style="height:12px;border-left:1.5px dashed #00A3AD"></i>now</span></div></div>';
      setTimeout(() => { const box = v.querySelector('.tl11'); if(!box) return; const tr = box.querySelectorAll('.tr'); if(!tr.length) return; const p = x(now);
        tr.forEach(t => { if(!t.querySelector('.now')) t.insertAdjacentHTML('beforeend', '<i class="now" style="left:' + p + '%"></i>'); }); }, 0); }
    const lead = v.querySelector('.lead'); if(lead) lead.insertAdjacentHTML('afterend', head + tl); else v.insertAdjacentHTML('afterbegin', head + tl); }
  const r0 = window.renderTeam; if(r0) window.renderTeam = function(){ const r = r0.apply(this, arguments); try{ build(); }catch(e){ console.warn('t11', e); } return r; };
  try{ if(typeof VIEW !== 'undefined' && VIEW === 'team') renderTeam(); }catch(e){}
})();
