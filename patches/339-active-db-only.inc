/* 19 Oct · 339 · Active comes only from the database (Misty: "yes better do it"). No Google backup any more:
   the database is asked (20 s, then once more); if it still does not answer, the last copy on this device stays on screen with a note.
   After a package save (Enrol / Renew / Renewal / Fix / Set course) the database rebuilds ACTIVE within about 5 minutes; the screen reads it again at 1, 3 and 6 minutes. */
(function(){
  async function db(args, ms){ const ac = window.AbortController ? new AbortController() : null, tid = ac ? setTimeout(() => ac.abort(), ms) : 0;
    try{ const r = await fetch(FAST_URL + '-mgmt', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ op: 'screen', fn: 'mgmtActive', args: args || [], token: TOKEN }), signal: ac ? ac.signal : undefined }).then(x => x.json());
      if(!(r && r.ok && r.data && r.data.rows)) throw new Error('no data'); return r.data; } finally{ clearTimeout(tid); } }
  const inner = api;
  api = async function(fn, ...args){
    if(fn !== 'mgmtActive') { const p = inner(fn, ...args);
      if(/^mgmt(EnrolPaid|RenewPaid|Renewal|PkgFix|SetCourse|Fix)$/.test(fn)) Promise.resolve(p).then(r => { if(r && r.ok) [6e4, 18e4, 36e4].forEach(t => setTimeout(() => { try{ if(typeof loadActive === 'function') loadActive(true); }catch(e){} }, t)); }).catch(() => {});
      return p; }
    let v; try{ v = await db(args.slice(1), 20000); }catch(e){ v = await db(args.slice(1), 25000).catch(x => { try{ toast('Active: the database is slow · showing the last copy on this device'); }catch(y){} throw x; }); }
    try{ if(window.coeFixActive) window.coeFixActive(v); }catch(e){} return v; };
})();
