// 2232 (audit): Meeting ID missing › "Reminded ✓" was kept per device, so Operations' laptop still offered "Remind all teachers (11)"
// after the President had reminded all 11 (they would have been messaged twice). The reminded teachers now come from the database
// (coe-cal meetReminded: today's in-app reminders by anyone) and are merged in when To do opens; this device's own sends still show at once.
const lib = require("../tools/lib.js"), file = process.argv[2];
lib(file, [["  const got = () => { try{ return JSON.parse(localStorage.getItem(K) || '{}') || {}; }catch(e){ return {}; } };",
 `  let SRV = {}, srvAt = 0;
  const got = () => { let o = {}; try{ o = JSON.parse(localStorage.getItem(K) || '{}') || {}; }catch(e){} return Object.assign({}, SRV, o); };
  function srv(){ if(Date.now() - srvAt < 60e3 || typeof TOKEN === 'undefined' || !TOKEN) return; srvAt = Date.now();
    fetch('https://rlxkiahqjsabopmuhern.supabase.co/functions/v1/coe-cal', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ token: TOKEN, action: 'meetReminded' }) })
      .then(r => r.json()).then(r => { if(!r || !r.ok || !r.by) return; const ch = JSON.stringify(r.by) !== JSON.stringify(SRV); SRV = r.by; if(!ch) return;
        document.querySelectorAll('.mt14 .rw').forEach(rw => { const t = rw.dataset.t, b = rw.querySelector('.rm'); if(t && b && !b.classList.contains('ok') && SRV[t.toLowerCase()]) b.outerHTML = window.mt2225Btn(t); });
        const ra = document.querySelector('.mt14 .ra'); if(ra){ const g = got(), T = [...new Set([...document.querySelectorAll('.mt14 .rw')].map(x => x.dataset.t).filter(Boolean))], left = T.filter(t => !g[t.toLowerCase()]); ra.disabled = !left.length; ra.textContent = left.length ? 'Remind all teachers (' + left.length + ')' : 'All teachers reminded ✓'; } }).catch(() => { srvAt = 0; }); }
  setInterval(() => { if(document.querySelector('.mt14')) srv(); }, 5000);`]]);
