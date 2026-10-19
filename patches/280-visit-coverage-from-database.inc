/* 19 Oct · 280 · "Visit instead" suggestions on a class visit (mgmtVisitCoverage: teachers with classes left today, longest since
   their last visit) from the database (coe_visit_coverage: S-MONITOR + today's classes). Google answers if the database does not
   answer in 8 s, and for 5 minutes after a class visit is saved on this device. */
(function(){
  const base = api; let until = 0;
  api = function(fn, ...args){
    if(fn === 'mgmtVisitCoverage' && TOKEN && Date.now() > until){
      const ac = window.AbortController ? new AbortController() : null, tid = ac ? setTimeout(() => ac.abort(), 8000) : 0;
      return fetch(FAST_URL + '-mgmt', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ op: 'screen', fn: fn, args: [], token: TOKEN }), signal: ac ? ac.signal : undefined })
        .then(x => x.json()).then(r => { if(!(r && r.ok && r.data && r.data.ok)) throw new Error('no coverage'); return r.data; })
        .catch(() => base(fn, ...args)).finally(() => clearTimeout(tid)); }
    if(fn === 'mgmtMonitor') until = Date.now() + 5 * 6e4;
    return base(fn, ...args); };
})();
