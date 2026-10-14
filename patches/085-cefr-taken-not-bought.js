// 14 Oct · CEFR journey (Misty, Alice ST-2026-102): DATABASE › ENROLLMENT › TOTAL is all lessons BOUGHT (Alice 15, 10.5 left),
// so "lessons with us" was too high. Lessons taken = TOTAL − lessons left (Gaby 200 − 31 = 169); the app's own -DAILY count
// is used when that is higher or when lessons left is unknown. Books with a teacher after them ("TheAlphabet Resa") count as one book.
require('../tools/lib.js')(process.argv[2], [
["tot = (S && S.s && S.s.shared) ? tot0 : Math.max(tot0, Number(String(col(/ENROLLMENT\\s*·\\s*TOTAL/i) || '').replace(/[^\\d.]/g, '')) || 0);",
 "tot = (S && S.s && S.s.shared) ? tot0 : (() => { const bought = Number(String(col(/ENROLLMENT\\s*·\\s*TOTAL/i) || '').replace(/[^\\d.]/g, '')) || 0, left = S && S.s && S.s.left != null && S.s.left !== '' ? Number(S.s.left) : NaN; return bought && !isNaN(left) ? Math.max(tot0, rd(bought - left)) : tot0; })();   /* 14 Oct: bought − left */"],
["const BK = {}; MO.forEach(x => { const c = String(x.c || '').trim() || 'Other';",
 "const BK = {}; MO.forEach(x => { const c = String(x.c || '').trim().split(/\\s+/)[0] || 'Other';"],
]);
