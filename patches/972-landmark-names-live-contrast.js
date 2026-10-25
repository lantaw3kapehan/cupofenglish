// 972 (QA-A · accessibility, axe-core scan audit/qa-a/axe/): three small, safe fixes found on every screen / one screen.
// · The top bar (logo, name, "Live", online, time-in, refresh, sign out) is a <header> inside <section id="app">, so it was
//   not a page landmark and axe flagged its content as "outside any region" on every screen. It is now role="banner".
// · Teachers › the teacher picker (#ttN, shows "Loading…" first) had no name for screen readers → aria-label "Teacher".
// · The "Live" tag in the top bar was grey #76738A on teal tint #E3F6F6 (contrast 4.09, below 4.5) on every screen →
//   text colour #5C5876 (≈5.9). Same size, same tint, same dot.
// Nothing else changes; no screen code is touched.
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const i = s.lastIndexOf('</body>');
s = s.slice(0, i) + String.raw`<style id="s972">#liveTag.live,#liveTag{color:#5C5876!important}</style>
<script>
/* 972 · banner landmark, teacher picker name */
(function(){
  if(window.__972) return; window.__972 = 1;
  var run = function(){ try{
    var h = document.querySelector('#app > header:not([role])'); if(h) h.setAttribute('role', 'banner');
    var t = document.getElementById('ttN'); if(t && !t.getAttribute('aria-label') && !(t.labels && t.labels.length)) t.setAttribute('aria-label', 'Teacher');
  }catch(e){} };
  run(); var q = 0;
  new MutationObserver(function(){ if(q) return; q = 1; setTimeout(function(){ q = 0; run(); }, 150); }).observe(document.body, { childList: true, subtree: true });
})();
</script>
` + s.slice(i);
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
