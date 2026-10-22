// 22 Oct · final QA:
// 1) the Addendum banner and the notice-of-breach banner on Today both use the "ct-ban" style; the Addendum code now ignores the
//    notice banner (before, one could replace the other).
// 2) a phone alert that opens the app with ?go=contract (or another screen) goes straight to that screen.
require('../tools/lib.js')(process.argv[2], [
["v.querySelector('.ct-ban')", "v.querySelector('.ct-ban:not(.nt-ban)')"],
["  window.NT_RULES = RULES;", `  window.NT_RULES = RULES;
  setTimeout(function w(){ if(typeof D === 'undefined' || !D) return setTimeout(w, 1500); try{ const g = new URLSearchParams(location.search).get('go'); if(g && VIEWS.indexOf(g) >= 0 && typeof VIEW !== 'undefined' && VIEW !== g){ go(g); history.replaceState(null, '', location.pathname + location.hash); } }catch(x){} }, 2500);`],
]);
