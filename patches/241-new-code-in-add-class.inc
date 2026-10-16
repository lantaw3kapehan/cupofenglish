/* 16 Oct · Add class › new student: the code comes from the database too (coe-mgmt › newCode), so a code shown in
   Add class and a code given in Students can never be the same. The app's own guess shows first and is replaced within a second. */
(function(){
  const base = window.classUseNew; if(typeof base !== 'function') return;
  window.classUseNew = function(){ const r = base.apply(this, arguments);
    try{ const el = $('cS'), guess = ((el && el.value) || '').match(/^ST-\d{4}-\d{3}/); if(!guess || !TOKEN) return r;
      fetch(FAST_URL + '-mgmt', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ op: 'newCode', token: TOKEN }) }).then(x => x.json()).then(nc => {
        const e2 = $('cS'); if(!nc || !nc.ok || !nc.code || !e2 || e2.value.indexOf(guess[0]) !== 0) return;
        e2.value = nc.code + e2.value.slice(guess[0].length); try{ classPick(); }catch(x){} }).catch(() => {}); }catch(e){}
    return r; };
})();
