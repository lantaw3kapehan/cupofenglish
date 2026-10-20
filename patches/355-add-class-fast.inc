/* 20 Oct · 355 · Add class saved in the database at once (Misty: "adding a trial student is also too slow").
   One class or a weekly package, regular or trial (TC): coe-mgmt op classAdd checks the same things Google does (the student already has that start ·
   the teacher already has a class then → "Add anyway"), saves the classes in the class table and answers in about a second.
   Google Calendar makes the events in the background with the same addClass (invites, trial source / referral, its own day copy);
   the quick rows are then swapped for the real events. If Google refuses, the quick rows go and the person is told.
   Substitute classes (SC) still go to Google (absence case). If the database does not answer in 9 s, it goes to Google as before. */
(function(){
  const base = api;
  async function watch(id, label){
    for(let i = 0; i < 70; i++){
      await new Promise(z => setTimeout(z, i < 6 ? 5000 : 8000));
      let r = null; try{ r = await fetch(FAST_URL + '-mgmt', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ op: 'writeStatus', id: id, token: TOKEN }) }).then(x => x.json()); }catch(e){}
      if(!r || !r.ok) continue;
      if(r.status === 'done'){ try{ Object.keys(SCC).forEach(k => { SCC[k]._t = 0; }); if(VIEW === 'schedule') loadSchedule(0, true); }catch(e){} return; }
      if(r.status === 'error'){ const msg = String(r.error || (r.result && r.result.msg) || 'Google did not accept it');
        try{ Object.keys(SCC).forEach(k => { SCC[k]._t = 0; }); if(VIEW === 'schedule') loadSchedule(0, true); }catch(e){}
        try{ const show = () => { if($('sheet') && $('sheet').classList.contains('on')) return setTimeout(show, 1500);
          openSheet('<h1>Not added in Google Calendar</h1><div class="fbfix" style="margin-top:10px;border-left:4px solid #C0392B"><b style="color:#B23A22">' + esc(label) + '</b><div style="margin-top:4px">' + esc(msg) + '</div><div class="small" style="margin-top:6px">The class was taken off the schedule again · add it once more, or check the calendar.</div></div>'); };
          show(); }catch(e){ toast('Not added in Google Calendar · ' + msg); }
        return; } } }
  function newStu(f, d){ try{
    const x = { code: String(f.code).toUpperCase(), en: String(f.student || '').trim(), cn: String(f.cn || '').trim(), trialDate: f.kind === 'TC' ? f.date : '', trialTime: f.kind === 'TC' ? f.time : '', trialBook: f.kind === 'TC' ? (f.book || '') : '', trialTeacher: f.kind === 'TC' ? String(f.teacher || '').replace(/^teacher\s+/i, '') : '' };
    if(f.src) x.source = f.src === 'Partner' ? 'Partner – ' + (f.partner || '') : f.src === 'Student' ? (f.refCode || '') + ' – ' + (f.refName || '') : f.src;
    Object.keys(x).forEach(k => { if(x[k] === '') delete x[k]; });
    api('saveStudent', TOKEN, x, 0).catch(() => {});
  }catch(e){} }
  api = function(fn, ...args){
    const f = args[1];
    if(fn === 'addClass' && TOKEN && typeof D !== 'undefined' && D && D.mgr && f && f.kind !== 'SC'){
      const ac = window.AbortController ? new AbortController() : null, tid = ac ? setTimeout(() => ac.abort(), 9000) : 0;
      const rid = 'ac' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
      return fetch(FAST_URL + '-mgmt', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ op: 'classAdd', f: f, rid: rid, token: TOKEN }), signal: ac ? ac.signal : undefined })
        .then(x => x.json()).then(r => {
          if(!(r && r.ok && r.data)) throw new Error('google');
          const d = r.data; if(d.ok === false) return d;   /* a double booking or "already has" · the same choices as before */
          if(f.fresh && f.code) newStu(f, d);   /* a trial with a new code: the student goes into DATABASE at once too (it used to be left for later by hand) */
          if(d.queued) watch(d.queued, (f.student || f.code || 'The class') + ' · ' + (d.dates && d.dates.length > 1 ? d.dates.length + ' classes' : (d.date || f.date) + ' ' + f.time));
          try{ Object.keys(SCC).forEach(k => { SCC[k]._t = 0; }); }catch(e){}
          return d; })
        .catch(() => base(fn, ...args)).finally(() => clearTimeout(tid)); }
    return base(fn, ...args); };
  /* Edit details for a trial student who is not in DATABASE yet (e.g. Abner ST-2026-126): open the New student form for that code instead of stopping */
  try{ const _se = window.stuEdit; if(_se) window.stuEdit = async function(code){ const c = String(code || '').trim().toUpperCase();
    if(/^ST-\d{4}-\d{3}$/.test(c)){ if(typeof DB === 'undefined' || !DB){ try{ await loadDb(true); }catch(e){} }
      const has = ((typeof DB !== 'undefined' && DB && DB.rows) || []).some(x => String(x[0]).trim().toUpperCase() === c);
      if(!has && typeof DB !== 'undefined' && DB && DB.rows){ closeSheet(); toast(c + ' is new · fill in the details to add the student'); setTimeout(() => stuForm(0, c), 150); return; } }
    return _se.apply(this, arguments); }; }catch(e){}
  /* "Teacher Teacher Christian" in the save banner */
  try{ const _w = window.svPillWhen; if(_w) window.svPillWhen = function(f){ return String(_w.apply(this, arguments)).replace(/Teacher (Teacher )+/g, 'Teacher '); }; }catch(e){}
})();
