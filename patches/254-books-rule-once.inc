/* 16 Oct · 254 · Books rule asked once (Misty 21:07): after "I understand" a teacher only sees a slim one-line reminder on the
   book lists, never the big box or the prompt again — also on a new phone or laptop, because the app asks the database
   whether they already agreed (coe-mgmt › books › check). */
(function(){
  try{ const st = document.createElement('style'); st.textContent = `
.bk-rule.slim{background:none;border:0;padding:2px 0;margin:6px 0 2px;font-size:12px;color:var(--mute);align-items:center;gap:6px}
.bk-rule.slim svg{width:14px;height:14px;margin:0;color:var(--mute)}
`; document.head.appendChild(st); }catch(e){}
  setTimeout(function chk(){ try{
    if(!D || D.mgr || !TOKEN) return; const k = 'coe.bkok2.' + String((D.me && D.me.name) || '').toLowerCase(); if(store('get', k)) return;
    fetch(FAST_URL + '-mgmt', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ op: 'books', token: TOKEN, check: 2 }) }).then(x => x.json()).then(r => { if(r && r.ok && r.agreed) try{ store('set', k, 'server'); }catch(e){} }).catch(() => {});
  }catch(e){} }, 4000);
})();
