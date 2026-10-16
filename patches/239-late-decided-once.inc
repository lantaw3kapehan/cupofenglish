/* 16 Oct · Misty: Celine waived Teacher April's late time-in but it still showed on Misty's Time-ins. Each screen kept its
   own list until the next full reload. A decision (Excused / Unexcused / Waive) is now noted in the database at once
   (coe-mgmt › lateDone → docs mgmt:lateDone) and every management screen hides it within a minute. */
(function(){
  let LD = {}, LDAT = 0, busy = false;
  const hideDone = () => { try{ if(MO && Array.isArray(MO.late)){ const n = MO.late.length; MO.late = MO.late.filter(l => !LD[String(l.row)]); return n !== MO.late.length; } }catch(e){} return false; };
  async function ldLoad(){ if(busy || !TOKEN || !(D && D.mgr)) return; busy = true;
    try{ const r = await fetch(FAST_URL, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ op: 'docs', token: TOKEN, keys: ['mgmt:lateDone'] }) }).then(x => x.json());
      const d = r && r.ok && r.docs && r.docs['mgmt:lateDone']; if(d && d.data && typeof d.data === 'object'){ LD = d.data; LDAT = Date.now(); if(hideDone()){ try{ store('set', 'coe.mo', JSON.stringify(MO)); }catch(e){} if(typeof renderTeam === 'function') renderTeam(); } } }catch(e){} busy = false; }
  const _rt = window.renderTeam; if(_rt) window.renderTeam = function(){ hideDone(); if(Date.now() - LDAT > 60000) setTimeout(ldLoad, 0); return _rt.apply(this, arguments); };
  const _sd = window.sendDecide; if(_sd) window.sendDecide = async function(row, cond){ LD[String(row)] = { cond: cond, ts: Date.now() };
    const r = await _sd.apply(this, arguments);
    try{ if(MO && MO.late && !MO.late.some(l => l.row === row)) fetch(FAST_URL + '-mgmt', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ op: 'lateDone', token: TOKEN, row: String(row), cond: cond }) }).catch(() => {}); else delete LD[String(row)]; }catch(e){}
    return r; };
  setInterval(() => { try{ const v = $('v-team'); if(v && v.offsetParent) ldLoad(); }catch(e){} }, 60000);
})();
