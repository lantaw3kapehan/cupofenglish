/* 19 Oct · 319 · QA read receipts (Misty: "notify them when the QA feedback for the month has been sent and let them acknowledge that they have read it — mandatory")
   Teacher: a new QA (sent from 19 Oct) opens a full-screen notice on every screen until she confirms. "Read it now" opens QA feedback;
   at the end of the feedback: "I have read and understood …". Opening and confirming are saved (coe_qa_ack via coe-mgmt tQaAck).
   Management: sending a QA starts the wait (mgmtQaSent); Performance shows "QA read receipts" (read ✓ / opened, not confirmed / not opened). */
(function(){
  const post = (fn, args) => fetch(FAST_URL + '-mgmt', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ op: 'screen', fn, args: args || [], token: TOKEN }) }).then(x => x.json()).then(r => { if(!(r && r.ok)) throw new Error(fn); return r.data; });
  const FROM = Date.parse('2026-10-19T00:00:00+08:00');
  const isT = () => !!(typeof D !== 'undefined' && D && !D.mgr && TOKEN);
  const isM = () => !!(typeof D !== 'undefined' && D && D.mgr && TOKEN);
  const css = document.createElement('style'); css.textContent = `#qaGate{position:fixed;inset:0;z-index:9999;background:rgba(30,32,60,.55);display:flex;align-items:center;justify-content:center;padding:16px}
#qaGate .qg{background:#fff;border-radius:22px;max-width:440px;width:100%;padding:24px 22px;box-shadow:0 20px 60px rgba(0,0,0,.25);text-align:center}
#qaGate .qg h2{margin:8px 0 6px}#qaGate .qg p{margin:6px 0}.qa-ackbar{border:2px solid var(--teal);border-radius:18px;padding:16px;margin:18px 0 8px;background:var(--tint);text-align:center}
.qa-ackbar .btn{margin-top:10px}.qa-ackhint{border-radius:14px;padding:10px 14px;margin:0 0 12px;background:#fff4d6;color:#6b4e00;font-weight:600;font-size:14px}`;
  document.head.appendChild(css);

  // ── teacher ──
  let ACK = null; try{ ACK = JSON.parse(localStorage.getItem('coe.qa.ack') || 'null'); }catch(e){}
  const latest = () => { const g = (typeof GR !== 'undefined' && GR) || (typeof kept === 'function' && kept('growth')); return g && g.evals && g.evals[0] || null; };
  function pending(){ if(!isT() || !ACK) return null; const e = latest(); if(!e || !e.ts || e.ts < FROM || !e.period) return null;
    const a = ACK.find(x => String(x.period).toLowerCase() === String(e.period).toLowerCase());
    return a && a.acked_at && Date.parse(a.acked_at) >= e.ts - 5 * 6e4 ? null : e; }
  function gate(){ const old = $('qaGate'), e = pending(); if(!e || VIEW === 'qa'){ if(old) old.remove(); return; } if(old) return;
    const g = document.createElement('div'); g.id = 'qaGate';
    g.innerHTML = `<div class="qg"><div style="font-size:40px">📋</div><h2>Your QA feedback is here</h2>
<p><b>${esc(e.period)} evaluation</b>${e.by ? ' · from ' + esc(e.by) : ''}</p>${e.avg ? `<p class="mute">${e.avg} / 5${e.decision ? ' · ' + esc(String(e.decision).split(/\s+[—-]\s+/)[0]) : ''}</p>` : ''}
<p class="small mute" style="margin-top:12px">Please read it now and confirm at the end. This is required — the app opens again once you have confirmed.</p>
<button class="btn block" style="margin-top:14px" onclick="qaGateRead()">Read it now</button></div>`;
    document.body.appendChild(g); }
  window.qaGateRead = function(){ const e = pending(); const g = $('qaGate'); if(g) g.remove(); try{ GR_I = 0; }catch(x){} go('qa'); if(e) post('tQaAck', [e.period, 'seen']).catch(() => {}); };
  function bar(){ const v = $('v-qa'); if(!v || !isT()) return; v.querySelectorAll('.qa-ackbar,.qa-ackhint').forEach(x => x.remove()); const e = pending(); if(!e) return;
    try{ if(GR_I !== 0) return; }catch(x){}
    const hint = document.createElement('div'); hint.className = 'qa-ackhint'; hint.textContent = '📋 New · please read your ' + e.period + ' feedback to the end, then confirm at the bottom.';
    const lead = v.querySelector('h1'); if(lead && lead.parentNode === v) lead.after(hint); else v.prepend(hint);
    const b = document.createElement('div'); b.className = 'qa-ackbar';
    b.innerHTML = `<b>Have you read all of it?</b><div class="small mute" style="margin-top:4px">Management sees when you confirm. Questions about it? Send a message after confirming.</div>
<button class="btn block" id="qaAckGo" onclick="qaAck()">✓ I have read and understood my ${esc(e.period)} feedback</button>`;
    const all = [...v.querySelectorAll('section,.card')].filter(x => /All evaluations/i.test(x.textContent));
    if(all.length) all[0].before(b); else v.appendChild(b); }
  window.qaAck = function(){ const e = pending(); if(!e) return; const b = $('qaAckGo'); if(b){ b.disabled = true; b.textContent = 'Saving…'; }
    post('tQaAck', [e.period, 'ack']).then(r => { ACK = (ACK || []).filter(x => String(x.period).toLowerCase() !== String(e.period).toLowerCase()).concat([{ period: e.period, acked_at: (r && r.acked_at) || new Date().toISOString() }]);
      try{ localStorage.setItem('coe.qa.ack', JSON.stringify(ACK)); }catch(x){} bar(); gate(); toast('✓ Thank you · management can see you have read your ' + e.period + ' feedback'); })
    .catch(() => { if(b){ b.disabled = false; b.textContent = '✓ I have read and understood my ' + e.period + ' feedback'; } toast('Not saved · check your connection and tap again'); }); };
  function loadAck(){ if(!isT()) return; post('tQaAckMe').then(d => { ACK = d || []; try{ localStorage.setItem('coe.qa.ack', JSON.stringify(ACK)); }catch(x){} gate(); bar(); }).catch(() => {}); }
  function freshGrowth(){ if(!isT()) return; api('tGrowth', TOKEN).then(v => { if(!v) return; try{ keep('growth', v); }catch(x){} const was = (latest() || {}).ts; GR = v; if((v.evals && v.evals[0] || {}).ts !== was && (VIEW === 'qa' || VIEW === 'growth')) paintGrowth(); gate(); bar(); }).catch(() => {}); }
  const _go = window.go; window.go = function(v){ const x = _go.apply(this, arguments); try{ if(isT()){ gate(); if(v === 'qa') setTimeout(bar, 0); } }catch(e){} return x; };
  const _pg = window.paintGrowth; window.paintGrowth = function(){ const x = _pg.apply(this, arguments); try{ bar(); }catch(e){} return x; };
  const _gp = window.grPick; window.grPick = function(i, mgr){ const x = _gp.apply(this, arguments); try{ if(!mgr) bar(); }catch(e){} return x; };
  setTimeout(() => { loadAck(); setTimeout(freshGrowth, 4000); }, 2500);
  setInterval(() => { if(document.hidden) return; loadAck(); freshGrowth(); }, 20 * 6e4);
  setInterval(() => { try{ gate(); }catch(e){} }, 30e3);

  // ── management ──
  const _api = api; api = function(fn, ...args){ const p = _api(fn, ...args);
    if(fn === 'mgmtQaSubmit' && isM()) Promise.resolve(p).then(r => { if(!r || !r.ok) return; let t = r.teacher || '', per = r.period || '';
      try{ const a = args[1] || {}; QF.form.items.forEach(x => { const ro = qaRole(x); if(ro === 'teacher' && !t) t = a[x.id]; if(ro === 'period' && !per) per = a[x.id]; }); }catch(e){}
      if(t && per) post('mgmtQaSent', [t, per]).then(() => { RC = null; if(VIEW === 'perf') rcLoad(); }).catch(() => {}); }).catch(() => {});
    return p; };
  let RC = null, RCat = 0;
  const ago = s => { const m = Math.round((Date.now() - Date.parse(s)) / 6e4); return m < 60 ? m + ' min ago' : m < 1440 ? Math.round(m / 60) + ' h ago' : Math.round(m / 1440) + ' days ago'; };
  const when = s => new Date(s).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
  function rcPaint(){ const v = $('v-perf'); if(!v || !isM() || !RC) return; let box = $('qaRc'); const L = RC.filter(x => x.sent_at);
    if(!L.length){ if(box) box.remove(); return; }
    if(!box){ box = document.createElement('section'); box.id = 'qaRc'; box.className = 'card'; box.style.cssText = 'padding:12px 14px;margin:0 0 14px'; const lead = v.querySelector('.lead'); if(lead) lead.after(box); else v.prepend(box); }
    const n = L.filter(x => x.acked_at && Date.parse(x.acked_at) >= Date.parse(x.sent_at) - 3e5).length;
    box.innerHTML = `<div class="row" style="align-items:center"><b class="grow">QA read receipts</b><span class="small mute">${n} of ${L.length} confirmed</span></div>` + L.slice(0, 20).map(x => {
      const ok = x.acked_at && Date.parse(x.acked_at) >= Date.parse(x.sent_at) - 3e5, late = !ok && Date.now() - Date.parse(x.sent_at) > 2 * 864e5;
      const st = ok ? `<span class="chip green">✓ Read · ${esc(when(x.acked_at))}</span>` : x.seen_at && Date.parse(x.seen_at) >= Date.parse(x.sent_at) - 3e5 ? `<span class="chip amber">Opened · not confirmed</span>` : `<span class="chip ${late ? 'red' : 'amber'}">Not opened yet</span>`;
      return `<div class="row small" style="gap:8px;align-items:center;padding:6px 0;border-top:1px solid var(--line)"><div class="grow"><b>${esc(tName(x.teacher.replace(/^./, c => c.toUpperCase())))}</b> <span class="mute">· ${esc(x.period)} · sent ${esc(ago(x.sent_at))}</span></div>${st}</div>`; }).join(''); }
  function rcLoad(){ if(!isM()) return; if(RC && Date.now() - RCat < 6e4){ rcPaint(); return; } RCat = Date.now(); post('mgmtQaAcks').then(d => { RC = d || []; rcPaint(); }).catch(() => {}); }
  const _rp = window.renderPerf; if(_rp) window.renderPerf = function(){ const x = _rp.apply(this, arguments); try{ rcPaint(); rcLoad(); }catch(e){} return x; };
})();
