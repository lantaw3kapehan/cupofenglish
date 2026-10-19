// 19 Oct · CEFR journey: each move to a new book shows as a step ("教材升级 Book up · OD2", month, lessons in that book),
// on the student page, the picture for parents and the copied message — facts to show a parent or partner that the child is moving on.
// Months come from the -DAILY tabs (S-MONTHLY: first month a book was taught); a book already shown as the start or a level-up is not repeated.
require('../tools/lib.js')(process.argv[2], [
  ["T.forEach(x => { const b = String(x.bk || '').trim().split(/[\\s,]+/)[0].toUpperCase(); if(/^Level/.test(x.en) && !x.d && b && fm[b]) x.d = fm[b] + '-01'; }); }",
   "T.forEach(x => { const b = String(x.bk || '').trim().split(/[\\s,]+/)[0].toUpperCase(); if(/^Level/.test(x.en) && !x.d && b && fm[b]) x.d = fm[b] + '-01'; });\n" +
   "  { const have = {}, nm0 = {}; MO.forEach(x => { const c = String(x.c || '').trim().split(/\\s+/)[0]; if(c) nm0[c.toUpperCase()] = nm0[c.toUpperCase()] || c; });\n" +
   "    const sx = T.find(x => x.start), s0 = String((sx || {}).d || ''), L = Object.keys(fm).filter(b => b && !/^(OTHER|FREETALK|FREE|TRIAL|TC|SC|SUB|\\(UNMATCHED\\))$/.test(b)).sort((a, b) => fm[a].localeCompare(fm[b]));\n" +
   "    if(sx && !sx.bk && L.length && (!s0 || fm[L[0]] <= s0.slice(0, 7) || L.length > 1)) sx.bk = nm0[L[0]] || L[0];   /* the first book they had with us */\n" +
   "    T.forEach(x => { const b = String(x.bk || '').trim().split(/[\\s,]+/)[0].toUpperCase(); if(b) have[b] = 1; });\n" +
   "    L.forEach((b, k) => { if(have[b]) return; if(k === 0 && (!s0 || fm[b] <= s0.slice(0, 7))) return; if(s0 && fm[b] < s0.slice(0, 7)) return; const d = fm[b] + '-01', at = T.filter(x => x.d && x.d <= d && !/^Trial/.test(x.en)).sort((p, q) => p.d.localeCompare(q.d)).pop();\n" +
   "      T.push({ d, i: at ? at.i : (chain.length ? chain[chain.length - 1] : T[0].i), en: 'Book up', zh: '教材升级', bk: nm0[b] || b }); }); } }   /* 19 Oct: each new book is a step up (Misty) */"],
  ["const ev = x => (x.start ? '入学 Start' : /^Trial/.test(x.en) ? '试听 Trial' : /^Renew/.test(x.en) ? '续费 Renewed' : /^Level/.test(x.en) ? '升级 Up'",
   "const ev = x => (x.start ? '入学 Start' : /^Trial/.test(x.en) ? '试听 Trial' : /^Renew/.test(x.en) ? '续费 Renewed' : /^Book/.test(x.en) ? '教材升级 Book up' : /^Level/.test(x.en) ? '升级 Up'"],
  ["/^Level/.test(x.en) ? 'Up 升级' : 'Check 测评'",
   "/^Book/.test(x.en) ? 'Book up 教材升级 · ' + esc(x.bk || '') : /^Level/.test(x.en) ? 'Up 升级' : 'Check 测评'"],
  ["/^Trial/.test(x.en) ? '试听 Trial' : /^Level/.test(x.en) ? '升级 Up' : '测评 Check'",
   "/^Trial/.test(x.en) ? '试听 Trial' : /^Book/.test(x.en) ? '教材升级 Book up' : /^Level/.test(x.en) ? '升级 Up' : '测评 Check'"],
  ["window._CJ = { T, now, nxt, up, nowK,",
   "window._CJ = { T, now, nxt, up, nowK, bu: T.filter(x => /^Book/.test(x.en)).length, books: T.filter(x => x.bk && x.d && !/^Trial/.test(x.en)).sort((a, b) => a.d.localeCompare(b.d)).map(x => ({ b: x.bk, d: x.d })),"],
  ["J.up > 0 ? 'Up ' + J.up + ' level step' + (J.up === 1 ? '' : 's') + (J.since ? ' since ' + J.since : '') + ' · 进步 ' + J.up + ' 个级别' : 'Next goal · 下一阶段目标：CEFR ' + CJ_L[J.nxt] + '（' + zh(J.nxt) + '）'",
   "J.up > 0 ? 'Up ' + J.up + ' level step' + (J.up === 1 ? '' : 's') + (J.since ? ' since ' + J.since : '') + ' · 进步 ' + J.up + ' 个级别' : J.bu > 0 ? J.bu + ' new book' + (J.bu === 1 ? '' : 's') + (J.since ? ' since ' + J.since : '') + ' · 教材升级 ' + J.bu + ' 次 · Next 目标 ' + CJ_L[J.nxt] : 'Next goal · 下一阶段目标：CEFR ' + CJ_L[J.nxt] + '（' + zh(J.nxt) + '）'"],
  ["。下一阶段的学习目标为 CEFR ' + CJ_L[J.nxt]",
   "。' + ((J.books || []).length > 1 ? '学习教材进阶：' + J.books.filter((x, i, A) => A.findIndex(y => y.b === x.b) === i).map(x => x.b + '（' + x.d.slice(0, 4) + '年' + (+x.d.slice(5, 7)) + '月）').join(' → ') + '。' : '') + '下一阶段的学习目标为 CEFR ' + CJ_L[J.nxt]"]
]);
