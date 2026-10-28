/* 28 Oct · 1506 · several tabs open together: no double sounds or alerts, signing out signs out every tab, drafts are not overwritten */
(function(){
  if(window.__1506) return; window.__1506 = 1;
  var lead = function(){ try{ return !window.tabLead1506 || tabLead1506(); }catch(e){ return true; } };

  /* ── sounds, phone / desktop alerts and class reminders: only in the sounding tab ── */
  var wrap = function(name, quiet){ var f = window[name]; if(typeof f !== 'function' || f.__1506) return; var w = function(){ if(!lead()) return quiet; return f.apply(this, arguments); }; w.__1506 = 1; window[name] = w; };
  wrap('notify', Promise.resolve(false));   /* phone / desktop notification */
  wrap('ding', undefined);                  /* message sound */
  wrap('chime', false);                     /* class sound */
  /* class / pay / to-do reminders are "told" once per device: another tab leaves them for the sounding tab instead of using them up */
  (function(){ var f = window.remTold; if(typeof f !== 'function' || f.__1506) return; var w = function(){ if(!lead()) return true; return f.apply(this, arguments); }; w.__1506 = 1; window.remTold = w; })();

  /* ── sign out in one tab → every tab signs out; signing in again (or as someone else) → the other tabs follow ── */
  addEventListener('storage', function(e){ try{
    if(e.key !== 'coe.token') return; var cur = typeof TOKEN !== 'undefined' ? TOKEN : null;
    if(!e.newValue){ if(cur && typeof logout === 'function'){ logout(true); try{ toast('Signed out in another tab'); }catch(x){} } return; }
    if(e.newValue !== cur){ try{ if(typeof busy === 'function' && busy()) return setTimeout(function(){ location.reload(); }, 3000); }catch(x){} location.reload(); }
  }catch(x){} });

  /* ── saves kept on this device: one tab sends them at a time ── */
  (function(){ var f = window.wqFlush; if(typeof f !== 'function' || f.__1506) return; var w = function(){ var self = this, a = arguments; return window.lock1506 ? lock1506('wq', function(){ return f.apply(self, a); }) : f.apply(self, a); }; w.__1506 = 1; window.wqFlush = w; })();

  /* ── drafts (class notes, QA evaluations, monthly feedback): a tab never writes over a draft another tab changed since this tab last
        saved it. It says so once; closing and reopening the form there continues from the newest version. ── */
  var DK = /^coe\.(nd:|qa\.draft\.|fbx\.(?!d\.))/, MINE = {}, WARN = {};
  var st = window.store;
  if(typeof st === 'function' && !st.__1506){ var sw = function(op, k, v){
      if((op === 'set' || op === 'del') && typeof k === 'string' && DK.test(k)){
        var cur; try{ cur = localStorage.getItem(k); }catch(e){ return st.apply(this, arguments); }
        var nv = op === 'set' ? String(v) : null;
        if(Object.prototype.hasOwnProperty.call(MINE, k) && cur !== MINE[k] && cur !== nv){
          if(!WARN[k]){ WARN[k] = 1; try{ toast('This draft was changed in another tab · that version is kept. Close and reopen this form to continue from it.'); }catch(e){} }
          return; }
        var r = st.apply(this, arguments); MINE[k] = nv; return r; }
      return st.apply(this, arguments); };
    sw.__1506 = 1; window.store = sw; }
  var os = window.openSheet; if(typeof os === 'function') window.openSheet = function(){ MINE = {}; WARN = {}; return os.apply(this, arguments); };
  window.draft1506 = function(){ return { mine: Object.keys(MINE), warn: Object.keys(WARN) }; };   /* tests */
})();
