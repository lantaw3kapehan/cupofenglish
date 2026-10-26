// 1192: (Misty, 26 Oct 17:54 — paused item 3) accessibility checks of the TEACHER screens (axe-core + 200 % zoom):
// · Side menu: each item held a hidden "open in new tab" link inside the button (a link inside a button confuses screen
//   readers: axe "nested-interactive" on every screen). The link is gone; Ctrl/Cmd-click or middle-click on a menu item still
//   opens it in a new tab.
// · Needs your action rows: the whole row was a button that also contained its own button. The row stays clickable with the
//   mouse; for keyboard and screen readers the row's own button is the one control (no double stop, no nested buttons).
// · Text that faded to 50 % (finished classes on My schedule, reached pay steps on Growth) now uses a solid muted colour that
//   passes WCAG AA instead of transparency.
// · The short messages at the bottom ("Saved", "Picture copied", …) are announced by screen readers (polite live region).
// · Checked at 200 % zoom (683 × 384 and 960 × 540 CSS px) on all 12 teacher screens: no sideways scroll, nothing cut,
//   header + bottom bar take 37 % of a 384-px-high window (unchanged; content scrolls normally).
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const i = s.lastIndexOf('</body>');
s = s.slice(0, i) + String.raw`<style id="d1192">
#navIn .navlk{display:none!important}
.r501.fin{opacity:1!important}
.r501.fin :is(b,small,span,em,i){color:#5E5A76!important}
.py-t.done span{opacity:1!important}
</style>
<script>
/* 1192 · teacher accessibility */
(function(){
  if(window.__1192) return; window.__1192 = 1;
  try{ var t = document.getElementById('toast'); if(t){ t.setAttribute('role', 'status'); t.setAttribute('aria-live', 'polite'); t.setAttribute('aria-atomic', 'true'); } }catch(e){}
  function navFix(){ try{ document.querySelectorAll('#navIn button[data-v] > a.navlk').forEach(function(a){ a.remove(); });
    document.querySelectorAll('#navIn button[data-v]').forEach(function(b){ if(b.__nt1192) return; b.__nt1192 = 1; var v = b.dataset.v;
      var open = function(e){ var u = location.href.split('#')[0] + '#' + v; e.preventDefault(); e.stopImmediatePropagation(); try{ window.open(u, '_blank', 'noopener'); }catch(x){} };
      b.addEventListener('click', function(e){ if(e.ctrlKey || e.metaKey || e.shiftKey) open(e); }, true);
      b.addEventListener('auxclick', function(e){ if(e.button === 1) open(e); }, true); }); }catch(e){} }
  function rowFix(root){ try{ (root || document).querySelectorAll('#v-today .q1106 .qr[role="button"]').forEach(function(r){ r.removeAttribute('role'); r.removeAttribute('tabindex'); }); }catch(e){} }
  navFix(); rowFix();
  ['render', 'go', 'renderToday'].forEach(function(n){ var f = window[n]; if(typeof f !== 'function' || f.__w1192) return;
    var w = function(){ var r = f.apply(this, arguments); navFix(); rowFix(); return r; }; w.__w1192 = 1; window[n] = w; });
  try{ var v = document.getElementById('v-today'); if(v && window.MutationObserver) new MutationObserver(function(){ rowFix(v); }).observe(v, { childList: true, subtree: true }); }catch(e){}
  try{ var ni = document.getElementById('navIn'); if(ni && window.MutationObserver) new MutationObserver(navFix).observe(ni, { childList: true, subtree: true }); }catch(e){}
})();
</script>
` + s.slice(i);
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
