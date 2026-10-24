// 765: (Misty) Ian's Change book (OD1 → OD2) did not show in To do › Celebrate as a "New book": Celebrate reads the book from the student
// row (still "A1, OD1"), and the in-app hint only lasted 30 minutes. Now Celebrate also takes each student's book on their next class
// (coe-notice v6 cel_list "next", from the calendar copy that Change book updates at once): a new levelled book there counts as
// a new book (same series → replaces the old one, e.g. OD1 → OD2).
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const rep = (a, b) => { if (s.split(a).length !== 2) { console.error('not unique: ' + a.slice(0, 90)); process.exit(1); } s = s.replace(a, b); };
rep("call('cel_list').then(j => { CEL = { marks: j.marks || [], books: j.books || {} }; })",
    "call('cel_list').then(j => { CEL = { marks: j.marks || [], books: j.books || {}, next: j.next || {} }; })");
rep("if(s && booksOf(s).indexOf(norm(O[c].b)) < 0) s.book = O[c].multi && s.book ? s.book + ', ' + O[c].b : O[c].b; }); }catch(e){}   /* 655 */",
    "if(s && booksOf(s).indexOf(norm(O[c].b)) < 0) s.book = O[c].multi && s.book ? s.book + ', ' + O[c].b : O[c].b; }); }catch(e){}   /* 655 */\n    try{ const N = (CEL && CEL.next) || {}; if(L) L.forEach(s => { const c = String(s.code || '').toUpperCase(), nb = N[c]; if(!nb) return; const k = norm(String(nb).split(/[,;]/)[0].trim().split(/\\s+/)[0]); if(!k || !bookName(k)) return;\n      const have = booksOf(s); if(have.indexOf(k) > -1) return; const ser = n => bookName(n).replace(/\\s*\\S+$/, ''), sk = ser(k);\n      const parts = String(s.book || '').split(/\\s*,\\s*/).filter(Boolean), i = parts.findIndex(p => { const pn = norm(p.trim().split(/\\s+/)[0]); return bookName(pn) && ser(pn) === sk; });\n      if(i > -1) parts[i] = k; else parts.push(k); s.book = parts.join(', '); }); }catch(e){}   /* 765: the book on the next class */");
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
