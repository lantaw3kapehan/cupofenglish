// 1690: (Misty, 1 Nov 15:35, time-in as Teacher Misty) "this is way too slow" · the time-in picture stayed on "Making the picture…".
//   html2canvas copies the whole page into a hidden frame before drawing (19,000 elements here), so each picture took ~3.3 s on a
//   fast laptop, more on a teacher's. Now the copy leaves out everything in the page body except the card being drawn and the
//   boxes around it (the styles in <head> are kept), so the picture is the same pixel for pixel and takes ~0.6 s.
//   Applies to every picture made with html2canvas (time-in, notices, lesson pictures…); a caller's own ignoreElements still applies.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["H2C = new Promise((ok, no) => { const s = document.createElement('script'); s.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js'; s.onload = () => ok(window.html2canvas);",
   "H2C = new Promise((ok, no) => { const s = document.createElement('script'); s.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js'; s.onload = () => ok(h2cFast1690());"],
  ["function h2c(){ if(window.html2canvas) return Promise.resolve(window.html2canvas); if(H2C) return H2C;",
   "/* 1690 · html2canvas copies only the element being drawn (and the boxes around it), not the whole page: ~5× faster, same picture */\n" +
   "function h2cFast1690(){ const f = window.html2canvas; if(!f || f.__fast1690) return f;\n" +
   "  const w = function(el, o){ o = Object.assign({}, o || {}); const own = o.ignoreElements, H = document.head, B = document.body, R = document.documentElement;\n" +
   "    o.ignoreElements = n => { try{ if(own && own(n)) return true; if(!el || !el.contains || n === B || n === H || n === R || H.contains(n) || el.contains(n) || n.contains(el)) return false; return B.contains(n); }catch(e){ return false; } };\n" +
   "    return f.call(this, el, o); };\n" +
   "  w.__fast1690 = 1; window.html2canvas = w; return w; }\n" +
   "function h2c(){ if(window.html2canvas) return Promise.resolve(h2cFast1690()); if(H2C) return H2C;"]
]);
