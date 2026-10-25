// 971 (QA-A · accessibility, keyboard): elements the screens already made focusable themselves (tabindex="0" + onclick,
// no role) were skipped by the 881 enhancer, so Tab reached them but Enter/Space did nothing and a screen reader did not
// announce them as buttons. Found by the scripted keyboard walk (audit/qa-a/keyboard/): Teacher › Growth attendance bars
// (".att-c", tap shows the month's details), and the same pattern anywhere else.
// Change: such elements get role="button" (only when they hold no other control), a name from their title when they have
// one, and Enter/Space activate them like a click. Documents (print area, previews) are left alone, as in 881.
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const i = s.lastIndexOf('</body>');
s = s.slice(0, i) + String.raw`<script>
/* 971 · keyboard: pre-focusable clickables (tabindex + onclick, no role) */
(function(){
  if(window.__971) return; window.__971 = 1;
  var SEL = '[onclick][tabindex]:not([tabindex="-1"]):not(button):not(a[href]):not(input):not(select):not(textarea):not(summary):not(label)';
  var DOCS = '#printArea,.docprint,.paper,.memo,.sd,.ivp,.ivq,.tr-page,#rfNote,[data-doc]';
  var INTER = 'button,a[href],input,select,textarea,summary,[onclick],[tabindex]';
  var ok = function(el){ return el && el.matches && el.matches(SEL) && !el.__a881k && !el.isContentEditable && !(el.closest && el.closest(DOCS)) && el.id !== 'scrim'; };
  var fix = function(){ q = 0;
    try{ [].forEach.call(document.querySelectorAll(SEL + ':not([role])'), function(el){ if(el.__971 || !ok(el)) return; el.__971 = 1;
      var oc = el.getAttribute('onclick') || ''; if(/event\.target\s*===?\s*this/.test(oc)) return;
      if(el.querySelector(INTER)) return;
      el.setAttribute('role', 'button');
      if(!el.getAttribute('aria-label') && el.getAttribute('title')) el.setAttribute('aria-label', el.getAttribute('title').trim()); }); }catch(e){ console.warn('971', e); } };
  var q = 0, kick = function(){ if(q) return; q = 1; (window.requestIdleCallback || function(f){ return setTimeout(f, 80); })(fix, { timeout: 300 }); };
  new MutationObserver(function(ms){ for(var k = 0; k < ms.length; k++) if(ms[k].addedNodes.length){ kick(); return; } }).observe(document.body, { childList: true, subtree: true });
  document.addEventListener('keydown', function(e){
    if(e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey || (e.key !== 'Enter' && e.key !== ' ' && e.key !== 'Spacebar')) return;
    var el = e.target; if(!ok(el)) return;
    var oc = el.getAttribute('onclick') || ''; if(/event\.target\s*===?\s*this/.test(oc)) return;
    e.preventDefault(); el.click(); });
  kick();
})();
</script>
` + s.slice(i);
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
