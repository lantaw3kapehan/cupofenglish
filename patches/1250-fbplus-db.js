// 1250: (Misty 26 Oct 22:27 "all should be reading straight from Supabase") The monthly-feedback helper (Google's tFbPlus: class-note
//      Win / Work on tags, last month's goals, this month's plan, my other plans; ~6 s, 35 waits in 48 h) now comes from the database
//      (edge function coe-fbp, built the same way as Google's code, plus tags/plans saved in the app that Google has not copied yet).
//      Nothing changes on screen: the same answer, sooner. Google is still asked quietly once per student a day to check the two agree;
//      if they ever differ, the difference is logged (coe_activity "tFbPlusCheck") and the next open uses Google's answer — nothing redraws.
//      Database not answering, or a student the database cannot match to this teacher → Google, exactly as before.
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const i = s.lastIndexOf('</body>');
s = s.slice(0, i) + String.raw`<script>
/* 1250 · feedback helper (tFbPlus) from the database */
(function(){
  if(window.__1250 || typeof window.api !== 'function') return; window.__1250 = 1;
  const URL_ = 'https://rlxkiahqjsabopmuhern.supabase.co/functions/v1/coe-fbp', TR = 'https://rlxkiahqjsabopmuhern.supabase.co/functions/v1/coe-train';
  const base = window.api, BAD = {};
  const canon = r => { try{ const o = r || {}; return JSON.stringify({ monthKey: o.monthKey, mine: o.mine || [], tags: o.tags || [], review: o.review || [], plan: o.plan || [] }); }catch(e){ return ''; } };
  function check(code, dbr, self, args){ try{
      const k = 'coe.fbpchk.' + code + '.' + new Date().toISOString().slice(0, 10); if(localStorage.getItem(k)) return; localStorage.setItem(k, '1');
      setTimeout(() => { Promise.resolve(base.apply(self, args)).then(g => { if(!g || !g.ok) return;
          if(canon(g) === canon(dbr)) return;
          BAD[code] = 1; try{ store('set', 'coe.fbx.d.' + code, JSON.stringify(g)); }catch(e){}
          const diff = ['monthKey', 'mine', 'tags', 'review', 'plan'].filter(f => JSON.stringify(g[f] || null) !== JSON.stringify(dbr[f] || null)).join(',');
          fetch(TR, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ token: TOKEN, action: 'act', fn: 'tFbPlusCheck', ok: false, detail: code + ' differs: ' + diff }) }).catch(() => {});
        }).catch(() => {}); }, 4000);
    }catch(e){} }
  const w = function(fn){ if(fn !== 'tFbPlus') return base.apply(this, arguments);
    const self = this, args = arguments, code = String(args[2] || '').trim().toUpperCase();
    if(BAD[code] || typeof TOKEN === 'undefined' || !TOKEN) return base.apply(self, args);
    const ac = window.AbortController ? new AbortController() : null, tid = ac ? setTimeout(() => ac.abort(), 4000) : 0;
    return fetch(URL_, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ token: TOKEN, code }), signal: ac ? ac.signal : undefined })
      .then(x => x.json()).finally(() => clearTimeout(tid))
      .then(r => { if(!r || !r.ok || !r.db) throw new Error('fallback'); check(code, r, self, args); return r; })
      .catch(() => base.apply(self, args));   /* database not answering: Google as before */ };
  for(const k in base) try{ w[k] = base[k]; }catch(e){}
  window.api = w;
})();
</script>
` + s.slice(i);
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
