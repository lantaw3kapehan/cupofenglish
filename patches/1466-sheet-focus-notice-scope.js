// 1466 · President QA 28 Oct (keyboard + "where scope differs, say so on screen").
//   · Several panels opened without moving keyboard focus into them (Students › Partner access, Package check, a class on Schedule,
//     a notice thread, Enquiries › Price picture, + New case), so Tab kept walking the page behind the dialog. Now, when a panel opens
//     and focus is still outside it, focus goes to its ✕ button (or the panel itself) — no scrolling, nothing moves, no phone keyboard.
//   · Overview counted "Notices without “Got it”" for the last 7 days only, while Notices & requests › Waiting on teacher counts all of
//     them (24 vs 25 in the sample). The Overview line now says "(last 7 days)". Display only.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["t:'Notices without “Got it”'", "t:'Notices without “Got it” (last 7 days)'"],
  ["</body>\n</html>",
   "<script>\n/* 1466 · keyboard focus goes into a panel when it opens */\n(function(){\n" +
   "  if(window.__1466) return; window.__1466 = 1;\n" +
   "  function fix(){ var s = document.getElementById('sheet'); if(!s || !s.classList.contains('on') || s.contains(document.activeElement)) return;\n" +
   "    var x = s.querySelector('button.x') || [].slice.call(s.querySelectorAll('button')).find(function(b){ return /^(✕|×)$/.test((b.textContent || '').trim()); });\n" +
   "    if(!x){ x = s; if(!s.hasAttribute('tabindex')) s.setAttribute('tabindex', '-1'); }\n" +
   "    try{ x.focus({ preventScroll: true }); }catch(e){} }\n" +
   "  var o0 = window.openSheet; if(typeof o0 === 'function') window.openSheet = function(){ var r = o0.apply(this, arguments); setTimeout(fix, 0); return r; };\n" +
   "})();\n" +
   "</script>\n</body>\n</html>"],
]);
