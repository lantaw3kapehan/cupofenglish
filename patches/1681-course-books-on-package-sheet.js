// 1681: (Misty, 31 Oct 23:13, Lucy's package sheet after enrolling, opened from her trial) "It's showing this" — the package
//   sheet (Active · Lessons left to send) had no way to the Course Books picture. Now it has "Course books for the parent" under
//   Lessons left, for the package's course (ACTIVE COURSE) or else the student's book. A package bought in the last 30 days that is
//   the student's only package opens the picture with the New student message; otherwise the message is chosen as in 1680.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["const kind1680 = () => { const code = last1680 && last1680.code; if(Date.now() - ctx1680.t < 60000) return 'book';",
   "const kind1680 = () => { const code = last1680 && last1680.code; if(Date.now() - ctx1680.t < 60000) return 'book'; if(window._bbKind1681 && Date.now() - window._bbKind1681.t < 30000) return window._bbKind1681.k;"],
  ["  window.swMine1676 = ",
   "  /* 1681 · Course books from the package sheet */\n" +
   "  try{ window.bk1681 = row => { try{ const C = {}; AT.cols.forEach((c, i) => C[c] = i); const r = AT.rows.find(x => x[0] === row); if(!r || !window.bbOpen) return;\n" +
   "      const code = String(r[C.code] || '').toUpperCase(), s = ((typeof MS !== 'undefined' && MS) || []).find(x => String(x.code).toUpperCase() === code) || {};\n" +
   "      let book = C.course != null ? String(r[C.course] || '').trim() : ''; if(!book) book = String(s.book || '').trim(); if(!book) return toast('No book on this package yet · use Change book');\n" +
   "      book = window.bbPick ? bbPick(book) : book.split(/\\s*,\\s*/)[0];\n" +
   "      const mine = AT.rows.filter(x => String(x[C.code] || '').toUpperCase() === code && x[C.enrolled] !== ''), st = Date.parse(String(r[C.start] || '').slice(0, 10) + 'T12:00:00');\n" +
   "      window._bbKind1681 = mine.length <= 1 && st && Date.now() - st < 30 * 864e5 ? { k: 'new', t: Date.now() } : null;\n" +
   "      bbOpen(book, String(r[C.name] || s.name || ''), String(r[C.cn] || s.cn || '')); }catch(e){ toast('Could not open the books'); } };\n" +
   "    const _ar1681 = window.activeRow; if(_ar1681) window.activeRow = function(row){ const res = _ar1681.apply(this, arguments);\n" +
   "      try{ if(D && D.mgr && window.bbOpen && !$('bk1681')){ const b = Array.from(document.querySelectorAll('#sheetBody button')).find(x => /Lessons left to send/.test(x.textContent));\n" +
   "        const h = '<button id=\"bk1681\" class=\"btn ghost block\" style=\"margin-top:8px\" onclick=\"bk1681(' + (+row) + ')\">📚 Course books for the parent · what to buy</button>';\n" +
   "        if(b) b.insertAdjacentHTML('afterend', h); } }catch(e){} return res; }; }catch(e){}\n" +
   "  window.swMine1676 = "]
]);
