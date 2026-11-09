// 1992: (Misty 9 Nov "refresh feels slow" · the new open-time check showed 2–8 s on real laptops) A teacher's Today redraw took about 250 ms on a
//   fast laptop, and more than half of it was the browser being forced to lay the whole page out again, four times per redraw:
//   · the side-menu check read the menu's width on every redraw, even on phones (now: phones never read it; laptops read it once and again
//     only when the window is resized);
//   · the "long class note" check read every note's height straight after drawing (now: done once the browser has drawn the page);
//   · after each redraw Today stayed hidden behind a copy for 0.7 s while it was tidied (now 0.4 s, at most 1 s).
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["const sideOn = () => { const n = document.querySelector('nav'); return !!(n && n.offsetWidth >= 200 && n.offsetWidth < 420 && (!window.matchMedia || matchMedia('(min-width:900px)').matches) && isT()); };",
   "let navW1992 = -1; try{ addEventListener('resize', () => { navW1992 = -1; }); }catch(e){}\n  const sideOn = () => { if(!((!window.matchMedia || matchMedia('(min-width:900px)').matches) && isT())) return false; const n = document.querySelector('nav'); if(!n) return false; if(navW1992 < 0) navW1992 = n.offsetWidth; return navW1992 >= 200 && navW1992 < 420; };   /* 1992: no layout read on phones; once per window size on laptops */"],
  ["v.querySelectorAll('.cls .note').forEach(n => { if(n.dataset.c92) return; n.dataset.c92 = 1; n.title = 'Tap to read all'; if(n.scrollHeight > n.clientHeight + 2) n.classList.add('long');",
   "v.querySelectorAll('.cls .note').forEach(n => { if(n.dataset.c92) return; n.dataset.c92 = 1; n.title = 'Tap to read all'; requestAnimationFrame(() => { try{ if(n.scrollHeight > n.clientHeight + 2) n.classList.add('long'); }catch(e){} });   /* 1992: measured after the browser draws */"],
  ["const HOLD = 700, MAX = 1600;", "const HOLD = 400, MAX = 1000;   /* 1992: was 700 / 1600 */"],
]);
