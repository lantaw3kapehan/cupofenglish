// 1141: (Misty, 26 Oct 16:30, Teacher Kat's screen) "these pop-out notices … keep on popping … they are just emotionally
//      irritating" and "See what to fix is not being clicked".
// · The "Before you start · Management is waiting" pop-up is switched off for good. The same items stay calmly in Today's
//   "Needs your action" list (and the phone badge / tab count), where the teacher can act on them when it suits her.
// · "To fix" now opens Growth AT the "To fix" section (before, Growth opened at the top, so it looked like nothing happened).
const lib = require('../tools/lib.js'), fs = require('fs'), file = process.argv[2];
lib(file, [["onclick=\"fxSeenAll();go('growth')\"",
  "onclick=\"fxSeenAll();go('growth');(function t(n){setTimeout(function(){try{var h=[].slice.call(document.querySelectorAll('#v-growth h2,#v-growth h3,#v-growth summary,#v-growth b')).find(function(x){return /^To fix/.test(x.textContent.trim())});if(h){h.scrollIntoView({behavior:'smooth',block:'start'});}else if(n<8)t(n+1);}catch(e){}},250)})(0)\""]]);
let s = fs.readFileSync(file, 'utf8');
const i = s.lastIndexOf('</body>');
s = s.slice(0, i) + String.raw`<script>
/* 1141 · no "Before you start" pop-up (items stay in Needs your action) */
(function(){
  if(window.__1141) return; window.__1141 = 1;
  var _o = window.openSheet;
  if(typeof _o === 'function') window.openSheet = function(h){ if(typeof h === 'string' && h.indexOf('id="mustPop"') > -1) return; return _o.apply(this, arguments); };
  try{ var mp = document.getElementById('mustPop'); if(mp && typeof closeSheet === 'function') closeSheet(); }catch(e){}
})();
</script>
` + s.slice(i);
fs.writeFileSync(file, s);
lib(file, []);
