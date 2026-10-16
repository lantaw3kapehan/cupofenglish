// 16 Oct · The validity notice in a page heading only when that page is the same student's (it showed the last opened
// student's notice on a trial student's page — Rex showed Gina's).
require('../tools/lib.js')(process.argv[2], [
["if(h && v && !h.querySelector('.vn')) h.insertAdjacentHTML('beforeend', chip(v)); }", "const mine = sp.textContent.slice(0, 800).toUpperCase().indexOf(String(STU.code).toUpperCase()) > -1 && !/trial \\d{4}-\\d{2}-\\d{2}/i.test(sp.textContent.slice(0, 800));\n      sp.querySelectorAll('h1 .vn').forEach(x => { if(!mine || !v) x.remove(); });\n      if(h && v && mine && !h.querySelector('.vn')) h.insertAdjacentHTML('beforeend', chip(v)); }"],
]);
