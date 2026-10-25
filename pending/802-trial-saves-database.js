// 802: (Misty) "can these be very fast since this is trial … migrate to the database … so it treats instantly"
// · Trials › Mark as sent and Learner type now save in the database (~0.5 s) instead of waiting for Google; Google copies them
//   into the sheet within a minute (server paste SERVER-TRIALQ25: SB_REPLAY + mgmtTrialSent, mgmtTrialGroup). Follow-up was already instant.
// · If the database does not answer, Google is asked as before.
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const i = s.lastIndexOf('</body>'); if (i < 0) { console.error('no body'); process.exit(1); }
s = s.slice(0, i) + String.raw`<script>
/* 802 · trial saves through the database */
(function(){
  if(window.__802 || typeof window.api !== 'function') return; window.__802 = 1;
  const URL_ = 'https://rlxkiahqjsabopmuhern.supabase.co/functions/v1/coe-train';
  const post = b => fetch(URL_, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(Object.assign({ token: TOKEN }, b)) }).then(x => x.json());
  const nowS = () => { const d = new Date(Date.now() + 8 * 3600e3).toISOString(); return d.slice(0, 10) + ' ' + d.slice(11, 16); };
  const ANS = {
    mgmtTrialSent: () => ({ ok: true, queued: true, at: nowS(), by: (D && D.me && D.me.name) || '' }),
    mgmtTrialGroup: () => ({ ok: true, queued: true, remade: true })
  };
  const base = window.api;
  const w = function(fn){ const args = [].slice.call(arguments, 1), self = this, all = arguments;
    if(ANS[fn] && D && D.mgr){ const rid = 'q' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
      return post({ action: 'write', fn, args, rid }).then(r => { if(!r || !r.ok || !r.queued) throw new Error('db'); try{ post({ action: 'devlog', fn, dev: { device: (typeof deviceInfo === 'function' ? deviceInfo() : ''), net: '' } }).catch(() => {}); }catch(e){} return ANS[fn](args); })
        .catch(() => base.apply(self, all)); }
    return base.apply(this, arguments); };
  for(const k in base) try{ w[k] = base[k]; }catch(e){}
  window.api = w;
})();
</script>
` + s.slice(i);
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
