// 655: (Misty) To do › Celebrate: a book change shows as "New book" at once (was: up to ~10 minutes, until the student list copy refreshed).
// After "Change the book" saves, the app keeps the new book for that student on this device for 30 minutes (so an older copy
// cannot hide it again) and redraws To do.
require('../tools/lib.js')(process.argv[2], [
[
"function students(){ const ms = (typeof MS !== 'undefined' && MS) ? (Array.isArray(MS) ? MS : (MS.students || MS.rows || null)) : null; return Array.isArray(ms) && ms.length ? ms : STU_L; }",
"function students(){ const ms = (typeof MS !== 'undefined' && MS) ? (Array.isArray(MS) ? MS : (MS.students || MS.rows || null)) : null, L = Array.isArray(ms) && ms.length ? ms : STU_L;\n    try{ const O = window._celBk || {}; if(L) Object.keys(O).forEach(c => { if(Date.now() - O[c].t > 30 * 6e4) return; const s = L.find(x => String(x.code || '').toUpperCase() === c); if(s && booksOf(s).indexOf(norm(O[c].b)) < 0) s.book = O[c].multi && s.book ? s.book + ', ' + O[c].b : O[c].b; }); }catch(e){}   /* 655 */\n    return L; }"
],
[
"window.celSave = async function(save){ const P = PIC; if(!P) return;",
"window.celBook = (code, b, multi) => { try{ window._celBk = window._celBk || {}; window._celBk[String(code).toUpperCase()] = { b: b, t: Date.now(), multi: !!multi }; students(); paint(); }catch(e){} };   /* 655 */\n  window.celSave = async function(save){ const P = PIC; if(!P) return;"
],
[
"try{ if(STU && STU.code === code && STU.s){ STU.s.book = r.book; stuRender(); } }catch(e){}",
"try{ if(STU && STU.code === code && STU.s){ STU.s.book = r.book; stuRender(); } }catch(e){} try{ window.celBook && celBook(code, r.book); }catch(e){}"
],
[
"try{ if(STU && STU.code === code && STU.s && !window._cbMulti){ STU.s.book = r.book; stuRender(); } }catch(e){}",
"try{ if(STU && STU.code === code && STU.s && !window._cbMulti){ STU.s.book = r.book; stuRender(); } }catch(e){} try{ window.celBook && celBook(code, r.book, !!window._cbMulti); }catch(e){}"
]
]);
