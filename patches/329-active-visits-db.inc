/* 19 Oct · 329 · Class visits straight into the database (Misty: "save Celine's class visits straight to the database")
   The moment a visit is saved, the same row goes into the database copy of S-MONITOR (coe-mgmt mgmtMonRow → coe_mon_row_put; newest at the top,
   the same event saved again updates its row). Visit coverage, Teacher Excellence, QA history and first 90 days see it at once; Google still writes the sheet row. */
(function(){
  const post = (fn, args) => fetch(FAST_URL + '-mgmt', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ op: 'screen', fn, args: args || [], token: TOKEN }) }).then(x => x.json()).then(r => { if(!(r && r.ok)) throw new Error(fn); return r.data; });
  const now = () => new Date(Date.now() + 8 * 3600e3).toISOString().slice(0, 19);
  function rowOf(p){ const t = String(p.time || '').match(/^(\d{1,2}):(\d{2})/); const by = (typeof D !== 'undefined' && D && D.me && D.me.name) || '';
    return [now(), String(p.date || '').slice(0, 10) + 'T00:00:00', t ? '1899-12-30T' + t[1].padStart(2, '0') + ':' + t[2] + ':00' : '', p.code || '', p.student || '', p.teacher || '', p.eventId || '',
      [].concat(p.checks || []).join(' · '), p.note || '', by, '', '']; }
  const _api = api; api = function(fn, ...args){
    if(fn === 'mgmtMonitor' && typeof D !== 'undefined' && D && D.mgr){ try{ const p = args[1] || {}; if(p.eventId && p.teacher && !p.ack) post('mgmtMonRow', [rowOf(p)]).catch(() => {}); }catch(e){} }
    return _api(fn, ...args); };
})();
