// 19 Oct · 312 · The Excellence corner in the side menu, redrawn (Misty: "make it a perfect visual"):
// a medal in the level's colour with the score inside, the level in big type, "October so far", a place chip (🥇🥈🥉 for the top 3),
// a bar showing how far she is through her level towards the next one ("Silver ──── Gold 88", "5.5 points to Gold"),
// the small months line, "Live · 14:10" at the top, and "See my month ›". Same data; tap still opens My growth.
const fs = require('fs'), path = require('path'), file = process.argv[2], s = fs.readFileSync(file, 'utf8');
const a = s.indexOf('    const html = `<div style="font-size:10px;letter-spacing:'), b = s.indexOf("    if(!box){ box = document.createElement('div'); box.id = 'kxSide';");
if(a < 0 || b < a) { console.error('side html not found'); process.exit(1); }
const nw = fs.readFileSync(path.join(__dirname, '312-excellence-corner.html.txt'), 'utf8');
require('../tools/lib.js')(file, [[s.slice(a, b), nw],
  ["box.style.cssText = 'margin:16px 4px 8px;padding:12px 12px 10px;border:1px solid var(--line);border-radius:16px;background:linear-gradient(180deg,#fbfaf7,#fff);cursor:pointer';",
   "box.style.cssText = 'margin:16px 4px 8px;padding:14px 14px 12px;border:1px solid var(--line);border-radius:18px;background:linear-gradient(180deg,#fdfcf9,#fff);box-shadow:0 4px 14px rgba(43,34,83,.06);cursor:pointer;transition:box-shadow .15s';"]]);
