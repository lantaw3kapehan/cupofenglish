// 1586: (QA 29 Oct, Students) one Back button, never a stale one.
// Found in QA: cards opened from the student page's Renewal steps showed two back buttons ("‹ Back to Jeoda 学生484" from 794 and
// "‹ Back to Jeoda’s page" from the renewal steps). And the renewal steps' button was remembered for 30 minutes (window._stRet), so
// a card opened later from anywhere (Partner access from the Students list, another student's card) still offered "Back to Jeoda’s page".
// Now: when the card-history Back is there, the second button is not added; a card opened on a closed sheet (a fresh start) forgets the
// old student unless the step was tapped just now (5 s).
const lib = require('../tools/lib.js'), file = process.argv[2];
lib(file, [
  ["</script>\n</body>\n</html>",
   `</script>
<script>
/* 1586 · one Back button */
(function(){
  if(window.__1586 || typeof window.openSheet !== 'function') return; window.__1586 = 1;
  const o = window.openSheet;
  window.openSheet = function(){ const sh = document.getElementById('sheet'), was = !!(sh && sh.classList.contains('on'));
    if(!was && window._stRet && Date.now() - (window._stRet.at || 0) > 5000) window._stRet = null;
    const r = o.apply(this, arguments);
    try{ const sb = document.getElementById('sheetBody'), rb = document.getElementById('rnBack'); if(rb && sb && (sb.querySelector('.sbk') || !window._stRet)) rb.remove(); }catch(e){}
    return r; };
})();
</script>
</body>
</html>`]
]);
