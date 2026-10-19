/* 19 Oct · 331 · Phone notifications that arrive even when the app is closed (free web push · coe-push function)
   Teachers only. When reminders are allowed on this phone, the phone is quietly registered under her name (no phone number).
   The database then sends: first class of the day 2 h before, and 15 min after her last class ONLY if a video / homework / class note is still missing.
   iPhone: works only after "Add to Home Screen" (iOS 16.4+); the card says so. */
(function(){
  const PUSH = FAST_URL + '-push';
  const call = b => fetch(PUSH, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(b) }).then(r => r.json());
  const isT = () => !!(typeof D !== 'undefined' && D && !D.mgr && TOKEN);
  const ok = () => 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
  const ios = /iPhone|iPad|iPod/.test(navigator.userAgent), standalone = (window.matchMedia && matchMedia('(display-mode: standalone)').matches) || navigator.standalone;
  const k8 = s => { const p = '='.repeat((4 - s.length % 4) % 4), b = atob((s + p).replace(/-/g, '+').replace(/_/g, '/')); return Uint8Array.from(b, c => c.charCodeAt(0)); };
  let busy = false;
  async function ensure(first){
    if(busy || !isT() || !ok() || Notification.permission !== 'granted') return; busy = true;
    try{
      const reg = await navigator.serviceWorker.ready; let sub = await reg.pushManager.getSubscription();
      if(!sub){ const k = await call({ op: 'key' }); if(!k || !k.key) return; sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: k8(k.key) }); first = true; }
      const tag = sub.endpoint + '|' + String(D.me || D.name || '') + '|' + new Date().toISOString().slice(0, 10);
      let was = ''; try{ was = localStorage.getItem('coe.push.ok') || ''; }catch(e){}
      if(was === tag && !first) return;
      const r = await call({ op: 'sub', token: TOKEN, sub: sub.toJSON() });
      if(r && r.ok){ try{ localStorage.setItem('coe.push.ok', tag); }catch(e){} if(first) call({ op: 'test', token: TOKEN }).catch(() => {}); }
    }catch(e){} finally{ busy = false; } }
  // the existing "Turn on class reminders" button: after she allows, register the phone too
  const _ask = window.askNotify; if(_ask) window.askNotify = async function(){ const x = await _ask.apply(this, arguments); try{ await ensure(true); }catch(e){} return x; };
  // iPhone in Safari (not added to the Home Screen): reminders can't work there yet, say how once
  function iosCard(){ const v = $('v-today'); if(!v || !isT() || !ios || standalone || 'PushManager' in window && 'Notification' in window) return; let c = $('pushIos');
    let gone = false; try{ gone = localStorage.getItem('coe.push.ios') === '1'; }catch(e){} if(gone){ if(c) c.remove(); return; }
    if(c) return; c = document.createElement('div'); c.id = 'pushIos'; c.className = 'remcard';
    c.innerHTML = `<div class="grow"><b>🔔 Get class reminders on your iPhone</b><div class="small mute">Tap Share <b>⬆</b> → <b>Add to Home Screen</b>, open CupOfEnglish from the new icon, then tap Turn on.</div></div><button class="btn sm ghost" onclick="try{localStorage.setItem('coe.push.ios','1')}catch(e){};this.parentNode.remove()">OK</button>`;
    const lead = v.querySelector('.lead'); if(lead) lead.after(c); else v.prepend(c); }
  const _rt = window.renderToday; if(_rt) window.renderToday = function(){ const x = _rt.apply(this, arguments); try{ iosCard(); ensure(); }catch(e){} return x; };
  setTimeout(() => { try{ ensure(); }catch(e){} }, 6000);
})();
