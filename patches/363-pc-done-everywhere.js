// 20 Oct · A progress check already sent (PR-DATA, seen in the teacher's student list as lastCheck) leaves "Management is waiting for…" on every device
// and in management's teacher view (Julia: Amy, Ellery, Ethel sent 15 Oct, still listed 20 Oct — the "done" mark was only kept on the phone that sent them).
require('../tools/lib.js')(process.argv[2], [
  ["TMSG.threads.forEach(t => { const code = pcCode(t); if(!code || seen[code]) return; seen[code] = 1; if(window.PCDONE && PCDONE[code]) return;",
   "TMSG.threads.forEach(t => { const code = pcCode(t); if(!code || seen[code]) return; seen[code] = 1; if(window.PCDONE && PCDONE[code]) return;\n" +
   "  try{ const st = (D.students || []).concat(D.moved || []).find(s => s.code === code), lc = st && st.lastCheck; if(lc && String(lc).slice(0, 10) >= String(t.root.at || '').slice(0, 10)) return; }catch(e){}   /* 363: sent on or after the request */"]
]);
