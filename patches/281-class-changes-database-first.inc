/* 19 Oct · 281 · CE19 · Cancel / Restore / Move of one class is saved in the database first (coe-mgmt › classEdit):
   every screen and every device sees it at once; Google Calendar is updated a few seconds later by the same Google save
   (and by Google's minute job if that call does not get through). If Google refuses it (for example a clash it finds), the class
   goes back as it was and you are told. A double booking is checked first, the same way Google does ("Save anyway" as before).
   Moving the later classes too, a cancel with a make-up and Add class still go straight to Google. */
(function(){
  const base = api; let CL19 = 0;
  const _pill = window.svPill;
  if(_pill) window.svPill = function(id, html, kind){ if(kind === 'ok' && Date.now() - CL19 < 3000 && typeof html === 'string') html = html.replace('Saved in Google Calendar', 'Saved') ; return _pill.call(this, id, html, kind); };
  function refresh(){ try{ Object.keys(SCC || {}).forEach(k => { SCC[k]._t = 0; }); }catch(e){} try{ if(VIEW === 'schedule') loadSchedule(0, true); }catch(e){} }
  async function watch(id, label){
    for(let i = 0; i < 45; i++){
      await new Promise(z => setTimeout(z, i < 5 ? 3000 : 6000));
      let r = null; try{ r = await fetch(FAST_URL + '-mgmt', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ op: 'writeStatus', id: id, token: TOKEN }) }).then(x => x.json()); }catch(e){}
      if(!r || !r.ok) continue;
      if(r.status === 'done') return;
      if(r.status === 'error'){ refresh();
        const msg = String(r.error || (r.result && r.result.msg) || 'Google did not accept it');
        try{ openSheet('<h1>Not saved in Google Calendar</h1><div class="fbfix" style="margin-top:10px;border-left:4px solid #C0392B"><b style="color:#B23A22">' + esc(label) + ' is back as it was</b><div class="small">' + esc(msg) + '</div></div><button class="btn ghost block" style="margin-top:12px" onclick="closeSheet()">OK</button>'); }catch(e){ toast('Not saved in Google Calendar · ' + msg); }
        return; } }
  }
  api = function(fn, ...args){
    const f = args[2];
    if(fn === 'editClass' && TOKEN && D && D.mgr && f && /^(cancel|restore|move)$/.test(f.action) && !f.forward && !(f.action === 'cancel' && f.makeup)){
      const ac = window.AbortController ? new AbortController() : null, tid = ac ? setTimeout(() => ac.abort(), 9000) : 0;
      const rid = 'ce' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
      return fetch(FAST_URL + '-mgmt', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ op: 'classEdit', id: args[1], f: f, rid: rid, token: TOKEN }), signal: ac ? ac.signal : undefined })
        .then(x => x.json()).then(r => {
          if(r && r.ok && r.data && r.data.ok === false) return r.data;   // a double booking: the same "Save anyway" choice as before
          if(!(r && r.ok && r.queued)) throw new Error('google');
          CL19 = Date.now(); watch(r.queued, String(r.title || 'The class').replace(/\s+X$/i, ''));
          return { ok: true, title: r.title, note: r.note + ' · Google Calendar follows in a few seconds', fwd: null, queued: r.queued }; })
        .catch(() => base(fn, ...args)).finally(() => clearTimeout(tid)); }
    return base(fn, ...args); };
})();
