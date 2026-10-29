// 1653: (phone To do, about 1 refresh in 8: "the two top sections drop out" ~2.6 s after a refresh, CLS 0.58, also on main)
// The race: 528 (21 Oct) merges To do redraws that come within 350 ms of each other. The merged one ran later on a timer, but it called
// the copy of the screen that 528 had wrapped, not the whole screen, so every step added after 528 was skipped on that redraw:
// 891 "Today's focus right under the title" and the Celebrate box (22667) among them. Today's focus was put back below "Reports not sent"
// (tdFocus puts it before Renewals), the summary tiles and Reports jumped up, and 300 ms later 891's observer moved Today's focus to the
// top again: the summary tiles and Reports dropped down (the shift) and Celebrate was gone until the next redraw. It only happened when two
// answers (TODAY, renewals, trial follow-ups, data to fix, trial reports, agreements …) arrived within 350 ms of each other.
// Fix at the source: the merged redraw now goes through the whole screen (window.renderMToday, every step), once; while it runs, the
// merge lets it straight through. Nothing else changes (same 350 ms merge, a tap still redraws at once).
const lib = require('../tools/lib.js'), file = process.argv[2];
lib(file, [
  ["window.renderMToday = function(){ const a = arguments, now = Date.now(); clearTimeout(t);",
   "let full1653 = 0; window.renderMToday = function(){ const a = arguments, now = Date.now(); clearTimeout(t); if(full1653) return go(a);   /* 1653: the merged redraw, on its way through every step */"],
  ["t = setTimeout(() => { try{ go(a); }catch(e){ console.warn('528', e); } }, 350); };",
   "t = setTimeout(() => { full1653 = 1; try{ window.renderMToday.apply(window, a); }catch(e){ console.warn('528', e); } finally{ full1653 = 0; } }, 350); };   /* 1653: the whole screen, not 528's inner copy */"]
]);
