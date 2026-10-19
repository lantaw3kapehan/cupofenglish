/* 19 Oct · 285 · Management hours (mgmtHours) from the database (coe_mgmt_hours: T-TIMEIN + TIME-IN, checked equal to Google's answer);
   the pay base only for the President or the person herself, as on Google. Google answers if the database does not answer in 8 s,
   and for 5 minutes after a time-in / time-out on this device. */
(function(){
  const base = api; let until = 0;
  api = function(fn, ...args){
    if(fn === 'mgmtHours' && TOKEN && Date.now() > until){
      const ac = window.AbortController ? new AbortController() : null, tid = ac ? setTimeout(() => ac.abort(), 8000) : 0;
      return fetch(FAST_URL + '-mgmt', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ op: 'screen', fn: fn, args: args.slice(1), token: TOKEN }), signal: ac ? ac.signal : undefined })
        .then(x => x.json()).then(r => { if(!(r && r.ok && r.data && Array.isArray(r.data.people))) throw new Error('no hours'); return r.data; })
        .catch(() => base(fn, ...args)).finally(() => clearTimeout(tid)); }
    if(/^(timeIn|timeOut|mgmtTimeFix\w*)$/.test(fn)) until = Date.now() + 5 * 6e4;
    return base(fn, ...args); };
})();
