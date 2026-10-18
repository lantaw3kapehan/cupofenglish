/* 18 Oct · 276 · a student's class list (mgmtStuClasses for management, tStuClasses for teachers — the busiest Google screen,
   ≈ 250 a day) from the database: coe-mgmt › stuClasses = coe_stu_classes (the class table, 45 days back to 120 ahead, kept
   complete by Google's CL18 copy). Teachers only see their own students. Google answers if the database is not ready, does not
   know the student, or does not answer in 8 s. A move/cancel/add on this device reads fresh for 2 minutes. */
(function(){
  const base = api, memo = {}; let fresh = 0;
  async function clsDb(code){
    const k = String(code || '').trim().toUpperCase(), m = memo[k]; if(m && Date.now() - m.t < 20000 && Date.now() > fresh) return m.d;
    const ac = window.AbortController ? new AbortController() : null, tid = ac ? setTimeout(() => ac.abort(), 8000) : 0;
    try{ const r = await fetch(FAST_URL + '-mgmt', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ op: 'stuClasses', code: k, token: TOKEN }), signal: ac ? ac.signal : undefined }).then(x => x.json());
      if(!(r && r.ok && Array.isArray(r.data))) throw new Error('no classes');
      memo[k] = { t: Date.now(), d: r.data }; return r.data; }
    finally{ clearTimeout(tid); } }
  api = function(fn, ...args){
    if((fn === 'mgmtStuClasses' || fn === 'tStuClasses') && TOKEN && args[1] && Date.now() > fresh) return clsDb(args[1]).catch(() => base(fn, ...args));
    if(/^(mgmtEditClass|editClass|mgmtAddClass|addClass|mgmtCancelClass|cancelClass|mgmtMoveClass|moveClass|tCancel\w*|mgmtSub\w*)$/.test(fn)){ fresh = Date.now() + 2 * 6e4; for(const k in memo) delete memo[k]; }
    return base(fn, ...args); };
})();
