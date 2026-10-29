// 1587: (Misty 08:57, Abby ST-2026-105, laptop: "the boxes here show old then the new, it adjusts too") the student page paints in its
// final form. Measured on the preview (open a student, watch 6 s, every DOM change + layout shift): the page was drawn, then patches that
// run LATER (timers) rearranged it, and every refresh of the page (kept copy → fresh data) repeated the dance. Causes, all pre-existing:
//  1. More actions (1000) folded the toolbar 60 ms after the draw: two rows of buttons (86 px) → one row (46 px), everything below jumped 40 px.
//  2. Renewal steps (rnPaint, timer 0) inserted the box after the draw (+68 px), with "Renewal · step by step · 0 of 6 done", and a second
//     painter (timer 5) replaced it with "Changes · step by step …".
//  3. Package bar (pb29) added on a later frame (+32 px).
//  4. Status chip: 1101 puts a ✓ icon inside the Status chip, the header pill read "✓Active" as an unknown status → "off" style + "✓Active",
//     then "Active" again on the next draw (flip on every refresh). The renewal steps had the same misread (◷Trial ≠ Trial).
//  5. Status notes: the loading bar (36 px) became "No notes yet." (20 px) → −16 px.
//  6. Phone: the loading card was 174 px high and grew to the full sheet when the page arrived; now it opens at the sheet's height.
// Fix: the deferred painters run inside the same draw (one frame, final structure), the later timers find nothing to change; the chip label
// ignores the icon; the notes loading bar has the height of one line. Plus: "More actions" chevron drawn with CSS (the ▾ text glyph
// showed as a dot in Inter) — same look, no font dependency.
const lib = require('../tools/lib.js'), file = process.argv[2];
lib(file, [
  ["const ch = body.querySelector('#stuStat h2 .chip'), lb = ch ? ch.textContent.trim() : ''",
   "const ch = body.querySelector('#stuStat h2 .chip'), lb = ch ? ch.textContent.replace(/^[✓◷!]\\s*/, '').trim() : ''   /* 1587: not the 1101 icon */"],
  ["const chip = box.querySelector('h2 .chip'), lb = chip ? chip.textContent.trim() : ''; let el = $('stuRn');",
   "const chip = box.querySelector('h2 .chip'), lb = chip ? chip.textContent.replace(/^[✓◷!]\\s*/, '').trim() : ''; let el = $('stuRn');   /* 1587 */"],
  ["el.innerHTML = rnStepsHtml(STU.code); if(was != null){ const d = el.querySelector('details'); if(d) d.open = was; } }catch(e){} }",
   "if(el.dataset.ch) return;   /* 1587: the Changes · step by step painter owns this box */\n    el.innerHTML = rnStepsHtml(STU.code); if(was != null){ const d = el.querySelector('details'); if(d) d.open = was; } }catch(e){} }"],
  ["window.chTab = function(k){ if(!STU) return; TAB[up(STU.code)] = k; paint(true); };",
   "window.chTab = function(k){ if(!STU) return; TAB[up(STU.code)] = k; paint(true); }; window.chPaint1587 = paint;"],
  ["  function deco(){ const box = document.getElementById('stuPkg'); if(!box) return;",
   "  window.pkgDeco1587 = () => deco();\n  function deco(){ const box = document.getElementById('stuPkg'); if(!box) return;"],
  ['.m1000>summary::after{content:"▾";margin-left:6px;font-size:.75em;opacity:.7}',
   '.m1000>summary::after{content:"";display:inline-block;width:6px;height:6px;margin:0 2px 3px 9px;border-right:1.6px solid currentColor;border-bottom:1.6px solid currentColor;transform:rotate(45deg);opacity:.75;vertical-align:middle}.m1000[open]>summary::after{transform:rotate(225deg);margin-bottom:-1px}'],
  ["box.innerHTML = '<h2>Package <span class=\"c\">ACTIVE</span></h2>' + o.rows.map(", "const h1587 = '<h2>Package <span class=\"c\">ACTIVE</span></h2>' + o.rows.map("],
  ["agrBit(o) + '</div>' : ''); }", "agrBit(o) + '</div>' : ''); if(box.dataset.h1587 === h1587 && box.querySelector('.pb29')) return; box.innerHTML = h1587; box.dataset.h1587 = h1587; try{ if(window.pkgDeco1587) pkgDeco1587(); }catch(e){} }   /* 1587: same package \u2192 no redraw; the bar in the same frame */"],
  ["</script>\n</body>\n</html>",
   `</script>
<style id="css1587">#stuStat .sk{height:20px!important;margin:0!important}</style>
<script>
/* 1587 · student page: everything that used to arrive on a timer is drawn in the same frame */
(function(){
  if(window.__1587 || typeof window.stuRender !== 'function') return; window.__1587 = 1;
  /* phone: the loading card already has the page's height (it grew from 174 px to the full sheet when the page arrived) */
  const sh = () => document.getElementById('sheet');
  const o0 = window.openStudent; if(typeof o0 === 'function') window.openStudent = function(){ const r = o0.apply(this, arguments);
    try{ const s = sh(); if(s && innerWidth < 700 && document.getElementById('stuLoad')){ const mh = getComputedStyle(s).maxHeight; if(mh && mh !== 'none') s.style.minHeight = mh; } }catch(e){} return r; };
  const r0 = window.stuRender;
  window.stuRender = function(){ try{ const s = sh(); if(s && s.style.minHeight) s.style.minHeight = ''; }catch(e){} const r = r0.apply(this, arguments);
    try{ if(typeof STU === 'undefined' || !STU || (window.stuCurrent && !stuCurrent(STU.code))) return r;
      if(window.rnPaint) rnPaint(); if(window.chPaint1587) chPaint1587(true);
      if(window.__p1000) __p1000(); if(window.pkgDeco1587) pkgDeco1587(); }catch(e){}
    return r; };
})();
</script>
</body>
</html>`]
]);
