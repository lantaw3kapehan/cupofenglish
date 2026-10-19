/* 19 Oct · 335 (Misty: "let us do all of it now")
   1. Management phone alerts: Overview › "📱 Phone alerts" — turn on for this phone/laptop and pick which: no time-in, teacher messages, leave requests,
      trial reports, QA read, setup screenshots (coe-push prefs; sent by the database: coe_push_mgmt / coe_push_late).
   2. Performance › "📱 Phone reminders · n of m teachers" (coe-push who).
   3. Today (teacher) smaller: warning box, "Management is waiting", setup card; the plan box opens on "✍ Write my plan". */
(function(){
  const PUSH = FAST_URL + '-push';
  const call = b => fetch(PUSH, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(Object.assign({ token: TOKEN }, b)) }).then(r => r.json());
  const isM = () => !!(typeof D !== 'undefined' && D && D.mgr && TOKEN), isT = () => !!(typeof D !== 'undefined' && D && !D.mgr && TOKEN);
  const can = () => 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
  const k8 = s => { const p = '='.repeat((4 - s.length % 4) % 4), b = atob((s + p).replace(/-/g, '+').replace(/_/g, '/')); return Uint8Array.from(b, c => c.charCodeAt(0)); };
  const KINDS = [['late', '⏰ A teacher has not timed in 3 min after a class started'], ['msg', '💬 A teacher sends management a message'], ['leave', '🌴 A leave request comes in'],
    ['trial', '🎯 A trial report is sent (follow up with the parent)'], ['qa', '✓ A teacher confirms she read her QA'], ['setup', '📷 A setup screenshot is waiting for your check']];
  async function sub(first){ if(!can() || Notification.permission !== 'granted') return false;
    const reg = await navigator.serviceWorker.ready; let s = await reg.pushManager.getSubscription();
    if(!s){ const k = await call({ op: 'key' }); if(!k || !k.key) return false; s = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: k8(k.key) }); first = true; }
    const r = await call({ op: 'sub', sub: s.toJSON() }); if(r && r.ok && first) call({ op: 'test' }).catch(() => {}); return !!(r && r.ok); }
  let PR = null, PRat = 0;
  function loadPr(force){ if(!isM() || (!force && Date.now() - PRat < 5 * 6e4)) return; PRat = Date.now(); call({ op: 'prefs' }).then(d => { if(d && d.ok){ PR = d; home(); } }).catch(() => { PRat = 0; }); }
  function home(){ const v = $('v-home'); if(!v || !isM()) return; let c = $('pushAl'); if(!c){ c = document.createElement('div'); c.id = 'pushAl'; c.className = 'card small'; c.style.cssText = 'padding:8px 14px;margin:0 0 12px;cursor:pointer;display:flex;align-items:center;gap:10px';
      const lead = v.querySelector('.lead'); if(lead) lead.after(c); else v.prepend(c); c.onclick = () => window.pushAlSheet(); }
    const on = can() && Notification.permission === 'granted' && PR && PR.phones > 0, n = (PR && PR.kinds || []).length;
    const h = `<b>📱 Phone alerts</b><span class="grow mute">${on ? (n ? n + ' on · ' + esc(KINDS.filter(k => PR.kinds.includes(k[0])).map(k => k[1].split(' ')[0]).join(' ')) : 'on this device · none picked yet') : 'off · get a note on your phone when something needs you'}</span><span class="link">${on ? 'Change' : 'Turn on'}</span>`;
    if(c.dataset.h !== h){ c.innerHTML = h; c.dataset.h = h; } }
  window.pushAlSheet = function(){ const sel = new Set((PR && PR.kinds) || []);
    openSheet(`<h1>Phone alerts</h1><div class="small mute">Notes on this phone or laptop, even when the app is closed. Only what you tick.</div>
<div id="paBody" style="margin-top:10px">${KINDS.map(k => `<label class="row" style="gap:10px;align-items:center;padding:8px 0;border-top:1px solid var(--line);font-weight:400"><input type="checkbox" value="${k[0]}" ${sel.has(k[0]) ? 'checked' : ''} style="width:20px;height:20px"><span>${esc(k[1])}</span></label>`).join('')}</div>
<button class="btn block" id="paGo" style="margin-top:12px" onclick="pushAlSave()">Save</button>
<div class="small mute" style="margin-top:8px">iPhone: add the app to the Home Screen first (Share ⬆ › Add to Home Screen). Each device you use is turned on separately.</div>`); };
  window.pushAlSave = async function(){ const b = $('paGo'); const kinds = [...document.querySelectorAll('#paBody input:checked')].map(x => x.value);
    if(b){ b.disabled = true; b.textContent = 'Saving…'; }
    try{ if(!can()) throw { msg: 'This browser cannot get notifications. On iPhone, add the app to the Home Screen first.' };
      if(Notification.permission === 'default') await Notification.requestPermission();
      if(Notification.permission !== 'granted') throw { msg: 'Notifications are blocked for this site · allow them in the browser settings' };
      if(!(await sub(false))) throw { msg: 'This device could not be turned on · try again' };
      const r = await call({ op: 'prefs', kinds }); if(!r || !r.ok) throw { msg: 'Not saved · try again' };
      PR = r; closeSheet(); home(); toast(kinds.length ? '✓ Phone alerts on · ' + kinds.length : 'Phone alerts saved · none picked'); }
    catch(e){ toast((e && e.msg) || 'Not saved · try again'); if(b){ b.disabled = false; b.textContent = 'Save'; } } };
  // who has phone reminders (Performance)
  let WH = null, WHat = 0;
  function perf(){ const v = $('v-perf'); if(!v || VIEW !== 'perf' || !isM()) return; if(Date.now() - WHat > 5 * 6e4){ WHat = Date.now(); call({ op: 'who' }).then(d => { if(d && d.ok){ WH = d.list || []; perf(); } }).catch(() => { WHat = 0; }); }
    if(!WH) return; let p = $('pushWho'); if(!p){ p = document.createElement('section'); p.id = 'pushWho'; p.className = 'card'; p.style.cssText = 'padding:12px 14px;margin:0 0 14px'; const a = $('setupPanel') || $('qaRc') || v.querySelector('.lead'); if(a) a.after(p); else v.prepend(p); }
    const on = WH.filter(x => x.phones), off = WH.filter(x => !x.phones);
    p.innerHTML = `<details><summary><b>📱 Phone reminders · ${on.length} of ${WH.length} teachers</b> <span class="small mute">· first class 2 h before, and after the last class if something is missing</span></summary>
${on.map(x => `<div class="row small" style="gap:8px;padding:6px 0;border-top:1px solid var(--line)"><b class="grow">${esc(x.name)}</b><span class="chip green">✓ ${esc(x.devices.join(', '))}</span><span class="mute">${x.last ? 'last sent ' + esc(new Date(x.last).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })) : 'on since ' + esc(new Date(x.since).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }))}</span></div>`).join('')}
${off.length ? `<div class="small" style="padding:8px 0 0;border-top:1px solid var(--line)"><span class="mute">Not on yet:</span> <b>${esc(off.map(x => x.name).join(', '))}</b></div>` : ''}</details>`; }
  const _rh = window.renderHome; if(_rh) window.renderHome = function(){ const x = _rh.apply(this, arguments); try{ home(); loadPr(); }catch(e){} return x; };
  const _rp = window.renderPerf; if(_rp) window.renderPerf = function(){ const x = _rp.apply(this, arguments); try{ perf(); }catch(e){} return x; };
  setTimeout(() => { try{ if(isM()){ loadPr(); home(); if(can() && Notification.permission === 'granted') sub(false).catch(() => {}); } }catch(e){} }, 5000);

  // ── Today (teacher): smaller boxes ──
  const css = document.createElement('style'); css.textContent = `#ftBox,#mustBox{font-size:13px}#ftBox h3,#mustBox h3{font-size:14px!important;line-height:1.3}#ftBox .small,#mustBox .small{font-size:12px!important}
#ftBox ul{margin:4px 0 0 16px!important}#ftBox li{margin:1px 0!important}#ftBox label{font-size:12.5px;margin-top:6px!important}#ftBox textarea{font-size:13px;padding:6px 10px;min-height:44px}
#ftBox:not(.ftOpen) label,#ftBox:not(.ftOpen) #ftP,#ftBox:not(.ftOpen) #ftB{display:none!important}#ftBox #ftB{width:auto!important;display:inline-block;padding:6px 16px!important;font-size:13px!important}
.ftW{margin-top:6px;padding:5px 12px;font-size:13px;border-radius:10px;border:1.5px solid #C0392B;background:#fff;color:#8E1F12;font-weight:700;cursor:pointer;font-family:inherit}
.must-r{padding:5px 0!important}.must-r b,.must-r .t{font-size:13.5px!important}.must-r .chip{font-size:11px!important;padding:1px 8px!important}.must-r .small{font-size:12px!important}
.must-r .btn{padding:5px 14px!important;font-size:13px!important;min-height:0!important}
#setupCard{padding:8px 12px!important;font-size:13px}#setupCard b{font-size:14px}#setupCard .small{font-size:12px!important;margin-top:2px!important}#setupCard .btn{padding:5px 14px!important;font-size:13px!important;margin-top:6px!important}
@media(max-width:520px){.must-r .btn{width:auto!important}}`;
  document.head.appendChild(css);
  function tidy(){ const f = $('ftBox'); if(f && $('ftB') && !f.querySelector('.ftW')){ const b = document.createElement('button'); b.className = 'ftW'; b.type = 'button'; b.textContent = '✍ Write my plan';
      b.onclick = () => { f.classList.add('ftOpen'); b.remove(); const t = $('ftP'); if(t) t.focus(); }; const ul = f.querySelector('ul'); if(ul) ul.after(b); else f.appendChild(b); } }
  const _rt = window.renderToday; if(_rt) window.renderToday = function(){ const x = _rt.apply(this, arguments); try{ if(isT()) tidy(); }catch(e){} return x; };
  new MutationObserver(() => { try{ if(isT() && $('ftBox') && !$('ftBox').classList.contains('ftOpen') && !$('ftBox').querySelector('.ftW')) tidy(); }catch(e){} }).observe(document.body, { childList: true, subtree: true });
})();
