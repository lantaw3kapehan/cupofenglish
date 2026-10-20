/* 20 Oct · 475 · Add class / move: the clash check answers in under a second (App health: classCheck took 41.7 s × 105 a day).
   The class table answers first (coe-clash: the teacher's own classes and the student's classes at that time, on every date);
   Google's check still runs behind it and, when it comes back, adds what only it knows (the teacher's hours) to the same note.
   If the quick check cannot be reached, Google's answer is used exactly as before. */
(function(){
  const base = window.api; let LAST = null, GEN = 0;
  const baseShow = window.ckShow;
  window.ckShow = function(elId, btnId){ LAST = [elId, btnId]; return baseShow.apply(this, arguments); };
  window.api = function(fn){
    if(fn !== 'classCheck') return base.apply(this, arguments);
    const args = arguments, q = Object.assign({}, args[2] || {}), g = ++GEN, t0 = Date.now();
    const slow = base.apply(this, args);   // Google, as before
    const fast = fetch(FAST_URL + '-clash', { method: 'POST', headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify(Object.assign({ token: TOKEN }, q, { code: q.code || (q.ignore ? '' : ((String(($('cS') || {}).value || '').match(/ST-\d{4}-\d{3}/i) || [''])[0])) })) }).then(x => x.json()).catch(() => null);
    return Promise.race([fast.then(r => r && r.ok ? r : slow), new Promise(z => setTimeout(() => z(null), 6000)).then(() => slow)]).then(r => {
      if(r && r.src === 'db'){
        r = { ok: true, hours: false, issues: (r.issues || []).concat(r.more ? ['…and ' + r.more + ' more'] : []), quick: true };
        slow.then(G => { try{
          if(!G || !G.ok || !CK || !CK.r || CK.r !== r) return;   // the form moved on
          const seen = new Set(r.issues.map(s => s.slice(0, 16))), add = (G.issues || []).filter(s => !seen.has(String(s).slice(0, 16)));
          CK.r = { ok: true, hours: !!G.hours, issues: r.issues.concat(add) }; if(LAST) window.ckShow(LAST[0], LAST[1]);
        }catch(e){} }).catch(() => {});
        try{ console.log('[clash] quick ' + (Date.now() - t0) + ' ms'); }catch(e){}
      }
      return r;
    });
  };
})();
