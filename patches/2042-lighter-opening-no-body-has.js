// 2042 (10 Nov morning · follow-up to the 9 Nov freezes, "make opening lighter, especially on slow Windows laptops"):
//   Measured in a headless browser with the CPU slowed 4× (a slow laptop), opening Teacher Today: the page spent 6.5 s recalculating
//   styles in 165 passes. Almost all of it came from one style rule, "body:has(.sheet.on) header, nav {…}": a :has() on <body> makes
//   the browser re-check the whole page on every change while the app builds its screens. The same rule now uses a body class set
//   when the pop-up sheet opens or closes (one small watcher on the sheet's class only). "body:has(#kxSide)" is replaced the same way.
//   Result (same test): style work 6.5 s → 2.6 s, page ready 11.2 s → 6.3 s at 4× slow CPU (about 2.8 s → 1.6 s on a normal laptop).
const file = process.argv[2];
require('../tools/lib.js')(file, [
 ["body:has(.sheet.on) header,body:has(.sheet.on) nav{", "body.sheet-on2042 header,body.sheet-on2042 nav{"],
 ["css.textContent = 'body:has(#kxSide) #cmHead:not(.g){display:none!important}';", "css.textContent = 'body.kx2042 #cmHead:not(.g){display:none!important}';   /* 2042: no :has() on body */"],
 ["if(!box){ box = document.createElement('div'); box.id = 'kxSide';", "if(!box){ box = document.createElement('div'); box.id = 'kxSide'; try{ document.body.classList.add('kx2042'); }catch(e){}"],
 ['<div class="sheet" id="sheet"><div class="grab"></div><button class="x noprint" onclick="closeSheet()" aria-label="Close">✕</button><div id="sheetBody"></div></div>',
  '<div class="sheet" id="sheet"><div class="grab"></div><button class="x noprint" onclick="closeSheet()" aria-label="Close">✕</button><div id="sheetBody"></div></div>\n<script id="x2042">/* 2042 · body.sheet-on2042 follows the sheet (replaces body:has(.sheet.on)) */ (function(){ try{ var sh = document.getElementById(\'sheet\'); if(!sh) return; var f = function(){ document.body.classList.toggle(\'sheet-on2042\', sh.classList.contains(\'on\')); }; f(); new MutationObserver(f).observe(sh, { attributes: true, attributeFilter: [\'class\'] }); }catch(e){} })();</script>']
]);
