/* 19 Oct · 278 · more screens from the database (coe-mgmt › screen), each checked equal to Google's answer first:
   enquiries (mgmtEnqList), agreements (mgmtAgreeMap), reminders sent (mgmtReminders), a teacher's hours and classes
   (mgmtAvail / tAvail), the classes a leave covers (mgmtLeaveClasses / tLeaveClasses) and the week summary (mgmtWeekSum).
   Google answers if the database does not answer in 8 s or is not ready. After a save on this device the screen it changes
   reads from Google for 5 minutes (the database copy follows within a few minutes). */
(function(){
  const base = api, until = {};
  const KIND = { mgmtEnqList: 'enq', mgmtAgreeMap: 'agr', mgmtReminders: 'rem', mgmtAvail: 'av', tAvail: 'av', mgmtLeaveClasses: 'cls', tLeaveClasses: 'cls', mgmtWeekSum: 'cls' };
  const SAVES = [[/^mgmtEnq(Save|Status|Del\w*)$/, ['enq']], [/^mgmtAgree(Save|Del\w*)$/, ['agr']], [/^(mgmt|t)RemindLog$/, ['rem', 'cls']],
    [/^(mgmt|t)AvailSave$/, ['av']], [/^(mgmtEditClass|editClass|mgmtAddClass|addClass|mgmtCancelClass|cancelClass|mgmtMoveClass|moveClass|tCancel\w*|mgmtSub\w*|mgmtSetBook)$/, ['cls', 'av']]];
  async function viaDb(fn, args){
    const ac = window.AbortController ? new AbortController() : null, tid = ac ? setTimeout(() => ac.abort(), 8000) : 0;
    try{ const r = await fetch(FAST_URL + '-mgmt', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ op: 'screen', fn: fn, args: args, token: TOKEN }), signal: ac ? ac.signal : undefined }).then(x => x.json());
      if(!(r && r.ok && r.data != null)) throw new Error('no screen'); return r.data; }
    finally{ clearTimeout(tid); } }
  api = function(fn, ...args){
    const k = KIND[fn];
    if(k && TOKEN && Date.now() > (until[k] || 0)) return viaDb(fn, args.slice(1)).catch(() => base(fn, ...args));
    for(const s of SAVES) if(s[0].test(fn)) s[1].forEach(x => until[x] = Date.now() + 5 * 6e4);
    return base(fn, ...args); };
})();
