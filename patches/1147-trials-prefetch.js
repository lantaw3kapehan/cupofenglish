// 1147: (stability check) Trials · "Booked trial classes" (a tall list) was fetched only when Trials was opened, then inserted ~0.1 s later above the
//      trial list, pushing it down (phone: whole screen). Now it is fetched once in the background after management signs in (and kept on the
//      device by 1146), so it is already there the first time Trials opens.
//   Leave and Trainings: their tidy-ups (plain-words subtitle, labels) ran one frame AFTER each repaint, so every repaint showed the old
//      longer subtitle for a frame and the screen jumped 42 px down and back. They now run before the screen is painted.
require('../tools/lib.js')(process.argv[2], [
  ["  const base = window.renderTP;\n  window.renderTP = function(){ const r = base.apply(this, arguments);\n    try{ load(); const old = $('tpBk');",
   "  (function pre(n){ try{ if(typeof D !== 'undefined' && D && D.mgr && typeof TOKEN !== 'undefined' && TOKEN){ load(); return; } }catch(e){} if(n < 40) setTimeout(() => pre(n + 1), 1500); })(0);   /* 1147 */\n  const base = window.renderTP;\n  window.renderTP = function(){ const r = base.apply(this, arguments);\n    try{ load(); const old = $('tpBk');"],
  ["var q = 0; var mo = new MutationObserver(function(){ if(q) return; q = requestAnimationFrame(function(){ q = 0; try{ tidy(); }catch(x){} }); });",
   "var q = 0; var mo = new MutationObserver(function(){ if(q) return; q = 1; queueMicrotask(function(){ q = 0; try{ tidy(); }catch(x){} }); });"],
  ["let q = 0; const mo = new MutationObserver(() => { if(q) return; q = requestAnimationFrame(() => { q = 0; try{ decorate(); }catch(x){} }); });",
   "let q = 0; const mo = new MutationObserver(() => { if(q) return; q = 1; queueMicrotask(() => { q = 0; try{ decorate(); }catch(x){} }); });"]]);
