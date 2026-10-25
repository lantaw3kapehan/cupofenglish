// 795: (Misty, server paste SERVER-MOVE25 deployed 10:56) more through the database:
// · WeChat reminder log (teachers + Ops), video explanation, "Not my student" → saved in the database queue (~0.5 s); Google copies them within a minute.
// · "Class videos still missing", my video checks and management's video checks → from the database (Google copies them every 5 min);
//   if the database copy is older than 30 min, Google answers as before.
// (Management time-out goes through the queue too: patch 790.)
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const i = s.lastIndexOf('</body>'); if (i < 0) { console.error('no body'); process.exit(1); }
s = s.slice(0, i) + String.raw`<script>
/* 795 · more saves and the video lists through the database */
(function(){
  if(window.__795 || typeof window.api !== 'function') return; window.__795 = 1;
  const URL_ = 'https://rlxkiahqjsabopmuhern.supabase.co/functions/v1/coe-train';
  const post = b => fetch(URL_, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(Object.assign({ token: TOKEN }, b)) }).then(x => x.json());
  const dev = () => { let d = ''; try{ d = deviceInfo(); }catch(e){} return { device: d, net: '' }; };
  const ANS = {
    tRemindLog: () => ({ ok: true, queued: true, rem: (typeof REM !== 'undefined' && REM.map) || {} }),
    mgmtRemindLog: () => ({ ok: true, queued: true, rem: (typeof REM !== 'undefined' && REM.map) || {} }),
    tVidExplain: () => ({ ok: true, queued: true }),
    tNotMine: a => ({ ok: true, queued: true, student: String(a[1] || ''), note: 'Sent to Ops' })
  };
  const base = window.api, bn0 = window.apiNow;
  const w = function(fn){ const args = [].slice.call(arguments, 1), self = this, all = arguments;
    if(ANS[fn]){
      const rid = 'q' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
      return post({ action: 'write', fn, args, rid }).then(r => { if(!r || !r.ok || !r.queued) throw new Error('db');
          try{ post({ action: 'devlog', fn, dev: dev() }).catch(() => {}); }catch(e){} return ANS[fn](args); })
        .catch(() => fn === 'tVidExplain' && typeof bn0 === 'function' ? bn0.apply(self, all) : base.apply(self, all));   /* database not answering: Google as before */ }
    if(fn === 'tVidList' || fn === 'tVidFlags' || fn === 'mgmtVidFlags'){
      return post({ action: fn === 'tVidList' ? 'vidlist' : 'vidflags', all: fn === 'mgmtVidFlags' }).then(r => { if(!r || !r.ok) throw new Error('fallback'); return { ok: true, list: r.list || [] }; })
        .catch(() => base.apply(self, all)); }
    return base.apply(this, arguments); };
  for(const k in base) try{ w[k] = base[k]; }catch(e){}
  window.api = w;
  const bn = window.apiNow; if(typeof bn === 'function') window.apiNow = function(fn){ if(fn === 'tVidExplain') return w.apply(this, arguments); return bn.apply(this, arguments); };
})();
</script>
` + s.slice(i);
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
