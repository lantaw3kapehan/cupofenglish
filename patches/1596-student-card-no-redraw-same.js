// 1596: (Misty 11:57, Abby ST-2026-105 live) 1. "Class notice" flashed filled teal, then outline: the student page template drew it as a
// primary button (btn sm teal) and the colour system (1101) turned it into a secondary one on a timer. The template now draws it in its final
// style (secondary, x1101-sec) from the first paint; Lessons left stays the one primary button.
// 2. The header numbers / Overview flickered on every background refresh: each refresh redrew the whole student page even when nothing had
// changed (later decorators then re-coloured it). Now a redraw of the page that is on screen is skipped when the student's data and
// language toggle are exactly the same as what is already drawn (class lists already update the Schedule box on their own); when something changed it draws as before.
const lib = require('../tools/lib.js'), file = process.argv[2];
lib(file, [
  ["<button class=\"btn sm teal\" onclick=\"cnOpen('${esc(code)}')\">Class notice</button>",
   "<button class=\"btn sm teal x1101-sec\" onclick=\"cnOpen('${esc(code)}')\">Class notice</button>"],
  ["</body>\n</html>",
   `<script>
/* 1596 · the student page on screen is not redrawn with the same data */
(function(){
  if(window.__1596 || typeof window.stuRender !== 'function') return; window.__1596 = 1;
  const r0 = window.stuRender; let last = { code: '', sig: '' };
  const sig = () => { try{ const s = STU.s || {}; return JSON.stringify([STU.code, STU.r, [s.name, s.cn, s.left, s.book, s.teachers, s.shared, s.sharedName, s.sharedWith, s.cefr, s.adult, s.deadline, s.active], typeof FBL !== 'undefined' ? FBL : '']);   /* server data only (decorators add their own fields to STU.s) */ }catch(e){ return String(Math.random()); } };   /* classes: every class update redraws the Schedule box itself */
  window.stuRender = function(){
    try{ if(typeof STU !== 'undefined' && STU && STU.code){ const s = sig(), sb = document.getElementById('sheetBody'), hero = sb && sb.querySelector('.shero');
        const onScreen = hero && (!window.stuCurrent || stuCurrent(STU.code)) && String(hero.textContent).toUpperCase().indexOf(String(STU.code).toUpperCase()) > -1;
        if(onScreen && last.code === STU.code && last.sig === s){ window.__stuSame1596 = (window.__stuSame1596 || 0) + 1; return; }
        const r = r0.apply(this, arguments); last = { code: STU.code, sig: s }; return r; } }catch(e){}   /* the data as it arrived, before the draw */
    return r0.apply(this, arguments); };
})();
</script>
</body>
</html>`]
]);
