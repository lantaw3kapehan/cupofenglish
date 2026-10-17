/* 17 Oct · 270 · Renewals from the database (coe-mgmt › screen mgmtRenewals = coe_renewals_map, checked equal to Google's).
   After a renewal status is saved the next read waits 5 s so the database has it; Google only as a fallback. */
(function(){
  const base = api; let last = null, at = 0, saved = 0;
  async function renDb(){
    if(last && Date.now() - at < 15000 && at > saved) return last;
    if(Date.now() - saved < 5000) await new Promise(z => setTimeout(z, 5000 - (Date.now() - saved)));
    const ac = window.AbortController ? new AbortController() : null, tid = ac ? setTimeout(() => ac.abort(), 8000) : 0;
    try{ const r = await fetch(FAST_URL + '-mgmt', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ op: 'screen', fn: 'mgmtRenewals', token: TOKEN }), signal: ac ? ac.signal : undefined }).then(x => x.json());
      if(!(r && r.ok && r.data && typeof r.data === 'object' && !Array.isArray(r.data))) throw new Error('no renewals');
      last = r.data; at = Date.now(); return r.data; }
    finally{ clearTimeout(tid); } }
  api = function(fn, ...args){
    if(fn === 'mgmtRenewals' && typeof D !== 'undefined' && D && D.mgr && TOKEN) return renDb().catch(() => base(fn, ...args));
    if(/^mgmt(Renewal|RenewPaid|EnrolPaid)$/.test(fn)) saved = Date.now();
    return base(fn, ...args); };
})();
