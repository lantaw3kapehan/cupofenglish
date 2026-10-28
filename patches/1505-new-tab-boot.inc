/* 28 Oct · 1505 · a tab opened on an address (#schedule, #student=ST-…, #teacher=…, #chat=all) opens there, signed in, from the saved copies.
   Read here, before the app rewrites the address. Each tab also keeps its own screen and scroll place (sessionStorage); a brand-new tab without
   an address still starts where the app was last used, as before. */
(function(){
  if(window.__b1505) return;
  var nt = ''; try{ var e = performance.getEntriesByType && performance.getEntriesByType('navigation')[0]; nt = e ? e.type : ''; }catch(x){}
  var raw = ''; try{ raw = decodeURIComponent(String(location.hash || '').slice(1)); }catch(x){ raw = String(location.hash || '').slice(1); }
  /* a reload or Back/Forward keeps the app's own "return to where you were" rules; a newly opened address wins */
  var B = window.__b1505 = { raw: raw, nav: nt, on: !!raw && nt !== 'reload' && nt !== 'back_forward' };
  var m = raw.match(/^(student|teacher|chat)[=\/](.+)$/); if(m){ B.rec = m[1]; B.id = m[2]; B.v = m[1] === 'chat' ? 'chat' : m[1]; }
  else B.v = raw;
  var ss = function(op, k, v){ try{ if(op === 'get') return sessionStorage.getItem(k); sessionStorage.setItem(k, v); }catch(x){ return null; } };
  window.tab1505 = {
    get: function(k){ var v = ss('get', k); if(v != null) return v; if(B.on && B.v) return null; try{ return localStorage.getItem(k); }catch(x){ return null; } },
    set: function(k, v){ ss('set', k, v); try{ localStorage.setItem(k, v); }catch(x){} } };

  var O = function(sel){ return Document.prototype.querySelector.call(document, sel); };
  var isView = function(v){ return typeof VIEWS !== 'undefined' && VIEWS.indexOf(v) > -1; };
  var hasD = function(){ return typeof D !== 'undefined' && !!D; };
  var pres = function(){ try{ return typeof isPres === 'function' && isPres(); }catch(x){ return false; } };
  /* group tabs: the screen opens when its group is in that person's menu (same as the tabs at the top of the group) */
  var SUB = { reports: 'astudents', db: 'astudents', enquiry: 'trials', perf: 'teachers', train: 'teachers', leave: 'teachers', actions: 'teachers', finov: 'payroll', expenses: 'payroll', money: 'payroll', forecast: 'payroll', wallets: 'payroll', team: 'home' };   /* team: the Overview tile */
  /* screens the app adds to the menu a moment after it opens: a tab opened on one of them waits for it (≤ 6 s, "Opening…") instead of
     showing another screen first */
  var LATE = { m: 'monitor mtoday msgs enquiry finov expenses forecast wallets trials train chat team leave actions perf reports db money contract', t: 'act train contract tinbox books chat growth qa' };
  var inMenu = function(v){ try{ return !!O('#navIn > [data-v="' + v + '"]'); }catch(x){ return false; } };
  function view(){ if(!B.v) return ''; if(B.rec === 'student') return D.mgr ? 'astudents' : 'students'; if(B.rec === 'teacher') return D.mgr ? 'teachers' : ''; if(B.rec === 'chat') return 'chat';
    /* the words in the address first (#students = management Students, #my-students = a teacher's), then the screen's own name */
    if(B.v === 'active-students' || B.v === 'active') return D.mgr ? 'astudents' : '';   /* the app shows Packages inside Students */
    var C = []; try{ C = VIEWS.concat((LATE.m + ' ' + LATE.t).split(' ')); }catch(x){}
    try{ for(var i = 0; i < C.length; i++) if(window.coeH && coeH(C[i]) === '#' + B.v) return C[i]; }catch(x){} return C.indexOf(B.v) > -1 ? B.v : ''; }
  function allowed(v){ if(!hasD() || !isView(v) || !document.getElementById('v-' + v)) return false;
    if(v === 'more' || inMenu(v)) return true;
    if(D.mgr && SUB[v]){ if((v === 'wallets' || v === 'forecast') && !pres()) return false; return inMenu(SUB[v]); }
    return false; }
  function openRec(){ var t0 = Date.now();
    (function w(){ try{
      if(B.rec === 'student' && typeof openStudent === 'function' && hasD()){ openStudent(B.id); return; }
      if(B.rec === 'teacher' && typeof openTeacher === 'function' && hasD() && D.mgr){ openTeacher(B.id); return; }
      if(B.rec === 'chat' && window.chat1400 && VIEW === 'chat' && O('#v-chat .ch')){ var p = B.id.split('|'); if(p.length === 3 && chat1400.jump) chat1400.jump(p[0], p[1], Number(p[2])); else chat1400.open(p[0]); return; }
    }catch(x){} if(Date.now() - t0 < 15000) setTimeout(w, 250); })(); }
  try{ var st = document.createElement('style'); st.id = 'b1505s'; st.textContent = 'html.b1505w main.wrap>[id^="v-"]{visibility:hidden!important}html.b1505w main.wrap{position:relative}html.b1505w main.wrap::after{content:"Opening\u2026";position:absolute;left:24px;top:24px;font-size:14px;color:#5E5A76}'; (document.head || document.documentElement).appendChild(st); }catch(x){}
  var picked = 0;
  window.coeBoot1505 = {
    /* called once by the first render with the screen it would open; returns the address's screen when this person may open it */
    pick: function(def){ if(picked || !B.on || !B.v) return null; picked = 1; if(!hasD()) return null; var v = view();
      if(v && allowed(v)){ if(B.rec) setTimeout(openRec, 0); return v; }
      /* the screen is added a moment later: keep the screen area on "Opening…" and open it when it appears (unless you moved on) */
      var late = v && (' ' + (D.mgr ? LATE.m : LATE.t) + ' ').indexOf(' ' + v + ' ') > -1 && !(D.mgr && (v === 'wallets' || v === 'forecast') && !pres());
      if(!late) return null;
      var R = document.documentElement, t0 = Date.now(), off = function(){ R.classList.remove('b1505w'); };
      R.classList.add('b1505w');
      var w = function(){ try{ if(VIEW !== def){ off(); return; } var v2 = view(); if(v2 && allowed(v2)){ window.go(v2); off(); if(B.rec) openRec(); return; } }catch(x){} if(Date.now() - t0 < 6000) setTimeout(w, 150); else off(); };
      setTimeout(w, 0);   /* after render has opened the usual screen */
      return null; },
    state: B };
})();
