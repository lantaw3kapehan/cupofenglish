/* 17 Oct · 272 · the teacher card (management › Teachers) from the database (coe-mgmt › teacherCard): staff list, profile,
   6 months of attendance, pay, extras and students. Google only as a fallback. */
(function(){
  const base = api, memo = {};
  async function cardDb(name){
    const k = String(name || ''), m = memo[k]; if(m && Date.now() - m.t < 20000) return m.d;
    const ac = window.AbortController ? new AbortController() : null, tid = ac ? setTimeout(() => ac.abort(), 9000) : 0;
    try{ const r = await fetch(FAST_URL + '-mgmt', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ op: 'teacherCard', name: k, token: TOKEN }), signal: ac ? ac.signal : undefined }).then(x => x.json());
      const d = r && r.ok && r.data;
      if(!(d && d.name && Array.isArray(d.options) && d.options.length && d.me && Array.isArray(d.attend))) throw new Error('no card');
      memo[k] = { t: Date.now(), d }; return d; }
    finally{ clearTimeout(tid); } }
  api = function(fn, ...args){
    if(fn === 'mgmtTeacherCard' && typeof D !== 'undefined' && D && D.mgr && TOKEN){ const nm = args[1], force = args[2];
      if(force) delete memo[String(nm || '')];
      return cardDb(nm).catch(() => base(fn, ...args)); }
    return base(fn, ...args); };
})();
