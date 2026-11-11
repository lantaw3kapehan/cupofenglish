/* 2080 (11 Nov, Misty: "YES MOVE WEEK SUMMARY TO THE DATABASE"). Last week's summary on the Overview is read from the database's own
   copy (docs "<pres|mgmt>:mgmtWeekSum|[monday]", made every 5 minutes by coe_weeksum_put from the class table and the reminder log).
   Google is never asked: its copy stopped with the background jobs (2079). */
(function(){
  if(window.__2080) return; window.__2080 = 1;
  async function weekSum(tok, mon){
    const key = (typeof sbKey === 'function') ? sbKey('mgmtWeekSum', [tok, mon]) : ((window.D && D.pres ? 'pres' : 'mgmt') + ':mgmtWeekSum|' + JSON.stringify([mon]));
    const ac = window.AbortController ? new AbortController() : null, tid = ac ? setTimeout(() => ac.abort(), 15000) : 0;
    try{
      const r = await fetch(FAST_URL, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ op: 'docs', token: tok, keys: [key] }), signal: ac ? ac.signal : undefined }).then(x => x.json());
      const d = r && r.ok && r.docs && r.docs[key];
      if(d && d.data && d.data.week) return d.data;
    }catch(e){} finally{ clearTimeout(tid); }
    return { ok: false, msg: 'Week summary not ready yet' }; }
  const wrap = base => { const w = function(fn){ const a = Array.prototype.slice.call(arguments, 1);
      if(fn === 'mgmtWeekSum' && a[0] && typeof TOKEN !== 'undefined' && a[0] === TOKEN && /^\d{4}-\d{2}-\d{2}$/.test(String(a[1] || ''))) return weekSum(a[0], String(a[1]));
      return base.apply(this, arguments); };
    for(const k in base) try{ w[k] = base[k]; }catch(e){} w.__2080 = 1; return w; };
  if(typeof window.api === 'function') window.api = wrap(window.api);
  if(typeof window.apiNow === 'function') window.apiNow = apiNow = wrap(window.apiNow);
})();
