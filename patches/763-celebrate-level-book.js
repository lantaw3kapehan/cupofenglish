// 763: (Misty) Ian's Level-up card said "A1 → B1" and "Oxford Discover 1".
// · Level: Ara's progress check (23 Oct, 23/36) gave B1 by the rubric — already flagged "jumps 2 CEFR levels". A level-up card now moves one
//   level at a time (A1 → A2), never skipping a level.
// · Book: the card took the book saved on the student row (OD1); it now takes the book of the student's next class, so a Change book
//   (OD1 → OD2) shows at once.
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const rep = (a, b) => { if (s.split(a).length !== 2) { console.error('not unique: ' + a.slice(0, 90)); process.exit(1); } s = s.replace(a, b); };
rep("if(CEFR.indexOf(lv) > hi){ const k = 'V|' + c + '|' + lv; if(!done[k]) out.push(Object.assign({ kind: 'level', k, from: CEFR[hi], to: lv, book: 'CEFR:' + lv, days: 0 }, base)); }",
    "if(CEFR.indexOf(lv) > hi){ const nx = CEFR[Math.min(CEFR.indexOf(lv), hi + 1)], k = 'V|' + c + '|' + nx; if(!done[k]) out.push(Object.assign({ kind: 'level', k, from: CEFR[hi], to: nx, checked: lv, book: 'CEFR:' + nx, days: 0 }, base)); }   /* 763: one level at a time */");
rep("window.celPic = async function(i){ const x = ITEMS[i]; if(!x) return; toast('Making the picture…');",
    "window.celPic = async function(i){ const x = ITEMS[i]; if(!x) return; toast('Making the picture…');\n    /* 763 · the book of the student's next class (Change book shows at once) */\n    try{ if(x.code && x.kind !== 'bday'){ const L = await api('mgmtStuClasses', TOKEN, x.code), now = Date.now() - 3 * 36e5, ok = (Array.isArray(L) ? L : []).filter(q => q && !q.cancelled && q.book && !/trial/i.test(String(q.title || '')));\n      const nx = ok.filter(q => +new Date(q.start) >= now).sort((a, b) => +new Date(a.start) - +new Date(b.start))[0] || ok.sort((a, b) => +new Date(b.start) - +new Date(a.start))[0];\n      if(nx){ const nm = typeof bookName === 'function' ? bookName(nx.book) : ''; if(nm) x.cur = nm; } } }catch(e){}");
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
