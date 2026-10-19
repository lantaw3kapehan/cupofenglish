/* 19 Oct · 325 · QA next actions checked in Celine's class visits (Misty: "do all")
   · Class visit form: the teacher's "Required next action" from her latest QA, one line each, with Done / Partly / Not yet.
     Saved with the visit (coe_qa_checks through coe-mgmt mgmtQaCheck); optional — a visit can be saved without them.
   · QA form: "Since her last QA" shows, for each next action, how many visits saw it Done / Partly / Not yet. */
(function(){
  const post = (fn, args) => fetch(FAST_URL + '-mgmt', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ op: 'screen', fn, args: args || [], token: TOKEN }) }).then(x => x.json()).then(r => { if(!(r && r.ok)) throw new Error(fn); return r.data; });
  const NX = {}, PICK = {};
  const css = document.createElement('style'); css.textContent = `.qn-box{margin-top:12px;padding:10px 12px;border-radius:14px;background:#F4F1FB;border:1px solid #E1DAF3}
.qn-it{padding:8px 0;border-top:1px dashed #DDD5F0}.qn-it:first-of-type{border-top:0}.qn-b{display:flex;gap:6px;margin-top:6px;flex-wrap:wrap}
.qn-b button{border:1.5px solid var(--line);background:#fff;border-radius:10px;padding:5px 10px;font:inherit;font-size:13px;cursor:pointer}
.qn-b button.on.d{background:#E3F6EC;border-color:#1E7A55;color:#1E7A55}.qn-b button.on.p{background:#FFF4D6;border-color:#B78A00;color:#7a5a00}.qn-b button.on.n{background:#FDECEA;border-color:#C0392B;color:#B03A2E}
.qn-tally{font-size:12px;color:var(--mute);margin-top:2px}`;
  document.head.appendChild(css);
  const tOf = e => String(e && (e.teacher || (e.teachers || [])[0]) || '').split(/\s*,\s*/)[0].trim();
  const cap = s => s ? s[0].toUpperCase() + s.slice(1) : s;
  function load(t){ const k = t.toLowerCase(); if(NX[k] && Date.now() - NX[k].at < 5 * 6e4) return Promise.resolve(NX[k].d);
    return post('mgmtQaNext', [cap(t)]).then(d => { NX[k] = { d, at: Date.now() }; return d; }); }
  const tally = it => [it.done ? '✓ ' + it.done : '', it.partly ? '◐ ' + it.partly : '', it.notyet ? '✗ ' + it.notyet : ''].filter(Boolean).join(' · ');
  // the visit form
  function inject(){ const go = $('mvGo'), e = window._mvE; if(!go || !e || go.parentNode.querySelector('.qn-box')) return; const t = tOf(e); if(!t) return;
    const box = document.createElement('div'); box.className = 'qn-box small'; box.innerHTML = '<span class="mute">Loading her QA next actions…</span>'; go.before(box);
    load(t).then(d => { if(!d || !d.period || !(d.items || []).length){ box.remove(); return; } const key = (e.id || '') + '|' + d.period; PICK[key] = PICK[key] || {};
      box.innerHTML = `<b>QA next actions · ${esc(d.period)}</b> <span class="mute">· did you see these in this class? (optional)</span>` + d.items.map(it => `<div class="qn-it" data-i="${it.i}"><div>${esc(it.text)}</div>${tally(it) ? `<div class="qn-tally">Earlier visits: ${esc(tally(it))}</div>` : ''}
<div class="qn-b">${[['Done', 'd'], ['Partly', 'p'], ['Not yet', 'n']].map(([l, c]) => `<button type="button" class="${c}${PICK[key][it.i] === l ? ' on' : ''}" data-v="${l}">${l}</button>`).join('')}<button type="button" class="mute" data-v="" style="border-style:dashed">Not seen</button></div></div>`).join('');
      box.querySelectorAll('.qn-b button').forEach(b => b.onclick = () => { const i = +b.closest('.qn-it').dataset.i; PICK[key][i] = b.dataset.v; b.parentNode.querySelectorAll('button').forEach(x => x.classList.toggle('on', x === b && !!b.dataset.v)); });
      box.dataset.key = key; box.dataset.period = d.period; box.dataset.t = t; box._items = d.items; }).catch(() => box.remove()); }
  new MutationObserver(() => { try{ if($('mvGo') && !document.querySelector('#mvGo ~ .qn-box, .qn-box')) inject(); }catch(e){} }).observe(document.body, { childList: true, subtree: true });
  const _send = window.mvSend; if(_send) window.mvSend = async function(){ const box = document.querySelector('.qn-box'), e = window._mvE; let rows = [];
      try{ if(box && box.dataset.key && e){ const P = PICK[box.dataset.key] || {}; rows = (box._items || []).filter(it => P[it.i]).map(it => ({ i: it.i, text: it.text, status: P[it.i] })); } }catch(x){}
      const r = await _send.apply(this, arguments);
      try{ if(rows.length && !$('mvGo')){ post('mgmtQaCheck', [box.dataset.t, box.dataset.period, rows, String(e.id || ''), ymdLocal(new Date(e.start))]).then(() => { delete NX[box.dataset.t.toLowerCase()]; toast('✓ QA next actions noted · ' + rows.length); }).catch(() => toast('QA next actions not saved · check the connection')); } }catch(x){}
      return r; };
  // the QA form: what Celine's visits saw since her last QA
  function qaPanel(){ const t = typeof QA_T !== 'undefined' ? QA_T : ''; const hist = $('qaHist'); if(!t || !hist) return; let p = $('qaNx'); if(p && p.dataset.t === t) return;
    if(!p){ p = document.createElement('div'); p.id = 'qaNx'; p.className = 'qh-box small'; hist.after(p); } p.dataset.t = t; p.innerHTML = '<span class="mute">Class visits since her last QA…</span>';
    load(t).then(d => { if(t !== QA_T) return; if(!d || !d.period || !(d.items || []).length){ p.remove(); return; }
      const any = d.items.some(it => it.done + it.partly + it.notyet > 0);
      p.innerHTML = `<b>Her ${esc(d.period)} next actions · seen in class visits</b>` + (any ? '' : ' <span class="mute">· not checked in a visit yet</span>') + d.items.map(it => `<div style="margin-top:5px">${it.done + it.partly + it.notyet ? `<b style="color:${it.done >= it.partly + it.notyet ? '#1E7A55' : it.notyet > it.done ? '#B03A2E' : '#7a5a00'}">${esc(tally(it))}</b> · ` : '<span class="mute">— · </span>'}${esc(it.text)}</div>`).join(''); }).catch(() => p.remove()); }
  setInterval(() => { try{ if($('qaHist')) qaPanel(); }catch(e){} }, 1500);
})();
