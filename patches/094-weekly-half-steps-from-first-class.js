// 14 Oct · "Lessons a week" (Misty: Alice 0.8, Abby 0.4 · "0.5 is a half unit, 1 is 1 unit"). Rounded to the nearest 0.5
// (never below 0.5). New students: weeks are counted from their first class (DATABASE › FIRST CLASS, else the trial date),
// not from the 1st of that month, and with under 2 full months of history this month so far is included too.
// Under the number, in plain words: "≈ 2 × 25 min · 每周约2节课" (classes from the same records).
require('../tools/lib.js')(process.argv[2], [
["const L = {}, Lu = {}; MO.forEach(x => { const v = U(x), um = /unmatched/i.test(String(x.t || '')), B = um ? Lu : L; if(v > 0 && /^\\d{4}-\\d{2}$/.test(String(x.m))) B[x.m] = (B[x.m] || 0) + v; }); Object.keys(Lu).forEach(k => { if(!L[k]) L[k] = Lu[k]; });",
 "const L = {}, Lu = {}, N = {}, Nu = {}; MO.forEach(x => { const v = U(x), um = /unmatched/i.test(String(x.t || '')), B = um ? Lu : L, C = um ? Nu : N; if(v > 0 && /^\\d{4}-\\d{2}$/.test(String(x.m))){ B[x.m] = (B[x.m] || 0) + v; C[x.m] = (C[x.m] || 0) + (Number(x.n) || 0); } }); Object.keys(Lu).forEach(k => { if(!L[k]){ L[k] = Lu[k]; N[k] = Nu[k]; } });"],
["past = all.filter(k => k < cur), ks = (past.length ? past : all).slice(-6); if(!ks.length) return null;",
 "past = all.filter(k => k < cur), ks = (past.length >= 2 ? past : all).slice(-6); if(!ks.length) return null;\n" +
 "    const f0 = String(first || (tr && cjDay(tr.date)) || ''), fm = f0.slice(0, 7), fd = +f0.slice(8, 10) || 1;   /* 14 Oct: count from the first class */"],
["const wks = ks.reduce((a, k) => { const p = k.split('-').map(Number); return a + (k === cur ? d0.getDate() : new Date(p[0], p[1], 0).getDate()) / 7; }, 0);",
 "const wks = ks.reduce((a, k) => { const p = k.split('-').map(Number), e = k === cur ? d0.getDate() : new Date(p[0], p[1], 0).getDate(), s = k === fm ? Math.min(fd, e) : 1; return a + Math.max(7, e - s + 1) / 7; }, 0);"],
["const v = Math.round(ks.reduce((a, k) => a + L[k], 0) / wks * 10) / 10; return v > 0 ? { v, n: ks.length } : null;",
 "const raw = ks.reduce((a, k) => a + L[k], 0) / wks, v = raw > 0 ? Math.max(0.5, Math.round(raw * 2) / 2) : 0, cn = ks.reduce((a, k) => a + (N[k] || 0), 0), cw = cn ? Math.max(1, Math.round(cn / wks)) : 0, mins = cn ? Math.round(ks.reduce((a, k) => a + L[k], 0) / cn * 50 / 5) * 5 : 0;\n" +
 "    return v > 0 ? { v, n: ks.length, cw, mins } : null;   /* 0.5 steps: half and whole lessons · plus classes a week in plain words */"],
["J.wk ? 'usual · last ' + J.wk.n + ' month' + (J.wk.n > 1 ? 's' : '') + ' · 近' + J.wk.n + '个月' : 'last 6 weeks · 近6周'",
 "J.wk ? (J.wk.cw && J.wk.mins ? '≈ ' + J.wk.cw + ' × ' + J.wk.mins + ' min · 每周约' + J.wk.cw + '节课' : 'usual · 平时每周') : 'last 6 weeks · 近6周'"],
]);
