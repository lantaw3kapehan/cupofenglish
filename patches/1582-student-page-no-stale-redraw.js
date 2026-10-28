// 1582: (Misty, 29 Oct · Students audit, item 4) an older student page never draws over a newer dialog.
// Root cause: STU (the last student page) stays set after you open another card from it (price picture, renewal, class notice, a
// trial card…). Five late answers redraw the student page whenever STU.code still matches: the full-student refresh after a save
// stamp (30684), the book change (12471, 12676), the teacher chips (24521, 24540). They checked "same student", not "is the student page
// still the open card", so the old page replaced the card you had just opened.
// Now every redraw passes one check (stuCurrent): the sheet is open, it was opened for this student, and it shows this student's page
// (or its loading placeholder). Otherwise the redraw is skipped; the next open draws fresh data anyway (openStudent reads it again).
// Same rule for the teacher app (same function). Nothing else changes.
const lib = require('../tools/lib.js'), file = process.argv[2];
lib(file, [
  ["</script>\n</body>\n</html>",
   `</script>
<script id="coe-stu-current">
/* 1582 · one check before the student page is drawn */
(function(){
  if(window.stuCurrent || typeof window.stuRender !== 'function') return;
  const up = s => String(s || '').trim().toUpperCase();
  window.stuCurrent = function(code){ try{ code = up(code); const sh = document.getElementById('sheet'), sb = document.getElementById('sheetBody');
      if(!code || !sh || !sb || !sh.classList.contains('on') || up(window._stuOpen) !== code) return false;
      if(sb.querySelector('#stuLoad')) return true;                                       // loading this student
      const hero = sb.querySelector('.shero'); if(hero) return up(hero.textContent).indexOf(code) > -1;   // this student's page
      return !!sb.querySelector('.paper') && !sb.querySelector('h1');                      // the empty frame openStudent draws into
    }catch(e){ return true; } };
  const r0 = window.stuRender;
  window.stuRender = function(){ try{ if(typeof STU !== 'undefined' && STU && STU.code && !stuCurrent(STU.code)){ window.__stuSkip1582 = (window.__stuSkip1582 || 0) + 1; return; } }catch(e){}
    return r0.apply(this, arguments); };
})();
</script>
</body>
</html>`]
]);
