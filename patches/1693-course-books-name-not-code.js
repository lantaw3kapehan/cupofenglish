// 1693: (Misty, 1 Nov 21:53, Course Books picture "For ST-2026-127") "Why Vita's name does not show here, is it because we just
//   updated her name?" · Vita (ST-2026-127) was renamed from Zoe at 21:25 and enrolled at 21:32; the new ACTIVE row was still
//   waiting for Google, so the package sheet's row had the student code where the name goes (and no Chinese name), and the
//   picture said "For ST-2026-127". Now when the name given to the Course Books picture is a student code (or blank Chinese),
//   the app looks the student up (student page, student list, ACTIVE) and uses the current English + Chinese name.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["  /* 758 · the book at the moment you tap: the student's next class (else the latest), else the saved book */",
   "  /* 1693 · the Course Books picture never says \"For ST-…\": a code given as the name is replaced by the student's current name */\n" +
   "  { const _bo1693 = window.bbOpen; if(_bo1693) window.bbOpen = function(book, en, cn){ try{ const c = String(en || '').trim().toUpperCase();\n" +
   "      if(/^ST-\\d{4}-\\d{3}$/.test(c)){ const L = [].concat((typeof STU !== 'undefined' && STU && STU.s && String(STU.code || '').toUpperCase() === c) ? [STU.s] : [], (typeof MS !== 'undefined' && Array.isArray(MS)) ? MS : [], (typeof SL !== 'undefined' && SL && Array.isArray(SL.students)) ? SL.students : []);\n" +
   "        let s = L.find(x => x && String(x.code || '').toUpperCase() === c && x.name && !/^ST-\\d{4}-\\d{3}$/i.test(String(x.name).trim()));\n" +
   "        if(!s && typeof AT !== 'undefined' && AT && AT.cols){ const C = {}; AT.cols.forEach((k, i) => C[k] = i); const r = (AT.rows || []).find(x => String(x[C.code] || '').toUpperCase() === c && x[C.name] && !/^ST-\\d{4}-\\d{3}$/i.test(String(x[C.name]).trim())); if(r) s = { name: r[C.name], cn: r[C.cn] }; }\n" +
   "        if(s){ en = String(s.name).trim(); cn = String(cn || s.cn || s.chinese || '').trim(); } } }catch(e){}\n" +
   "    return _bo1693.call(this, book, en, cn); }; }\n" +
   "  /* 758 · the book at the moment you tap: the student's next class (else the latest), else the saved book */"]
]);
