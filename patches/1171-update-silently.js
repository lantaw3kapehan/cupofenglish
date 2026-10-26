// 1171: (Misty, 26 Oct 17:07) "the flickering and auto-adjusting is back in management, why is it always like this".
// Part of the cause: every new release made the OPEN app reload itself on the spot. A management screen re-checked for a
// newer version every 30 s (after a 5-minute version check) and, when one was ready, reloaded the page at once — so after
// each release (many today) the whole screen restarted in front of her, with all its start-up redrawing. Teachers outside a
// class got the same.
// Now a new version is applied quietly: when the app is in the background (another tab or app in front, the laptop asleep),
// or — if it has been waiting more than 30 minutes — at the next change of screen. It never reloads the screen being looked
// at. A teacher in a class is still never interrupted (unchanged rule). Nothing else about updating changes.
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const i = s.lastIndexOf('</body>');
s = s.slice(0, i) + String.raw`<script>/* 1171 · new versions are applied in the background or at the next screen change, never on top of the open screen */
(function(){ if(window.__1171) return; window.__1171 = 1;
  function ready(){ try{ return (typeof newerSaved === 'function' && newerSaved()) || !!window._updNet; }catch(e){ return false; } }
  function calm(){ try{ return !(typeof busy === 'function' && busy()) && !(typeof updQuiet === 'function' && updQuiet()); }catch(e){ return false; } }
  var since = 0;
  window.applyUpdate = applyUpdate = function(){ if(!ready()) return; if(!since) since = Date.now(); if(document.hidden && calm()) location.reload(); };
  document.addEventListener('visibilitychange', function(){ if(document.hidden && since && ready() && calm()) location.reload(); });
  var g = window.go; if(typeof g === 'function') window.go = function(v){ try{ if(since && Date.now() - since > 30 * 6e4 && v && typeof VIEW !== 'undefined' && v !== VIEW && ready() && calm()){ try{ location.hash = (window.coeH ? coeH(v) : '#' + v); }catch(e){} location.reload(); return; } }catch(e){} return g.apply(this, arguments); };
})();
</script>
` + s.slice(i);
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
