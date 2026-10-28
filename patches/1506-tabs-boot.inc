/* 28 Oct · 1506 · several tabs of the app open together (1505 made opening screens in new tabs easy).
   · One tab is the "sounding" tab: the one you used last (tapped, typed, brought to the front). Only it plays chat and class sounds and
     shows phone / desktop alerts and the "Before you start" pop-up, so nothing rings twice. It hands over when it closes; if it vanishes
     without closing (phone killed it), another tab takes over within 2½ minutes.
   · Background updates (every 20 s or slower) pause in tabs that are hidden and not the sounding tab; a tab catches up when you open it.
   · Saves kept on this device (coe.wq, class visits, time-in posts) are sent by one tab at a time. */
(function(){
  if(window.tabLead1506) return;
  var TAB = Math.random().toString(36).slice(2, 10) + Date.now().toString(36), K = 'coe.tabLead', STALE = 150000;
  var now = function(){ return Date.now(); };
  var rd = function(){ try{ return JSON.parse(localStorage.getItem(K) || 'null'); }catch(e){ return null; } };
  var wr = function(){ try{ localStorage.setItem(K, JSON.stringify({ id: TAB, t: now() })); }catch(e){} };
  function lead(){ var L = rd(); if(!L || !L.id){ wr(); return true; } if(L.id === TAB) return true; if(now() - (+L.t || 0) > STALE){ wr(); return true; } return false; }
  var last = 0; function claim(){ var t = now(); if(t - last < 2000) return; last = t; wr(); }
  if(document.visibilityState !== 'hidden') claim();
  document.addEventListener('visibilitychange', function(){ if(document.visibilityState === 'visible') claim(); });
  addEventListener('focus', claim);
  ['pointerdown', 'keydown', 'touchstart'].forEach(function(ev){ addEventListener(ev, claim, { capture: true, passive: true }); });
  addEventListener('pagehide', function(e){ if(e && e.persisted) return; var L = rd(); if(L && L.id === TAB){ try{ localStorage.removeItem(K); }catch(x){} } });
  addEventListener('storage', function(e){ if(e.key === K && !e.newValue && document.visibilityState === 'visible') wr(); });
  var oSI = window.setInterval;
  oSI(function(){ var L = rd(); if(L && L.id === TAB) wr(); else if(!L || now() - (+L.t || 0) > STALE) wr(); }, 15000);   /* heartbeat */
  window.tabLead1506 = lead; window.tabId1506 = TAB;
  /* background updates: a hidden tab that is not the sounding tab skips its slow timers (20 s or more) */
  window.setInterval = function(fn, ms){ if(typeof fn !== 'function' || !(+ms >= 20000)) return oSI.apply(window, arguments); var a = [].slice.call(arguments, 2);
    return oSI(function(){ if(document.visibilityState === 'hidden' && !lead()){ window.__quiet1506 = (window.__quiet1506 || 0) + 1; return; } return fn.apply(this, a); }, ms); };
  /* one tab at a time: sends the saves kept on this device (Web Locks; a short lease in localStorage where they are missing) */
  window.lock1506 = function(name, f){
    try{ if(navigator.locks && navigator.locks.request) return navigator.locks.request('coe-' + name, { ifAvailable: true }, function(l){ return l ? f() : null; }); }catch(e){}
    var k = 'coe.lock.' + name, v = null; try{ v = JSON.parse(localStorage.getItem(k) || 'null'); }catch(e){}
    if(v && v.id !== TAB && now() - (+v.t || 0) < 120000) return Promise.resolve(null);
    try{ localStorage.setItem(k, JSON.stringify({ id: TAB, t: now() })); }catch(e){}
    var done = function(){ try{ var c = JSON.parse(localStorage.getItem(k) || 'null'); if(c && c.id === TAB) localStorage.removeItem(k); }catch(e){} };
    return Promise.resolve().then(f).then(function(r){ done(); return r; }, function(e){ done(); throw e; }); };
})();
