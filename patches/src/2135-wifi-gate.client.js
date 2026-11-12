/* 2135 (12 Nov, Misty: "if the time-in screen proof shows they're using Wi-Fi, a system message that it violates the contract · first warning
   as the contract says · don't let teachers click I'm in if they're detected to be using Wi-Fi").
   Teacher: while Wi-Fi is detected, "I'm in" is locked and the warning shows (the contract's own words: Addendum No. 1 for teachers who
   signed it, the 2025 Agreement + Memo No. 20 for the others). Detected = the browser says Wi-Fi (Android Chrome), or Operations marked
   the Wi-Fi icon in the time-in picture (coe-wifi). Unlock: the cable (the browser no longer says Wi-Fi / a redone time-in picture), or
   Operations allows it (cable internet down · written approval). If the check itself cannot be reached, nothing is locked.
   Management: To do › Fix these › Wi-Fi item: "Not Wi-Fi · allow" (unlocks) or "Lesson taught on Wi-Fi · open a case" (Wi-Fi case form).
   Team Chat › Time-in picture: "Wi-Fi in this picture" (management). */
(function(){
  if(window.__wf2135) return; window.__wf2135 = 1;
  const U = () => (typeof FAST_URL !== 'undefined' ? FAST_URL : 'https://rlxkiahqjsabopmuhern.supabase.co/functions/v1/coe') + '-wifi';
  const call = (op, o) => { if(typeof TOKEN === 'undefined' || !TOKEN) return Promise.resolve(null);
    return fetch(U(), { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(Object.assign({ token: TOKEN, op }, o || {})) }).then(r => r.json()).catch(() => null); };
  const E = x => String(x == null ? '' : x).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const isT = () => { try{ return typeof D !== 'undefined' && D && !D.mgr; }catch(e){ return false; } };
  const wifiNow = () => { try{ return (navigator.connection || {}).type === 'wifi'; }catch(e){ return false; } };
  const say = m => { try{ (window.toast || function(){})(m); }catch(e){} };
  const me = () => { try{ return String((D && ((D.me && D.me.name) || D.name || D.teacher)) || '').replace(/^Teacher\s+/i, ''); }catch(e){ return ''; } };
  let C = { at: 0, flag: null }, sentB = 0, shown = '', CT = '';   /* CT: the teacher's contract (addendum | 2025), kept from the last check */
  async function state(force){ if(!force && Date.now() - C.at < 90000) return C.flag;   /* the minute check keeps this fresh, so the tap is not slowed */ const r = await call('mine'); if(r && r.ok){ C = { at: Date.now(), flag: r.flag || null }; if(r.contract) CT = r.contract; } return C.flag; }
  const quick = p => Promise.race([p, new Promise(z => setTimeout(() => z(C.flag), 2500))]);   /* never wait long: the class comes first */

  function text(f){ const nm = me(), add = (f.contract || CT) === 'addendum', hh = new Date(f.at || Date.now()).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });
    const where = f.src === 'browser' ? 'your device says you are connected by <b>Wi-Fi</b>, not a LAN cable' : 'your time-in picture shows you are connected by <b>Wi-Fi</b>, not a LAN cable';
    const rule = add ? 'Your contract requires a wired connection for every lesson (Addendum No. 1, Clause 3.2). Wi-Fi is allowed only with the Company’s written approval.'
      : 'Your contract requires a cable internet connection, not Wi-Fi (Independent Contractor Agreement, Annex A, Technical Requirements (a); Memo No. 20).';
    const after = add ? 'If a lesson is taught on Wi-Fi and Operations confirms it, it is ₱600 for that lesson (Clause 4.1). The first time, a final notice of breach is also sent, and you have 5 days to explain (Clause 5.1).'
      : 'Teaching on Wi-Fi again breaks company policy and may lead to disciplinary action, up to ending the contract (Annex A, Termination (c)).';
    return { head: (add ? 'Warning' : 'Written warning') + ' · Wi-Fi connection', when: hh + ' · Time-in', body: 'Teacher ' + E(nm) + ', ' + where + '.', rule, after, add }; }

  function show(f, go){
    const t = text(f), asked = f.status === 'asked', proof = f.src !== 'browser';
    const btn = (id, cls, label) => '<button type="button" class="btn ' + cls + ' block" id="' + id + '" style="margin-top:8px">' + label + '</button>';
    openSheet('<div class="wf2135"><div class="wf-h"><b>⚠ ' + E(t.head) + '</b><span>' + E(t.when) + '</span></div>'
      + '<p>' + t.body + '</p><p>' + E(t.rule) + '</p>'
      + (asked ? '<div class="wf-wait"><b>Waiting for Operations.</b> You asked to teach without a LAN cable today' + (f.answer === 'approval' ? ' (written approval)' : ' (cable internet down)') + '. <b>I&#39;m in</b> stays locked until Operations allows it.</div>'
        : '<div class="wf-lock"><b>I&#39;m in is locked while you are on Wi-Fi.</b> Connect your LAN cable before your first class' + (proof ? ', then redo your time-in check so the LAN cable icon shows.' : ', then tap Check again.') + '</div>')
      + '<p class="wf-small">' + E(t.after) + '</p>'
      + (asked ? btn('wfAgain', 'teal', 'Check again')
        : (proof ? btn('wfRedo', 'teal', 'I connected the cable · redo my time-in check') : btn('wfAgain', 'teal', 'Check again'))
          + btn('wfDown', 'ghost', 'My cable internet is down · ask Operations')
          + (t.add ? btn('wfAppr', 'ghost', 'I have written approval · ask Operations') : ''))
      + '</div>');
    const $b = id => document.getElementById(id);
    const again = async () => { if(wifiNow()){ say('Still on Wi-Fi · connect your LAN cable'); return; }
      if(!proof && f.id && !asked){ await call('answer', { id: f.id, how: 'cable' }); C = { at: Date.now(), flag: null }; closeSheet(); say('LAN cable · I’m in is open'); return go && go(); }
      const g = await state(true); if(!g){ closeSheet(); say('Allowed · I’m in is open'); return go && go(); } say(asked ? 'Operations has not allowed it yet' : 'Still locked'); };
    const ask = async how => { if(!f.id){ const g = await state(true); if(g) f = g; } if(!f.id){ say('Not sent · try again'); return; }
      const r = await call('answer', { id: f.id, how }); if(!r || !r.ok){ say('Not sent · check your internet'); return; }
      f = Object.assign({}, f, { status: 'asked', answer: how }); C = { at: Date.now(), flag: f }; show(f, go); say('Sent to Operations'); };
    if($b('wfAgain')) $b('wfAgain').onclick = again;
    if($b('wfDown')) $b('wfDown').onclick = () => ask('down');
    if($b('wfAppr')) $b('wfAppr').onclick = () => ask('approval');
    if($b('wfRedo')) $b('wfRedo').onclick = () => { try{ if(typeof window.wcRedo1270 === 'function'){ window.wcRedo1270(); setTimeout(() => { const s = document.getElementById('sheetBody'); if(s && s.querySelector('.wf2135')) say('Open Today › Redo your time-in check (it appears in a moment)'); }, 400); return; } }catch(e){} say('Open Today › Redo your time-in check'); };
    shown = (f.id || 0) + ':' + f.status; }

  async function gate(go){
    if(!isT()) return go();
    if(wifiNow()){ if(!sentB){ sentB = 1; await quick(call('browser')); } const f = await quick(state(true)); return show(f || { id: 0, status: 'warned', contract: '', src: 'browser' }, go); }
    let f = null; try{ f = await quick(state(false)); }catch(e){}
    if(f) return show(f, go);
    return go(); }

  /* every way into "I'm in" goes through the gate */
  ['classIn', 'tapClassIn'].forEach(k => { const o = window[k]; if(typeof o !== 'function' || o.__wf) return;
    const w = function(){ const a = arguments, th = this; gate(() => o.apply(th, a)); }; w.__wf = 1; window[k] = w; });
  const g0 = window.classInGo; if(typeof g0 === 'function' && !g0.__wf){ const w = async function(){ if(isT() && (wifiNow() || (C.flag && Date.now() - C.at < 120000))){ const f = C.flag || { id: 0, status: 'warned', src: 'browser' }; show(f, null); return; } return g0.apply(this, arguments); }; w.__wf = 1; window.classInGo = w; }

  /* the warning shows by itself as soon as Wi-Fi is detected (checked every minute while the app is open) */
  async function tick(){ if(!isT() || document.hidden) return; let f = null;
    if(wifiNow()){ if(!sentB){ sentB = 1; await call('browser'); } f = await state(true) || { id: 0, status: 'warned', src: 'browser' }; } else f = await state(true);
    if(!f){ shown = ''; return; } const k = (f.id || 0) + ':' + f.status; if(k === shown) return;
    const sh = document.getElementById('sheet'); if(sh && sh.classList.contains('on') && !(document.getElementById('sheetBody') || {}).querySelector?.('.wf2135')) return;   /* never over another open card */
    show(f, null); }
  setTimeout(tick, 4000); setInterval(tick, 60000);

  /* ── management ── */
  window.wf2135Flag = async function(teacher, proof){ if(!confirm('Mark Wi-Fi in Teacher ' + teacher + '’s time-in picture?\n\nThe teacher gets the contract warning, and I’m in is locked until the LAN cable is connected (or you allow it).')) return;
    const r = await call('flag', { teacher, proof: proof || '' }); say(r && r.ok ? '✓ Warning sent to Teacher ' + teacher : 'Not saved · try again'); try{ if(window.o2091load) o2091load(true); }catch(e){} };
  window.wf2135Close = async function(id, result, teacher){
    if(result === 'confirmed'){ const r = await call('close', { id, result }); if(!r || !r.ok) return say('Not saved · try again'); say('Opening the Wi-Fi case'); try{ if(typeof wifiCase === 'function'){ wifiCase(); setTimeout(() => { const s = document.getElementById('cT') || document.querySelector('#sheetBody select'); if(s && teacher){ const o = [...(s.options || [])].find(x => x.value === teacher || x.text.replace(/^Teacher\s+/i, '') === teacher); if(o){ s.value = o.value; s.dispatchEvent(new Event('change', { bubbles: true })); } } }, 300); } }catch(e){} return; }
    if(!confirm('Allow Teacher ' + teacher + ' today? (not Wi-Fi, or teaching on backup / with written approval)\n\nI’m in opens for the teacher.')) return;
    const r = await call('close', { id, result: 'cleared' }); say(r && r.ok ? '✓ Teacher ' + teacher + ' can tap I’m in' : 'Not saved · try again'); };

  /* Team Chat › Time-in pictures: "Wi-Fi in this picture" for management */
  function chatBtns(){ try{ if(!(typeof D !== 'undefined' && D && D.mgr)) return; const v = document.getElementById('v-chat'); if(!v) return;
    v.querySelectorAll('.ch-ti[data-author]').forEach(t => { const m = t.closest('.ch-m') || t.parentElement; if(!m || m.querySelector('.wf-b')) return;
      const who = String(t.getAttribute('data-author') || '').replace(/^Teacher\s+/i, '').trim(); if(!who) return;
      const img = m.querySelector('img'); const b = document.createElement('button'); b.type = 'button'; b.className = 'wf-b'; b.textContent = 'Wi-Fi in this picture';
      b.onclick = ev => { ev.stopPropagation(); window.wf2135Flag(who, img ? img.src : ''); }; (m.querySelector('.ch-body') || m).appendChild(b); }); }catch(e){} }
  let q2135 = 0;
  try{ new MutationObserver(() => { if(q2135) return; q2135 = 1; setTimeout(() => { q2135 = 0; chatBtns(); }, 300); }).observe(document.body, { childList: true, subtree: true }); }catch(e){}

  document.head.insertAdjacentHTML('beforeend', '<style id="d2135">.wf2135 .wf-h{display:flex;justify-content:space-between;gap:10px;align-items:baseline;padding:12px 14px;border-radius:14px;background:#FDF0EC;color:#9A3412;margin-bottom:10px}.wf2135 .wf-h b{font-size:17px}.wf2135 .wf-h span{font-size:12.5px;color:#9A5B46;white-space:nowrap}.wf2135 p{margin:8px 0;line-height:1.5;color:#2E2650}.wf2135 .wf-lock,.wf2135 .wf-wait{margin:10px 0;padding:11px 13px;border-radius:12px;background:#FFF4E5;border:1px solid #F3D48B;line-height:1.45}.wf2135 .wf-wait{background:#EEF3FB;border-color:#C9D7EE}.wf2135 .wf-small{font-size:13px;color:#6B6880}.wf-b{margin-top:6px;padding:5px 10px;border-radius:999px;border:1px solid #F0C4B6;background:#FFF;color:#A1452F;font:inherit;font-size:12px;font-weight:600;cursor:pointer}</style>');
})();
