// 1916: (Misty 8 Nov 16:35 — Julia: "feedback she has done but not appearing")
//   Since 1853 monthly feedback is saved straight to the database. The Students list still took "done" from Google's tFbStatus,
//   which doesn't see those saves (Julia: database 28 done, Google's list 18). Now the app lays the database's own record
//   (docs sys:fbs via coe-fbs) over Google's list every time it loads, so a written feedback shows ✓ at once.
const lib = require('../tools/lib.js'), file = process.argv[2];
lib(file, [
  ["async function fbLoad(force){",
   "async function fbDbMerge(){ try{ if(!FB || !Array.isArray(FB.students) || !TOKEN) return;   /* 1916: the database's done / fix list wins */\n" +
   "  const r = await fetch(FAST_URL + '-fbs', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ token: TOKEN }) }).then(x => x.json());\n" +
   "  if(!r || !r.ok || (r.month && FB.month && r.month !== FB.month)) return; const dn = r.done || {}, fx = r.fix || {};\n" +
   "  FB.students.forEach(s => { const c = String(s.code || '').toUpperCase(); if(dn[c] && (!s.done || (+dn[c].ts || 0) > (+s.done.ts || 0))) s.done = dn[c]; if(fx[c]) s.fix = fx[c]; else if(dn[c] && s.fix) s.fix = null; });\n" +
   "  FB.done = FB.students.filter(s => s.done).length; FB.fix = FB.students.filter(s => s.fix).length; }catch(e){} }\n" +
   "async function fbLoad(force){"],
  ["try{ FB = await api('tFbStatus', TOKEN); store('set','coe.fb', JSON.stringify(FB));",
   "try{ FB = await api('tFbStatus', TOKEN); await fbDbMerge(); store('set','coe.fb', JSON.stringify(FB));"],
]);
