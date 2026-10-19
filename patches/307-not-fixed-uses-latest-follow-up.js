// 19 Oct · 307 · "Not fixed" warnings: the LATEST follow-up on a point decides (Misty saw Mayi warned for the camera and the red pen,
// though Celine's later visits marked both Improved — 13 Oct 19:00/20:30 and 17 Oct). A point is "not fixed" only if its newest follow-up is Not yet or Partly.
require('../tools/lib.js')(process.argv[2], [
  ["    let repeat = 0; const since = Date.now() - 30 * DAY, fu = {};",
   "    let repeat = 0; const since = Date.now() - 30 * DAY, fu = {}, last = {};\n    V.forEach(v => { const m = String(v.note || '').match(/Follow-up on (\\S+)\\s*\\(([\\s\\S]*?)\\):\\s*(Improved|Not yet|Partly)\\b/); if(m){ const k = norm(m[2]); if(!last[k]) last[k] = m[3]; } });   /* V is newest first */"],
  ["      const k = norm(m[2]); if(fu[k]) return; fu[k] = 1; const w = m[3] === 'Not yet' ? 1 : 0.5; repeat += w;",
   "      const k = norm(m[2]); if(fu[k] || last[k] === 'Improved') return; fu[k] = 1; const w = m[3] === 'Not yet' ? 1 : 0.5; repeat += w;"]]);
