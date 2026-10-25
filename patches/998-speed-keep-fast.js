// 998: (Misty, 25 Oct 19:51) "just ensure things or clicking still fast". Speed check of today's releases (12-screen tour,
// same sample data): the 991 typography layer added ≈ 1.5 s of extra main-thread work (long tasks 2.7–3.2 s → 4.3–4.7 s).
// Cause: 991 kept its style sheet last by re-adding it whenever a style was added; 880 does the same for its own sheet,
// so the two kept re-adding after each other and 880 re-read every style rule each time. Plus 991 re-scanned all tables
// on every change anywhere on the page.
// Fix: 991's tokens already win by specificity (html:root), so the re-adding stops; the amount-column scan runs after a
// screen change / redraw instead of on every DOM change. Measured after: back to the 1220 baseline (2.7–2.9 s).
// Also 993: the Active list no longer waits for the database sub count (up to 4 s on a slow line); it shows at once and
// the counts are corrected the moment they arrive.
const lib = require('../tools/lib.js'), file = process.argv[2];
lib(file, [
  ["  new MutationObserver(function(ms){ for(var k = 0; k < ms.length; k++) for(var j = 0; j < ms[k].addedNodes.length; j++){ var n = ms[k].addedNodes[j]; if(n !== st && (n.nodeName === 'STYLE' || n.nodeName === 'LINK')){ setTimeout(place, 150); return; } } })\n    .observe(document.head, { childList: true });",
   "  /* 998: no re-adding (it ping-ponged with 880) · the tokens win by specificity */"],
  ["  new MutationObserver(function(){ clearTimeout(tq); tq = setTimeout(scan, 200); }).observe(document.body, { childList: true, subtree: true });",
   "  var later = function(){ clearTimeout(tq); tq = setTimeout(scan, 400); }; var _g = window.go; if(typeof _g === 'function') window.go = function(){ var r = _g.apply(this, arguments); later(); setTimeout(later, 1500); return r; }; var _r = window.render; if(typeof _r === 'function') window.render = function(){ var r = _r.apply(this, arguments); later(); return r; };   /* 998 */"],
  ["return Promise.all([p, q]).then(function(v){ return apply(v[0], v[1]); }); };",
   "q.then(function(S){ if(!S) return; p.then(function(A){ apply(A, S); try{ if(typeof AT !== 'undefined' && AT && AT !== A) apply(AT, S); if(VIEW === 'active') renderActive(); }catch(e){} }, function(){}); }); return p; };   /* 998: no wait */"]
]);
