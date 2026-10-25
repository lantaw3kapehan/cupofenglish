// 920 (D2 · Students): the "‹ Back to …" chip on cards (patch 794's back stack).
// Found in this audit (preview, President, 1280):
// · Student page › Edit details showed "‹ Back to Edit student". Tapping it reopened the form's own loading placeholder
//   ("Edit student" + grey bars) which never finishes — the user was stuck on a dead card. Cause: stuForm opens a loading
//   card first, then the real form; 794 stacked the loading card as if it were a real card.
// · Agreement / Renewed · paid showed "‹ Back to Piari 学生240Active": the status chip inside the student title was read
//   as part of the name, with no space.
// Change: the back stack skips cards that are only a loading placeholder (grey .sk bars), so Edit details goes back to
// the student page; the chip label leaves out status chips (.stp). Nothing else about the stack changes.
const fs = require('fs'), file = process.argv[2];
require('../tools/lib.js')(file, [
  ["const h1 = el => { const h = el && el.querySelector('h1'); return h ? String(h.textContent || '').replace(/\\s+/g, ' ').trim().slice(0, 60) : ''; };",
   "const h1 = el => { let h = el && el.querySelector('h1'); if(h && h.querySelector('.stp')){ h = h.cloneNode(true); h.querySelectorAll('.stp').forEach(x => x.remove()); } return h ? String(h.textContent || '').replace(/\\s+/g, ' ').trim().slice(0, 60) : ''; };\n  const isLoading920 = html => { const t = String(html || '').replace(/<button type=\"button\" class=\"sbk\"[^>]*>.*?<\\/button>/, '').replace(/<h1[^>]*>.*?<\\/h1>/, '').replace(/<div class=\"sk\"[^>]*><\\/div>/g, '').trim(); return /<div class=\"sk\"/.test(html) && !t; };"],
  ["else if(prev && prev.t && !/<textarea",
   "else if(prev && prev.t && !isLoading920(prev.html) && !/<textarea"]
]);
