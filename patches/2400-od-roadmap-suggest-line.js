// 2400 (Misty 19 Nov 11:18, Monica): the English "Suggested" line still said KET · it is field 18 (English) / 19 (Chinese), not 19 / 20.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["if(/KET/.test(String(q[19] || ''))){ const g = path(F.cefr, '') || []; if(g[19] && !/KET/.test(String(g[19]))){ q[19] = g[19]; q[20] = g[20]; } else { q[19] = String(q[19]).replace(",
   "if(/KET/.test(String(q[18] || ''))){ const g = path(F.cefr, '') || []; if(g[18] && !/KET/.test(String(g[18]))){ q[18] = g[18]; q[19] = g[19]; } else { q[18] = String(q[18]).replace("],
  ["'about what most learners need to reach the next Oxford Discover level'); q[20] = String(q[20] || '')",
   "'about what most learners need to reach the next Oxford Discover level'); q[19] = String(q[19] || '')"],
  ["(t.commZh ? 1 : 0) + '|' + (extra || '') + '|v8';", "(t.commZh ? 1 : 0) + '|' + (extra || '') + '|v9';"]
]);
