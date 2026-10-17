/* 17 Oct · 271 · Performance from the database (coe-mgmt › screen mgmtPerformance = coe_performance_live). Same as Google's except:
   homework counts each homework once (Google counted a homework saved twice as two). Google only as a fallback. */
(function(){
  const base = api; let last = null, at = 0;
  async function perfDb(){
    if(last && Date.now() - at < 30000) return last;
    const ac = window.AbortController ? new AbortController() : null, tid = ac ? setTimeout(() => ac.abort(), 8000) : 0;
    try{ const r = await fetch(FAST_URL + '-mgmt', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ op: 'screen', fn: 'mgmtPerformance', token: TOKEN }), signal: ac ? ac.signal : undefined }).then(x => x.json());
      if(!(r && r.ok && r.data && Array.isArray(r.data.teachers) && Array.isArray(r.data.ranks))) throw new Error('no performance');
      last = r.data; at = Date.now(); return r.data; }
    finally{ clearTimeout(tid); } }
  api = function(fn, ...args){
    if(fn === 'mgmtPerformance' && typeof D !== 'undefined' && D && D.mgr && TOKEN) return perfDb().catch(() => base(fn, ...args));
    if(/^(mgmtQaSubmit|tPcSubmit)$/.test(fn)) at = 0;
    return base(fn, ...args); };
})();
