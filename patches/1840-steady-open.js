// 1840: (Misty 7 Nov "what about the flickering? it seems it's back, management and teacher access")
//   Found: for the first ~5 s after opening, Teacher Today was rebuilt again and again as each part of the data arrived, and its
//   cards popped in and out (Christmas card, the first-week box, two versions of the Teacher of the Month card taking turns,
//   the header badge switching between two texts). The loading card lifted after 2.2 s, in the middle of that; management had
//   no loading card at all.
//   · The loading card now covers management too, and stays until the screen is still (0.6 s without changes, at most 5 s).
//   · The old Teacher of the Month card (kxTotm) is no longer shown: the newer card replaces it, so they stop taking turns.
//   · Overview "Needs you" is put back in the same moment as the Overview redraws (no gap).
const lib = require('../tools/lib.js'), file = process.argv[2];
lib(file, [
  ["if(c && !/\"mgr\":true/.test(c) && window.__curtain1320) window.__curtain1320();",
   "if(c && window.__curtain1320) window.__curtain1320();   /* 1840: management too */"],
  ["if((now - last > 350 && now - dAt > 500) || now - dAt > +(window.__cap1320 || 2200)) off(); }, 100); }",
   "if((now - last > 600 && now - dAt > 700) || now - dAt > +(window.__cap1320 || 5000)) off(); }, 100); }   /* 1840: wait until the screen is still */"],
  ["const soon = () => { if(busy) return; busy = 1; setTimeout(needs, 60); };",
   "const soon = () => { if(busy) return; busy = 1; queueMicrotask(needs); };   /* 1840: before the screen paints, no gap */"],
  ["\n</body>", "\n<style id=\"s1840\">#kxTotm{display:none!important}</style>\n</body>"]]);
