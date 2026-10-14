// 14 Oct · CEFR picture (Misty, Arvin ST-2025-105): "Lessons a week · 每周平均" was missing. It only counted the last 6 weeks of
// calendar classes, so a child with recent cancellations (or a picture made before the schedule loaded) got 0 and no card.
// Now it comes from their history: the child's own lessons in the -DAILY records over the last (up to) 6 months that had
// classes, divided by the weeks in those months. The current month is left out (it is not over yet) unless it is the only one.
// '(Unmatched)' rows repeat the teacher rows, so they only count for a month with nothing else. Falls back to the old
// 6-week count when there is no history.
require('../tools/lib.js')(process.argv[2], [
["who: { student: (S.s && S.s.name) || '', cn: (S.s && S.s.cn) || '', code: S.code } };",
 "who: { student: (S.s && S.s.name) || '', cn: (S.s && S.s.cn) || '', code: S.code },\n" +
 "  wk: (() => { try{ const L = {}, Lu = {}; MO.forEach(x => { const v = U(x), um = /unmatched/i.test(String(x.t || '')), B = um ? Lu : L; if(v > 0 && /^\\d{4}-\\d{2}$/.test(String(x.m))) B[x.m] = (B[x.m] || 0) + v; }); Object.keys(Lu).forEach(k => { if(!L[k]) L[k] = Lu[k]; });   /* '(Unmatched)' repeats the teacher rows: used only for a month with nothing else */ const d0 = new Date(), cur = d0.getFullYear() + '-' + ('0' + (d0.getMonth() + 1)).slice(-2), all = Object.keys(L).sort(), past = all.filter(k => k < cur), ks = (past.length ? past : all).slice(-6); if(!ks.length) return null;\n" +
 "    const wks = ks.reduce((a, k) => { const p = k.split('-').map(Number); return a + (k === cur ? d0.getDate() : new Date(p[0], p[1], 0).getDate()) / 7; }, 0);\n" +
 "    const v = Math.round(ks.reduce((a, k) => a + L[k], 0) / wks * 10) / 10; return v > 0 ? { v, n: ks.length } : null; }catch(e){ return null; } })() };   /* 14 Oct: lessons a week from their history */"],
["const wk = A.length ? Math.round(A.reduce((s, e) => s + Math.max(0.5, (new Date(e.end || e.start) - new Date(e.start)) / 3e6 || 1), 0) / 6 * 2) / 2 : null;",
 "const wk = J.wk ? J.wk.v : (A.length ? Math.round(A.reduce((s, e) => s + Math.max(0.5, (new Date(e.end || e.start) - new Date(e.start)) / 3e6 || 1), 0) / 6 * 2) / 2 : null);"],
["wk ? [wk, '每周平均 · Lessons a week', 'last 6 weeks · 近6周'] : null",
 "wk ? [wk, '每周平均 · Lessons a week', J.wk ? 'usual · last ' + J.wk.n + ' month' + (J.wk.n > 1 ? 's' : '') + ' · 近' + J.wk.n + '个月' : 'last 6 weeks · 近6周'] : null"],
]);
