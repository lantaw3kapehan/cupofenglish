// 2398 (Misty 19 Nov 11:02, Monica: the teacher recommended Oxford Discover 1 but the teen roadmap said KET) · when the teacher's
//   recommended book is Oxford Discover, the roadmap and the suggested-plan line follow Oxford Discover from that book, so the
//   starting point and the roadmap agree. The teen "How progress works" stays.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["if(F.rec && !b && p.length && window.BK2311 && BK2311[k]){ const x = BK2311[k], q = p.slice(); q[5] = x[0] + ' — ' + x[2]; q[6] = x[1] + '——' + x[3]; return q; }",
   "if(F.rec && !b && p.length && window.BK2311 && BK2311[k]){ const x = BK2311[k], q = p.slice(); q[5] = x[0] + ' — ' + x[2]; q[6] = x[1] + '——' + x[3];\n" +
   "        const od = k.match(/^od(\\d)$/); if(od && !new RegExp('◆\\\\s*Oxford Discover ' + od[1]).test(String(q[7] || ''))){ const n = +od[1];   /* 2398 */\n" +
   "          const E = n <= 2 ? ['Oxford Discover 1', 'Oxford Discover 2', 'Reading Explorer Foundation', 'Reading Explorer 1–3', 'IELTS'].slice(n - 1) : ['Oxford Discover ' + n, 'Reading Explorer 1–3', 'IELTS'];\n" +
   "          const Z = n <= 2 ? ['《牛津探索》1', '《牛津探索》2', '《阅读探索》基础级', '《阅读探索》1–3级', '雅思'].slice(n - 1) : ['《牛津探索》' + n, '《阅读探索》1–3级', '雅思'];\n" +
   "          q[7] = '◆ ' + E.join(' → '); q[8] = '◆ ' + Z.join(' → ');\n" +
   "          if(/KET/.test(String(q[19] || ''))){ const g = path(F.cefr, '') || []; if(g[19] && !/KET/.test(String(g[19]))){ q[19] = g[19]; q[20] = g[20]; } else { q[19] = String(q[19]).replace(/about the length of the KET foundation stage \\(CEFR A1 → A2\\)/, 'about what most learners need to reach the next Oxford Discover level'); q[20] = String(q[20] || '').replace(/与KET基础阶段（CEFR A1 → A2）所需课时相当/, '大多数学生通常可在此课时内升入下一级《牛津探索》'); } } }\n" +
   "        return q; }"]
]);
