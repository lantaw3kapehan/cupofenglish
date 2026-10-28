// 1585: (Misty, 29 Oct · Students audit, item 4) Back, Close and Escape do the same thing, and Back never shows an old copy.
// Before: a card opened from another card (Class notice, Lessons left, Agreement… from a student page) showed "‹ Back to …";
//   ✕ and tapping outside went back one card, but Escape closed everything. Back put back a saved COPY of the student page's HTML,
//   so after a save (renewal, note, class) the page you came back to showed the old numbers.
// Now: Escape = ✕ = Back (one card back while there is a card behind; otherwise close). Going back to a student page opens that
//   student again (the kept copy draws at once, fresh data follows through the 1582 check) and keeps your scroll place.
const lib = require('../tools/lib.js'), file = process.argv[2];
lib(file, [
  ["</script>\n</body>\n</html>",
   `</script>
<script>
/* 1585 · Back / ✕ / Escape: one card back; a student page comes back fresh */
(function(){
  if(window.__1585 || typeof window.sheetBack !== 'function') return; window.__1585 = 1;
  const b0 = window.sheetBack;
  window.sheetBack = function(){ const r = b0.apply(this, arguments);
    try{ const sb = document.getElementById('sheetBody'), sh = document.getElementById('sheet'), hero = sb && sb.querySelector('.shero');
      const m = hero && String(hero.textContent || '').match(/ST-\\d{4}-\\d{3}/i);
      if(m && typeof openStudent === 'function'){ const y = sh ? sh.scrollTop : 0; window._stuOpen = m[0].toUpperCase(); openStudent(m[0].toUpperCase());
        requestAnimationFrame(() => { try{ sh.scrollTop = y; }catch(e){} }); } }catch(e){}
    return r; };
  document.addEventListener('keydown', e => { if(e.key !== 'Escape' || e.defaultPrevented) return;
    const sh = document.getElementById('sheet'), sb = document.getElementById('sheetBody'); if(!sh || !sh.classList.contains('on') || !sb) return;
    if(document.querySelector('details[open].acc1584, .ui-menu[open]')) return;
    const k = sb.querySelector(':scope > .sbk, .sbk'); if(!k) return;   /* nothing behind: the usual Escape closes the card */
    e.preventDefault(); e.stopImmediatePropagation(); window.sheetBack(); }, true);
})();
</script>
</body>
</html>`]
]);
