// 2200 (14 Nov): the Timeline opens scrolled to the current time on today (the "now" line about a third from the left),
// so the classes happening now and next are in view without scrolling sideways.
const lib = require("../tools/lib.js"), file = process.argv[2];
lib(file, [["const w = document.createElement('div'); w.className = 'tl97w'; w.innerHTML = html(); list.replaceWith(w);",
 "const w = document.createElement('div'); w.className = 'tl97w'; w.innerHTML = html(); list.replaceWith(w);\n    try{ const sc = w.querySelector('.tl97'), nw = w.querySelector('.t7nw'); if(sc && nw && !w.dataset.s){ w.dataset.s = 1; requestAnimationFrame(() => { const x = nw.getBoundingClientRect().left - sc.getBoundingClientRect().left + sc.scrollLeft; sc.scrollLeft = Math.max(0, x - 160 - (sc.clientWidth - 160) / 3); }); } }catch(e){}"]]);
