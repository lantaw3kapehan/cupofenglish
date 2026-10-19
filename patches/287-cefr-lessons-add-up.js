// 19 Oct · CEFR journey: the lessons under the steps add up to "Lessons taken" (Misty: Lily 34.5 taken, steps showed 5.5 + 1.5).
// The monthly records (S-MONTHLY) start in Jan 2026; lessons taken before a student's first monthly record are counted in the step
// that was running then (the last step that began before the records start). The 2025 monthly tabs list students by first name only
// (no student code, several "Lily"s), so they cannot be matched safely.
require('../tools/lib.js')(process.argv[2], [
  ["x.u = MO.length ? rd(MO.filter(y => y.m >= a && y.m < b).reduce((s, y) => s + U(y), 0)) : null; });",
   "x.u = MO.length ? rd(MO.filter(y => y.m >= a && y.m < b).reduce((s, y) => s + U(y), 0)) : null; });\n" +
   "{ const gap = rd((Number(tot) || 0) - tot0), f0 = MO.map(y => String(y.m)).sort()[0] || '', pre = DT.filter(x => x.d.slice(0, 7) < f0);   /* 19 Oct: lessons before the first monthly record */\n" +
   "  if(gap > 0 && f0 && pre.length && !(S && S.s && S.s.shared)){ const p = pre[pre.length - 1]; p.u = rd((p.u || 0) + gap); } }"],
  ["if(sx && !sx.bk && L.length && (!s0 || fm[L[0]] <= s0.slice(0, 7) || L.length > 1)) sx.bk", "if(sx && !sx.bk && L.length) sx.bk"]   // the first book on record is the start book (the records may begin after the start)
]);
