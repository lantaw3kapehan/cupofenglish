/* 17 Oct · 269 · Overview from the database (coe-mgmt › overview = coe_overview_live: teachers, payroll, today's team and Ops,
   late time-ins), checked equal to Google's on 17 Oct. Google is asked only if the database does not answer. */
(function(){
  const base = api; let last = null, at = 0, fly = null;
  async function ovDb(){
    if(last && Date.now() - at < 20000) return last; if(fly) return fly;
    fly = (async () => { const ac = window.AbortController ? new AbortController() : null, tid = ac ? setTimeout(() => ac.abort(), 8000) : 0;
      try{ const r = await fetch(FAST_URL + '-mgmt', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ op: 'overview', token: TOKEN }), signal: ac ? ac.signal : undefined }).then(x => x.json());
        if(!(r && r.ok && r.data && Array.isArray(r.data.teachers) && Array.isArray(r.data.team))) throw new Error('no overview');
        last = r.data; at = Date.now(); return r.data; }
      finally{ clearTimeout(tid); fly = null; } })();
    return fly; }
  api = function(fn, ...args){
    if(fn === 'mgmtOverview' && typeof D !== 'undefined' && D && D.mgr && typeof LIVE !== 'undefined' && LIVE && TOKEN) return ovDb().catch(() => base(fn, ...args));
    if(/^(decideLate|timeIn|timeOut)$/.test(fn)) at = 0;   /* a decision or a time-in: the next Overview is read fresh */
    return base(fn, ...args); };
})();
