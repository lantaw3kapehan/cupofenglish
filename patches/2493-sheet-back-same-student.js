// 2493 (Misty 11:18: "changing the schedule of Maria, then suddenly the lesson summary history of Lemon is showing"):
//   the sheet's "‹ Back" memory (794) kept Lemon's Lesson summary while Misty moved on to Maria. Now:
//   · the memory is cleared whenever another student is opened;
//   · each remembered card notes whose student it was; Back or ✕ never returns to another student's card (it just closes).
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["  window.sheetBack = function(){ const p = ST.pop(); if(!p) return window.closeSheet(); const x = sh(), b = body(); if(!x || !b) return;",
   "  const who2493 = () => { try{ return typeof STU !== 'undefined' && STU && STU.code ? String(STU.code).toUpperCase() : ''; }catch(e){ return ''; } };\n  window.sheetClear = () => { ST.length = 0; try{ const k = body() && body().querySelector('.sbk'); if(k) k.remove(); }catch(e){} };\n  window.sheetBack = function(){ const p = ST.pop(); if(!p) return window.closeSheet(); if(p.who !== who2493()){ ST.length = 0; return window.closeSheet(); } const x = sh(), b = body(); if(!x || !b) return;"],
  ["  window.openSheet = function(html){ const was = on(), b = body(), x = sh(), prev = was && b ? { html: b.innerHTML, top: x ? x.scrollTop : 0, wide: x && x.classList.contains('wide'), t: h1(b) } : null;",
   "  window.openSheet = function(html){ const was = on(), b = body(), x = sh(), prev = was && b ? { html: b.innerHTML, top: x ? x.scrollTop : 0, wide: x && x.classList.contains('wide'), t: h1(b), who: who2493() } : null;"],
  ["<script id=\"b2278\">", "<script id=\"b2493\">\n(function(){ const o = window.openStudent; if(typeof o !== 'function') return;\n  window.openStudent = function(){ try{ if(window.sheetClear) sheetClear(); }catch(e){} return o.apply(this, arguments); }; })();\n</script>\n<script id=\"b2278\">"]
]);
