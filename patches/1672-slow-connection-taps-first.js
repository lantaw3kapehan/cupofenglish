// 1672: (Misty, 30 Oct 08:22) "Everything is slow when opening now" + "I cancelled a class but it does not reflect instantly".
// What happened: her laptop was on a slow connection (3G speed measured on her time-in). On open the app sends about 100 requests at
// once (database screens + Google refreshes of last night's copies). On a slow link they all share the same thin line, so the screen
// she tapped waited behind background refreshes, and the class cancel (database first, 9 s limit) gave up before it arrived and fell
// back to Google, which was busy with the same backlog. Nothing reached the database or Google Calendar.
// Changes (screens only, nothing stored changes):
//   1. Every request knows if someone tapped for it: tapped requests and every save go first ("high"), background refreshes go after
//      ("low"). Chrome sends the high ones first on a busy line.
//   2. Class cancel / move / restore and Add class wait up to 30 s for the database (was 9 s) before trying Google. The database
//      saves it once even if it is sent twice (same request id), and is far quicker than Google on any line.
//   3. On a slow connection (Chrome reports 3G or slower, or less than 1 Mbps), background Google refreshes start 15 s after opening
//      (was 3.5 s) and go one at a time (was two), so taps are not stuck behind them.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  // 3 · background Google queue on a slow line
  ["const wait = Math.max(3500 - performance.now(), ui > 0 || tapped() ? 300 : 0, run >= 2 ? 250 : 0, 200 - (Date.now() - last));",
   "const sl = typeof window.slow1672 === 'function' && window.slow1672(); const wait = Math.max((sl ? 15000 : 3500) - performance.now(), ui > 0 || tapped() ? 300 : 0, run >= (sl ? 1 : 2) ? 250 : 0, (sl ? 1000 : 200) - (Date.now() - last));"],
  // 2 · class cancel / move / restore: the database gets 30 s
  ["if(fn === 'editClass' && TOKEN && D && D.mgr && f && /^(cancel|restore|move)$/.test(f.action) && (!f.forward || f.action === 'cancel' || f.action === 'move') && !(f.action === 'cancel' && f.makeup && f.forward)){   /* 353: Stop this schedule too · 361: move the later classes too · 362: make-ups too */\n      const ac = window.AbortController ? new AbortController() : null, tid = ac ? setTimeout(() => ac.abort(), 9000) : 0;",
   "if(fn === 'editClass' && TOKEN && D && D.mgr && f && /^(cancel|restore|move)$/.test(f.action) && (!f.forward || f.action === 'cancel' || f.action === 'move') && !(f.action === 'cancel' && f.makeup && f.forward)){   /* 353: Stop this schedule too · 361: move the later classes too · 362: make-ups too */\n      const ac = window.AbortController ? new AbortController() : null, tid = ac ? setTimeout(() => ac.abort(), 30000) : 0;   /* 1672: was 9 s */"],
  // 2 · Add class: the database gets 30 s
  ["if(fn === 'addClass' && TOKEN && typeof D !== 'undefined' && D && D.mgr && f){   /* 362: substitutes too */\n      const ac = window.AbortController ? new AbortController() : null, tid = ac ? setTimeout(() => ac.abort(), 9000) : 0;",
   "if(fn === 'addClass' && TOKEN && typeof D !== 'undefined' && D && D.mgr && f){   /* 362: substitutes too */\n      const ac = window.AbortController ? new AbortController() : null, tid = ac ? setTimeout(() => ac.abort(), 30000) : 0;   /* 1672: was 9 s */"]
]);
const fs = require('fs');
let s = fs.readFileSync(file, 'utf8');
const i = s.indexOf('<script>');
s = s.slice(0, i) + String.raw`<script>
/* 1672 · taps and saves first on a busy line; slow-line check */
(function(){
  if(window.__1672 || typeof window.fetch !== 'function') return; window.__1672 = 1;
  var of = window.fetch, MINE = /supabase\.co\/functions\/|script\.google(usercontent)?\.com/;
  var SAVE = /"op":"(write|classEdit|classAdd|setBook|staff|timeIn|classIn)"|"fn":"(timeIn|classIn|saveNote|editClass|addClass)"/;
  window.slow1672 = function(){ try{ var c = navigator.connection; if(!c) return false;
    return /^(slow-2g|2g|3g)$/.test(String(c.effectiveType || '')) || (c.downlink > 0 && c.downlink < 1); }catch(e){ return false; } };
  window.fetch = function(u, o){
    try{ var url = typeof u === 'string' ? u : (u && u.url) || '';
      if(MINE.test(url) && !(o && o.priority)){
        var b = o && typeof o.body === 'string' ? o.body : '', tapped = Date.now() - (window._ui || 0) < 1500;
        o = Object.assign({}, o || {}, { priority: tapped || SAVE.test(b.slice(0, 400)) ? 'high' : 'low' }); }
    }catch(e){}
    return of.call(this, u, o); };
})();
</script>
` + s.slice(i);
fs.writeFileSync(file, s);
