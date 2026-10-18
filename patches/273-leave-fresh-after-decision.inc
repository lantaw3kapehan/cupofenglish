/* 18 Oct · 273 · Pam's approved leave still showed "waiting for your approval": a leave decision is written straight to the
   sheet by Google, while the leave list is read from the database copy of T-LEAVE (now re-copied every 3 min, Apps Script HEAD).
   For 10 minutes after a leave save on this device, the leave lists come straight from Google, so the decision shows at once. */
(function(){
  const base = api; let until = 0;
  api = function(fn, ...args){
    if(/^(mgmtLeave(Save|Ask|Proof)|tLeave(Cancel|Reply|Request|Informed))$/.test(fn)){
      const p = base(fn, ...args);
      try{ p.then(r => { if(!(r && r.ok === false)) until = Date.now() + 10 * 6e4; }, () => {}); }catch(e){}
      return p; }
    if((fn === 'mgmtLeave' || fn === 'tLeave') && Date.now() < until) return apiNow(fn, ...args);
    return base(fn, ...args); };
})();
