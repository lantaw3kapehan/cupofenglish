/* 18 Oct · 275 · Management › a teacher's visits (mgmtTeacherVisits) from the database: it is Google's visitsFor_(teacher), the same
   list the teacher's own "My visits" (tMyVisits) has come from the database since 15 Oct (coe › calc tMyVisits as the teacher).
   Google only as a fallback (8 s). */
(function(){
  const base = api, memo = {};
  async function visDb(name){
    const k = String(name || '').trim(), m = memo[k.toLowerCase()]; if(m && Date.now() - m.t < 20000) return m.d;
    const ac = window.AbortController ? new AbortController() : null, tid = ac ? setTimeout(() => ac.abort(), 8000) : 0;
    try{ const r = await fetch(FAST_URL, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ op: 'calc', fn: 'tMyVisits', as: k, args: [], token: TOKEN }), signal: ac ? ac.signal : undefined }).then(x => x.json());
      const d = r && r.ok && r.data; if(!(d && d.ok && Array.isArray(d.visits))) throw new Error('no visits');
      memo[k.toLowerCase()] = { t: Date.now(), d }; return d; }
    finally{ clearTimeout(tid); } }
  api = function(fn, ...args){
    if(fn === 'mgmtTeacherVisits' && typeof D !== 'undefined' && D && D.mgr && TOKEN && args[1]) return visDb(args[1]).catch(() => base(fn, ...args));
    if(/^(mgmtMonitor|tVisitAck)$/.test(fn)) for(const k in memo) delete memo[k];
    return base(fn, ...args); };
})();
