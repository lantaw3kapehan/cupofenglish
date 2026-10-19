// 19 Oct · 314 · "My class videos" made compact and steady (Misty: many lessons crowd it; it flickered):
// one line per day ("Yesterday · Sun 18 Oct · 11 of 12 found"), only the missing ones spelled out in red, the found ones as small green name chips
// (tap to open the video), folded away unless asked. The card is only redrawn when something changed, so it no longer flickers.
const fs = require('fs'), path = require('path'), file = process.argv[2], s = fs.readFileSync(file, 'utf8');
const a = s.indexOf("  function paint(){ const root = document.getElementById('v-today'); if(!root || !V"), b = s.indexOf("  const _rt = window.renderToday;", a);
if(a < 0 || b < a) { console.error('309 paint not found'); process.exit(1); }
require('../tools/lib.js')(file, [[s.slice(a, b), fs.readFileSync(path.join(__dirname, '314-class-videos-compact.paint.txt'), 'utf8')]]);
