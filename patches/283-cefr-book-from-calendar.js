// 19 Oct · CEFR journey: a book change made in the calendar (Change book) shows at once as a step, dated from the first class in
// the new book (Misty: Lily changed to OD2, not shown yet — the monthly records only have books already taught). The section is
// drawn again when the student's class list arrives.
require('../tools/lib.js')(process.argv[2], [
  ["T.push({ d, i: at ? at.i : (chain.length ? chain[chain.length - 1] : T[0].i), en: 'Book up', zh: '教材升级', bk: nm0[b] || b }); }); } }   /* 19 Oct: each new book is a step up (Misty) */",
   "T.push({ d, i: at ? at.i : (chain.length ? chain[chain.length - 1] : T[0].i), en: 'Book up', zh: '教材升级', bk: nm0[b] || b }); });\n" +
   "    { const C0 = (S && (S.cls || (window.CLSM && S.code && CLSM[S.code]))) || [], cf = {};   /* 19 Oct: the new book already in the calendar (from its first class) */\n" +
   "      (Array.isArray(C0) ? C0 : []).forEach(e => { if(!e || e.cancelled || !e.book || !e.start || /-TC$/i.test(String(e.title || '').replace(/\\s+X$/i, ''))) return; const b = String(e.book).trim().split(/[\\s,]+/)[0], B = b.toUpperCase(), d = cjDay(e.start); if(B && d && (!cf[B] || d < cf[B].d)) cf[B] = { b, d }; });\n" +
   "      Object.keys(cf).forEach(B => { if(have[B] || fm[B] || /^(OTHER|FREETALK|FREE|TRIAL|TC|SC|SUB)$/.test(B)) return; have[B] = 1; const d = cf[B].d; if(s0 && d < s0) return; const at = T.filter(x => x.d && x.d <= d && !/^Trial/.test(x.en)).sort((p, q) => p.d.localeCompare(q.d)).pop();\n" +
   "        T.push({ d, i: at ? at.i : (chain.length ? chain[chain.length - 1] : T[0].i), en: 'Book up', zh: '教材升级', bk: cf[B].b, cal: 1 }); }); } } }   /* 19 Oct: each new book is a step up (Misty) */"]
]);
