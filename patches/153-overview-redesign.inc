(function(){
  // 15 Oct · Management Overview, redesigned (Misty: "the best way possible", minimal, premium).
  // Same numbers and the same buttons as before; only the layout and look change:
  //  · a calmer header with three status tiles (needs you · live / next class · classes left);
  //  · four equal KPI cards, each: label, big number, one bar, one line of detail;
  //  · "Decide now" fills the width; "Waiting on teachers" becomes a short list beside it;
  //  · App check (a technical note) moves to a quiet line at the bottom;
  //  · Business wide, Quality narrow beside it (no empty half-card).
  const css = `
.ov2{gap:26px}
.ov2 .o2-hero{position:relative;overflow:hidden;border-radius:24px;padding:26px 30px;color:#fff;display:grid;grid-template-columns:minmax(0,1fr) auto;gap:22px;align-items:center;
  background:radial-gradient(120% 140% at 100% 0%,rgba(0,163,173,.38) 0%,rgba(0,163,173,0) 55%),linear-gradient(135deg,#2B2253 0%,#2A2558 60%,#243E5E 100%)}
.ov2 .o2-hero .ov-cup{right:-30px;bottom:-46px;width:220px;opacity:.07}
.ov2 .o2-eye{font-size:13px;letter-spacing:.06em;color:#9FDDE1}
.ov2 .o2-hero h1{margin:6px 0 4px;font-family:var(--brand);font-weight:400;font-size:36px;line-height:1.1;color:#fff}
.ov2 .o2-tag{font-size:14px;color:#CFCBE6}.ov2 .o2-tag span{display:block}
.ov2 .o2-tag .zh{margin-top:3px;font-family:'PingFang SC','Hiragino Sans GB','Noto Sans SC','Microsoft YaHei',sans-serif;letter-spacing:.14em;font-size:.9em;opacity:.75}
.ov2 .o2-st{position:relative;display:grid;grid-template-columns:repeat(3,minmax(150px,190px));gap:10px}
.ov2 .o2-s{display:flex;flex-direction:column;gap:2px;padding:14px 16px;border-radius:18px;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.14);color:#fff!important;min-width:0;transition:background .15s}
.ov2 .o2-s:hover{background:rgba(255,255,255,.12)}
.ov2 .o2-s span{font-size:12px;color:#BEB9DA;letter-spacing:.03em}
.ov2 .o2-s b{font-family:var(--brand);font-weight:400;font-size:26px;line-height:1.15;display:flex;align-items:center;gap:8px}
.ov2 .o2-s small{font-size:12.5px;color:#D9D6EC;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ov2 .o2-s.hot{background:#fff;border-color:#fff;color:#2B2253!important}.ov2 .o2-s.hot span,.ov2 .o2-s.hot small{color:#6F6B85}.ov2 .o2-s.hot b{color:#B4513B}
.ov2 .o2-s .ov-live{width:10px;height:10px}
.ov2 .o2-kpi{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:16px}
.ov2 .o2-k{background:#fff;border-radius:20px;padding:18px 20px;display:flex;flex-direction:column;gap:10px;min-width:0;border:1px solid #EEF0F4;box-shadow:0 1px 2px rgba(43,34,83,.04);transition:transform .15s var(--ease),box-shadow .15s}
.ov2 .o2-k:hover{transform:translateY(-2px);box-shadow:0 12px 28px rgba(43,34,83,.09)}
.ov2 .o2-kl{display:flex;align-items:center;justify-content:space-between;gap:8px;font-size:13px;color:#6F6B85;letter-spacing:.02em;white-space:nowrap;min-height:24px}
.ov2 .o2-kv{display:flex;align-items:baseline;gap:8px;flex-wrap:wrap}
.ov2 .o2-kv b{font-family:var(--brand);font-weight:400;font-size:34px;line-height:1;color:#2B2253}
.ov2 .o2-kv small{font-size:14px;color:#6F6B85}
.ov2 .o2-kf{font-size:12.5px;color:#6F6B85;display:flex;flex-wrap:wrap;gap:4px 12px;margin-top:auto}
.ov2 .o2-kf i{display:inline-block;width:8px;height:8px;border-radius:4px;margin-right:5px;vertical-align:1px}
.ov2 .ov-stack,.ov2 .ov-pace{height:8px;border-radius:4px}
.ov2 .ov-pace i{border-radius:4px}.ov2 .ov-pace em{top:-4px;height:16px}
.ov2 .ov-dots{gap:5px}.ov2 .ov-dot{width:30px;height:30px;font-size:10.5px}
.ov2 .ov-pill{font-size:11.5px;padding:3px 9px}
.ov2 .o2-mid{display:grid;grid-template-columns:minmax(0,2fr) minmax(280px,1fr);gap:16px;align-items:start}
.ov2 .o2-mid.solo{grid-template-columns:minmax(0,1fr)}
.ov2 .o2-hd{display:flex;align-items:baseline;flex-wrap:wrap;gap:2px 10px;margin:0 2px 12px}.ov2 .o2-hd h2{white-space:nowrap}
.ov2 .o2-hd h2{font-size:21px}.ov2 .o2-hd span{font-size:13px;color:#8A87A0}
.ov2 .ov-dec{grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:14px}
.ov2 .ov-dec.rows{grid-template-columns:minmax(0,1fr);gap:12px}
.ov2 .ov-dec.rows .ov-d{flex-direction:row;align-items:center;flex-wrap:wrap;gap:12px 18px;padding:16px 18px 16px 22px}
.ov2 .ov-dec.rows .ov-dt{flex:0 1 auto;min-width:200px}.ov2 .ov-dec.rows .ov-who{flex:1 1 220px}
.ov2 .ov-dec.rows .ov-go{margin:0 0 0 auto;padding:0 22px;min-width:150px}
.ov2 .ov-dec.rows .ov-go{order:3}
.ov2 .ov-d{border:1px solid #EEF0F4;box-shadow:0 1px 2px rgba(43,34,83,.04);border-radius:20px;padding:18px;position:relative;overflow:hidden}
.ov2 .ov-d::before{content:'';position:absolute;left:0;top:18px;bottom:18px;width:4px;border-radius:0 4px 4px 0;background:#00A3AD}
.ov2 .ov-d.hot::before{background:#D4705A}.ov2 .ov-d.low::before{background:#C9CCD8}
.ov2 .ov-dn{width:46px;height:46px;border-radius:14px;font-size:21px}
.ov2 .ov-go{min-height:42px;border-radius:12px;font-size:14.5px}
.ov2 .o2-w{background:#fff;border-radius:20px;border:1px solid #EEF0F4;padding:6px 6px 10px}
.ov2 .o2-wr{display:flex;align-items:center;gap:12px;padding:11px 12px;border-radius:14px;color:#2B2253!important}
.ov2 .o2-wr:hover{background:#F6F7FA}
.ov2 .o2-wr>span{flex:1;min-width:0;font-size:14.5px}.ov2 .o2-wr>span small{display:block;font-size:12px;color:#8A87A0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ov2 .o2-wr>b{font-family:var(--brand);font-weight:400;font-size:18px;min-width:34px;height:30px;padding:0 8px;box-sizing:border-box;border-radius:10px;background:#FBF1DE;color:#8A5A0F;display:flex;align-items:center;justify-content:center}
.ov2 .o2-wr>em{font-style:normal;color:#B9B7C6;font-size:18px}
.ov2 .o2-ok{font-size:12.5px;color:#5E7F84;padding:8px 12px 2px;line-height:1.5}
.ov2 .o2-ok b{color:#2B7A70;font-weight:600}
.ov2 .ov-card{border:1px solid #EEF0F4;box-shadow:0 1px 2px rgba(43,34,83,.04);border-radius:22px}
.ov2 .ov-ql{display:block;color:inherit}.ov2 .ov-ql .ov-th{align-items:flex-start;font-size:14px}.ov2 .ov-ql .ov-th b{white-space:nowrap;font-size:15px}
.ov2 .ov-two{display:grid;grid-template-columns:minmax(0,1.65fr) minmax(280px,1fr);gap:16px;align-items:start}
.ov2 .o2-foot{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:8px;font-size:13px;color:#8A87A0;padding:0 4px}
.ov2 .o2-foot a{color:#00808A}
@media (max-width:1180px){.ov2 .o2-hero{grid-template-columns:1fr}.ov2 .o2-st{grid-template-columns:repeat(3,minmax(0,1fr))}.ov2 .o2-kpi{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media (max-width:900px){.ov2 .o2-mid,.ov2 .ov-two{grid-template-columns:minmax(0,1fr)}}
@media (max-width:620px){.ov2 .ov-dec.rows .ov-d{flex-direction:column;align-items:stretch}.ov2 .ov-dec.rows .ov-go{margin:0;width:100%}.ov2 .o2-hero{padding:22px 18px}.ov2 .o2-hero h1{font-size:28px}.ov2 .o2-st{grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}.ov2 .o2-s{padding:10px 11px;border-radius:14px}.ov2 .o2-s b{font-size:21px}.ov2 .o2-s span{font-size:11px}.ov2 .o2-s small{font-size:11px}.ov2 .o2-kpi{grid-template-columns:minmax(0,1fr)}.ov2 .o2-kv b{font-size:30px}}
`;
  const st = document.createElement('style'); st.id = 'ov2css'; st.textContent = css; document.head.appendChild(st);

  window.renderHome = function(){
    if(!$('v-home') || !D) return;
    const now = new Date(), hr = now.getHours(), first = String((D.me||{}).name || '').split(' ')[0];
    const hi = (hr < 12 ? 'Good morning' : hr < 18 ? 'Good afternoon' : 'Good evening') + (first && !/^CupOf/i.test(first) ? ', ' + esc(first) : '');
    const qq = hmQueue(), W = qq.W, ok = qq.ok, app = qq.Q.filter(x => x.t === 'App check'), Q = qq.Q.filter(x => x.t !== 'App check');
    const hotQ = Q.filter(x => x.tone === 'hot'), hot = hotQ.reduce((a, x) => a + (+x.n || 0), 0);
    const sc = hmSched(), E = sc ? (sc.events || []) : null, live = E ? E.filter(e => !e.cancelled) : [], t = now.getTime();
    const done = live.filter(e => new Date(e.end) <= t), on = live.filter(e => new Date(e.start) <= t && new Date(e.end) > t), next = live.filter(e => new Date(e.start) > t).sort((a, b) => new Date(a.start) - new Date(b.start));
    const pay = (MO && MO.payroll) || [];
    const team = (MO && MO.team) || [], tc = s => team.filter(x => x.status === s).length, ontime = tc('On time'), lateN = tc('Late'), missN = tc('Missing'), due = ontime + lateN + missN;
    const money = hmMoney(), ym = now.toLocaleDateString('en-US', { month:'short', year:'numeric' }), mtd = money && (money.find(m => m.m === ym) || null), prev = money && money.find(m => m !== mtd);
    let actN = null, lowN = 0, outN = 0; if(AT && AT.cols){ const C = {}; AT.cols.forEach((c, i) => C[c] = i); const A = AT.rows.filter(r => r[C.active]); actN = A.length;
      outN = A.filter(r => r[C.available] !== '' && r[C.available] <= 0).length; lowN = A.filter(r => r[C.available] !== '' && r[C.available] <= 5 && r[C.available] > 0).length; }
    const dot = c => `<i style="background:${c}"></i>`;
    const firstStart = next.length ? tm(next[0].start) : '';

    // ── header
    let h = `<section class="o2-hero"><img class="ov-cup" src="${esc(ovCup())}" alt=""><div style="position:relative;min-width:0"><div class="o2-eye">${now.toLocaleDateString('en-GB', { weekday:'long', day:'numeric', month:'long' })} · ${tm(now.toISOString())}</div><h1>${hi}</h1>
<div class="o2-tag"><span>Learn with the best to be the best</span><span class="zh">与优秀者同行，遇见更好的自己</span></div></div>
<div class="o2-st">
<a class="o2-s ${hot ? 'hot' : ''}" onclick="document.getElementById('ovDecide').scrollIntoView({behavior:'smooth'})"><span>Needs you</span><b>${hot ? hot : '✓'}</b><small>${hot ? (hotQ[0] ? esc(hotQ[0].t) : '') : Q.length ? 'Nothing urgent · ' + Q.length + ' to look at' : 'All clear'}</small></a>
${E ? `<a class="o2-s" onclick="go('schedule')"><span>${on.length ? 'Live now' : 'Next class'}</span><b>${on.length ? '<i class="ov-live"></i>' + on.length : next.length ? tm(next[0].start) : '—'}</b><small>${on.length ? on.map(e => esc(tName(e.teacher))).join(' · ') : next.length ? esc(tName(next[0].teacher)) + ' · ' + esc(next[0].student || next[0].title || '') : 'No more classes today'}</small></a>
<a class="o2-s" onclick="go('schedule')"><span>Left today</span><b>${next.length + on.length}</b><small>${done.length} done · ${live.length} in all${E.length - live.length ? ' · ' + (E.length - live.length) + ' cancelled' : ''}</small></a>` : ''}
</div></section>`;

    // ── KPI cards
    h += `<section class="o2-kpi">
<a class="o2-k" onclick="go('schedule')"><div class="o2-kl">Classes today</div><div class="o2-kv"><b>${E ? live.length : '—'}</b><small>${E ? done.length + ' done · ' + on.length + ' live' : ''}</small></div>
<div class="ov-stack">${E && live.length ? `<i style="flex:${done.length};background:#00A3AD"></i><i style="flex:${on.length};background:#00D2B4"></i><i style="flex:${next.length};background:#E7F3F4"></i>` : '<i style="flex:1;background:#E7F3F4"></i>'}</div>
<div class="o2-kf">${E ? (next.length ? '<span>' + next.length + ' to go · first at ' + firstStart + '</span>' : '<span>No more classes today</span>') : '<span>Reading the calendar…</span>'}</div></a>
<a class="o2-k" onclick="go('team')"><div class="o2-kl">Teachers on time</div><div class="o2-kv"><b>${due ? ontime : team.length || '—'}</b><small>${due ? 'of ' + due + ' so far' : team.length ? 'teaching today' : ''}</small></div>
<div class="ov-dots">${team.length ? team.map(x => { const s = x.status, nm = tName(x.name || x.teacher || ''), ini = String(x.name || x.teacher || '?').replace(/^teacher\s+/i, '').slice(0, 2).toUpperCase();
  return `<span class="ov-dot ${s === 'On time' ? 'ok' : s === 'Late' ? 'late' : s === 'Missing' ? 'miss' : 'wait'}" title="${esc(nm + ' · ' + s)}">${esc(ini)}</span>`; }).join('') : '<span class="small mute">No classes today</span>'}</div>
<div class="o2-kf">${due ? `<span>${dot('#00A3AD')}${ontime} on time</span>${lateN ? `<span>${dot('#D9962B')}${lateN} late</span>` : ''}${missN ? `<span>${dot('#D4705A')}${missN} no time-in</span>` : ''}` : ''}${team.length - due ? `<span>${team.length - due} time-in${team.length - due === 1 ? '' : 's'} still to come</span>` : ''}</div></a>
${isPres() ? (() => { const dim = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate(), pace = Math.round(now.getDate() / dim * 100), pct = mtd && prev && prev.sales ? Math.round((mtd.sales || 0) / prev.sales * 100) : null;
  return `<a class="o2-k" onclick="go('money')"><div class="o2-kl">${now.toLocaleDateString('en-US', { month:'long' })} sales${pct != null ? `<span class="ov-pill ${pct >= pace ? 'up' : 'dn'}">${pct >= pace ? '▲ Ahead of pace' : '▼ Behind pace'}</span>` : ''}</div>
<div class="o2-kv"><b>${mtd ? hmPeso(mtd.sales) : '—'}</b></div><div class="ov-pace" title="Line = where the month is today"><i style="width:${Math.min(100, pct || 0)}%"></i><em style="left:${pace}%"></em></div>
<div class="o2-kf"><span>${pct != null ? pct + '% of ' + esc(prev.m.split(' ')[0]) + ' · day ' + now.getDate() + ' of ' + dim : 'From MONEY'}</span></div></a>`; })()
: (() => { const T = hmTodo(); return `<a class="o2-k" onclick="go('mtoday');setTimeout(()=>tdJump('renew'),80)"><div class="o2-kl">Renewals due</div><div class="o2-kv"><b>${T ? T.ren.length : '—'}</b></div>
<div class="ov-stack">${T && T.ren.length ? `<i style="flex:${T.renNow.length};background:#D4705A"></i><i style="flex:${T.ren.length - T.renNow.length};background:#D9962B"></i>` : '<i style="flex:1;background:#E7F3F4"></i>'}</div>
<div class="o2-kf"><span>${dot('#D4705A')}${T ? T.renNow.length : 0} act now</span><span>${dot('#D9962B')}${T ? T.ren.length - T.renNow.length : 0} coming up</span></div></a>`; })()}
<a class="o2-k" onclick="go('active')"><div class="o2-kl">Active students</div><div class="o2-kv"><b>${actN == null ? '—' : actN}</b></div>
<div class="ov-stack">${actN ? `<i style="flex:${actN - lowN - outN};background:#00A3AD"></i><i style="flex:${lowN};background:#D9962B"></i><i style="flex:${outN};background:#D4705A"></i>` : '<i style="flex:1;background:#E7F3F4"></i>'}</div>
<div class="o2-kf"><span>${dot('#00A3AD')}${actN == null ? 0 : actN - lowN - outN} healthy</span><span>${dot('#D9962B')}${lowN} low (≤ 5)</span><span>${dot('#D4705A')}${outN} ran out</span></div></a></section>`;
    h += wsCard();

    // ── decide now + waiting on teachers
    const act = x => /Leave/.test(x.t) ? 'Review leave' : /Late/.test(x.t) ? 'Decide' : /Renewal/.test(x.t) ? 'Open renewals' : /pay/i.test(x.t) ? 'Go to payroll' : /report/i.test(x.t) ? (/Trial/.test(x.t) ? 'Send reports' : 'Check reports') : /followed/i.test(x.t) ? 'Follow up' : /case/i.test(x.t) ? 'Open cases' : /Data/.test(x.t) ? 'Fix data' : 'Open';
    const who = s => String(s || '').split(' · ').filter(Boolean).slice(0, 4);
    const dec = `<section id="ovDecide" class="ov-sec" style="gap:0"><div class="o2-hd"><h2>Decide now</h2><span>${Q.length ? 'most urgent first · one tap to act' : ''}</span></div>
${Q.length ? `<div class="ov-dec ${Q.length <= 2 ? 'rows' : ''}">${Q.map(x => `<div class="ov-d ${x.tone || 'mid'}"><div class="ov-dt"><span class="ov-dn num">${esc(String(x.n))}</span><div class="grow" style="min-width:0"><b>${esc(x.t)}</b></div></div>
${x.s ? `<div class="ov-who">${who(x.s).map(w => `<span>${esc(w)}</span>`).join('')}</div>` : ''}<button class="ov-go" onclick="${x.go}">${act(x)}</button></div>`).join('')}</div>`
      : `<div class="ov-clear"><span>✓</span><div><b>All clear</b><div class="small mute">Nothing waiting for a decision.</div></div></div>`}</section>`;
    const wait = W.length || ok.length ? `<section class="ov-sec" style="gap:0"><div class="o2-hd"><h2>Waiting on teachers</h2><span>nudge in WeChat</span></div><div class="o2-w">
${W.map(x => `<a class="o2-wr" onclick="${x.go}" title="${esc(x.s || '')}"><span>${esc(x.t)}${x.s ? `<small>${esc(String(x.s).split(' · ').slice(0, 3).join(' · '))}</small>` : ''}</span><b>${esc(String(x.n))}</b><em>›</em></a>`).join('')}
${ok.length ? `<div class="o2-ok"><b>✓ All clear</b> · ${ok.map(esc).join(' · ')}</div>` : ''}</div></section>` : '';
    h += `<div class="o2-mid ${wait ? '' : 'solo'}">${dec}${wait}</div>`;

    if(E && E.length){ h += ovTl(E, now); }
    else if(!E) h += `<section class="ov-sec ov-card"><div class="sk"></div></section>`;

    // ── business + quality
    let bq = '';
    if(money && isPres()){
      bq += `<section class="ov-card"><div class="ov-hd"><h2>Business</h2><a class="lk" onclick="go('money')">Sales &amp; costs ›</a></div>
${ovBiz(money, mtd, prev)}
${pay.length ? `<div class="ov-pay"><div class="ov-th"><b>${esc(MO.payMonth || 'Payroll')} pay</b><span class="small mute">${pay.length - unpaidN(pay)} of ${pay.length} paid</span></div><div class="ov-stack"><i style="flex:${pay.length - unpaidN(pay)};background:#00A3AD"></i><i style="flex:${unpaidN(pay)};background:#E7F3F4"></i></div></div>` : ''}</section>`; }
    const tm0 = PF && (PF.team || [])[0], tm1 = PF && (PF.team || [])[1];
    const ring = (parts, total, big, small, sz) => { let off = 0; const C = 264; const segs = parts.map(([v, c]) => { const L = total ? v / total * C : 0, s = `<circle cx="50" cy="50" r="42" fill="none" stroke="${c}" stroke-width="10" stroke-linecap="round" stroke-dasharray="${L.toFixed(1)} ${C}" stroke-dashoffset="${(-off).toFixed(1)}" transform="rotate(-90 50 50)"></circle>`; off += L; return s; }).join('');
      return `<div class="ov-ring" style="width:${sz}px;height:${sz}px"><svg viewBox="0 0 100 100" width="${sz}" height="${sz}" aria-hidden="true"><circle cx="50" cy="50" r="42" fill="none" stroke="#E7F3F4" stroke-width="10"></circle>${segs}</svg><div><b class="num">${big}</b><span>${small}</span></div></div>`; };
    if(tm0 || (RP && RP.rows)){ const R = (RP && RP.rows) || [], sent = R.filter(x => /^Sent/.test(x.status)).length, tot = R.length + ((RP && RP.making) || []).length + ((RP && RP.waiting) || []).length;
      const pr = typeof PM !== 'undefined' && PM && PM.rows ? [PM.rows.filter(x => x.status !== 'Assigned').length, PM.rows.length] : null, bar = (a, b, c) => `<div class="ov-bar"><i style="width:${b ? Math.round(a / b * 100) : 0}%;background:${c}"></i></div>`;
      bq += `<section class="ov-card"><div class="ov-hd"><h2>Quality</h2><a class="lk" onclick="go('perf')">Performance ›</a></div>
${tm0 ? `<div class="ov-row" style="gap:18px">${ring([[+tm0.avg || 0, '#00A3AD']], 5, esc(String(tm0.avg)), 'of 5', 96)}<div class="ov-ks"><b>QA team average</b>${tm1 ? `<em class="${tm0.avg >= tm1.avg ? 'up' : 'dn'}">${tm0.avg >= tm1.avg ? '▲' : '▼'} ${Math.abs(Math.round((tm0.avg - tm1.avg) * 10) / 10)} vs ${esc(tm1.period)}</em>` : ''}<span class="small mute">${esc(tm0.period)} · ${tm0.n} teachers</span></div></div>` : ''}
${tot ? `<a class="ov-ql" onclick="RP_K='month';go('reports')"><div class="ov-th"><span>Parent reports sent · ${esc(RP.label || '')}</span><b>${sent} / ${tot}</b></div>${bar(sent, tot, '#00A3AD')}</a>` : ''}
${pr && pr[1] ? `<a class="ov-ql" onclick="go('perf')"><div class="ov-th"><span>Peer reviews done</span><b>${pr[0]} / ${pr[1]}</b></div>${bar(pr[0], pr[1], '#6C5FC7')}</a>` : ''}</section>`; }
    if(bq) h += `<div class="ov-two">${bq}</div>`;
    if(app.length) h += `<div class="o2-foot"><span>App check · ${esc(app[0].s || '')}</span><a onclick="${app[0].go}">Open ›</a></div>`;
    $('v-home').innerHTML = `<div class="ov ov2">${h}</div>`;
  };
  try{ if(typeof VIEW !== 'undefined' && VIEW === 'home') renderHome(); }catch(e){}
})();
