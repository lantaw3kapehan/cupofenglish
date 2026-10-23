// 666: (Misty) Course Books button in the student header, in "Send to parent" (next to Lesson summary), with a book icon.
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const rep = (a, b) => { const i = s.indexOf(a); if (i < 0 || s.indexOf(a, i + 1) > -1) { console.error('not unique: ' + a.slice(0, 80)); process.exit(1); } s = s.replace(a, b); };
rep("const row = document.querySelector('#sheetBody .row.noprint'); const b0",
    "const row = document.querySelector('#sheetBody .stu-bar .grp') || document.querySelector('#sheetBody .row.noprint'); const b0");
rep("      if(row) row.insertAdjacentHTML('beforeend', '<button class=\"btn ghost sm\" id=\"bbBtn\"",
    "      if(row) row.insertAdjacentHTML('beforeend', '<button class=\"btn ghost sm\" id=\"bbBtn\" title=\"Covers and Taobao search words for the parent\"");
rep("    return r; };\n  setTimeout(() => { try{ if(mgr()) load(); }catch(e){} }, 3000);",
    "    /* 666: the action bar may be built after this; move the button into Send to parent once it exists */\n    setTimeout(() => { try{ const b = $('bbBtn'), g = document.querySelector('#sheetBody .stu-bar .grp'); if(b && g && b.parentNode !== g){ const pr = [...g.querySelectorAll('.btn')].find(x => /Print/i.test(x.textContent)); g.insertBefore(b, pr || null); } }catch(e){} }, 0);\n    return r; };\n  setTimeout(() => { try{ if(mgr()) load(); }catch(e){} }, 3000);");
rep("[/^Change book/i, 'book'], [/^Teacher \\/ schedule|^Change teacher/i, 'swap']];\n  const TAB",
    "[/^Change book/i, 'book'], [/^Course Books/i, 'book'], [/^Teacher \\/ schedule|^Change teacher/i, 'swap']];\n  const TAB");
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
