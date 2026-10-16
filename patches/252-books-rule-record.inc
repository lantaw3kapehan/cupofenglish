/* 16 Oct · 252 · Books rule, version 2 (Misty 20:56): the notice says what happens after a breach; each "I understand" is kept in
   the database (who, when, rule version) and management sees on the Books screen who has agreed and who has not yet.
   A new rule version asks every teacher again. */
(function(){
  const V = 2;
  window.bkRec = function(){ try{ fetch(FAST_URL + '-mgmt', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ op: 'books', token: TOKEN, agree: V }) }).catch(() => {}); }catch(e){} };
  const cap = s => String(s || '').replace(/\b\w/g, m => m.toUpperCase());
  const when = t => { const d = new Date(t); return isNaN(d) ? '' : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) + ' ' + d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false }); };
  let AG = null, AGT = 0;
  async function agLoad(){ if(AG && Date.now() - AGT < 120000) return AG;
    try{ const r = await fetch(FAST_URL + '-mgmt', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ op: 'books', token: TOKEN, agrees: V }) }).then(x => x.json()); if(r && r.ok){ AG = r.agrees || []; AGT = Date.now(); } }catch(e){}
    return AG; }
  function agPaint(){ const host = document.querySelector('#v-books .bk-rule'); if(!host || !D || !D.mgr) return; let el = $('bkAgree');
    if(!el){ host.insertAdjacentHTML('afterend', '<div id="bkAgree" style="margin:8px 0 2px"></div>'); el = $('bkAgree'); }
    if(!AG){ el.innerHTML = '<div class="small mute">Loading who has agreed…</div>'; return; }
    const yes = AG.filter(x => x.at), no = AG.filter(x => !x.at);
    el.innerHTML = `<div class="small" style="margin-bottom:6px"><b>Books rule</b> <span class="mute">· ${yes.length} of ${AG.length} teachers agreed (they agree the first time they open a book)</span></div><div style="display:flex;flex-wrap:wrap;gap:6px">`
      + no.map(x => `<span class="bk-sn" style="--sb:#FDF1EE;--sc:var(--coral)">${esc(cap(x.name))} · not yet</span>`).join('')
      + yes.map(x => `<span class="bk-sn" style="--sb:#E8F5E9;--sc:#2E7D32">✓ ${esc(cap(x.name))} · ${esc(when(x.at))}</span>`).join('') + '</div>'; }
  const L0 = window.bkLib2; if(L0) window.bkLib2 = function(){ const r = L0.apply(this, arguments); try{ if(D && D.mgr){ agPaint(); agLoad().then(agPaint); } }catch(e){} return r; };
})();
