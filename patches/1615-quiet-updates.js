// 1615 · new versions never reload the app while Misty is using it. Until now (1171) a new version reloaded the app the moment
//   the window was hidden (switching to another window for a second) or on the next screen change after 30 min — each reload
//   started cold and fired the background burst right as she came back (11:19, 11:35, 11:37). Now: the update applies only
//   after the app has been hidden for 2 minutes in a row (the reload happens while she is away), or after 15 minutes without
//   any tap or key while nothing is being saved or typed. Never on a screen change.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["  window.applyUpdate = applyUpdate = function(){ if(!ready()) return; if(!since) since = Date.now(); if(document.hidden && calm()) location.reload(); };\n  document.addEventListener('visibilitychange', function(){ if(document.hidden && since && ready() && calm()) location.reload(); });\n  var g = window.go; if(typeof g === 'function') window.go = function(v){ try{ if(since && Date.now() - since > 30 * 6e4 && v && typeof VIEW !== 'undefined' && v !== VIEW && ready() && calm()){ try{ location.hash = (window.coeH ? coeH(v) : '#' + v); }catch(e){} location.reload(); return; } }catch(e){} return g.apply(this, arguments); };",
   "  /* 1615: hidden for 2 min in a row, or 15 min with no tap / key — never while she is using the app */\n" +
   "  var hidAt = document.hidden ? Date.now() : 0, act = Date.now(), ht = 0;\n" +
   "  ['pointerdown', 'keydown', 'wheel', 'touchstart'].forEach(function(ev){ addEventListener(ev, function(){ act = Date.now(); }, { capture: true, passive: true }); });\n" +
   "  function tryNow(){ try{ if(!since || !ready() || !calm()) return; if((document.hidden && hidAt && Date.now() - hidAt >= 12e4) || (!document.hidden && Date.now() - act >= 15 * 6e4)) location.reload(); }catch(e){} }\n" +
   "  window.applyUpdate = applyUpdate = function(){ if(!ready()) return; if(!since) since = Date.now(); tryNow(); };\n" +
   "  document.addEventListener('visibilitychange', function(){ if(document.hidden){ hidAt = Date.now(); clearTimeout(ht); ht = setTimeout(tryNow, 12e4 + 500); } else { hidAt = 0; clearTimeout(ht); act = Date.now(); } });\n" +
   "  setInterval(tryNow, 60000);"],
]);
