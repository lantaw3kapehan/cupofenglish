/* 19 Oct · 284 · SB19 · Change book is saved in the database first (coe-mgmt › setBook, the same rule as Google): every screen and the
   CEFR journey show the new book at once; Google Calendar renames the classes a few seconds later (Google's minute job if that call
   does not get through). If Google refuses it, the classes go back to the old book and you are told. */
(function(){
  const base = api;
  async function watch(id, label){
    for(let i = 0; i < 45; i++){
      await new Promise(z => setTimeout(z, i < 5 ? 4000 : 8000));
      let r = null; try{ r = await fetch(FAST_URL + '-mgmt', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ op: 'writeStatus', id: id, token: TOKEN }) }).then(x => x.json()); }catch(e){}
      if(!r || !r.ok) continue; if(r.status === 'done') return;
      if(r.status === 'error'){ const msg = String(r.error || 'Google did not accept it');
        try{ openSheet('<h1>Book not changed in Google Calendar</h1><div class="fbfix" style="margin-top:10px;border-left:4px solid #C0392B"><b style="color:#B23A22">' + esc(label) + ' · back to the old book</b><div class="small">' + esc(msg) + '</div></div><button class="btn ghost block" style="margin-top:12px" onclick="closeSheet()">OK</button>'); }catch(e){ toast('Book not changed · ' + msg); }
        return; } } }
  api = function(fn, ...args){
    if(fn === 'mgmtSetBook' && TOKEN && D && D.mgr && /^ST-\d{4}-\d{3}$/i.test(String(args[1] || '').trim())){
      const code = String(args[1]).trim().toUpperCase(), ac = window.AbortController ? new AbortController() : null, tid = ac ? setTimeout(() => ac.abort(), 12000) : 0;
      return fetch(FAST_URL + '-mgmt', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ op: 'setBook', args: args.slice(1, 5), token: TOKEN }), signal: ac ? ac.signal : undefined })
        .then(x => x.json()).then(r => { if(!(r && r.ok && r.data && r.data.ok)) throw new Error('google'); const d = r.data;
          if(d.queued) watch(d.queued, code + ' · ' + d.book);
          try{ if(window.STU && STU.code === code) base('mgmtStuClasses', TOKEN, code).then(x => { if(!Array.isArray(x)) return; CLSM[code] = x; if(STU && STU.code === code){ STU.cls = x; const el = $('stuSch'); if(el) el.innerHTML = stuSched(x); } }).catch(() => {}); }catch(e){}
          try{ Object.keys(SCC || {}).forEach(k => { SCC[k]._t = 0; }); }catch(e){}
          return d; })
        .catch(() => base(fn, ...args)).finally(() => clearTimeout(tid)); }
    return base(fn, ...args); };
})();
