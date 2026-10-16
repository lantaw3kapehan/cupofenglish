/* 16 Oct · 258 · Change book (management, student page): the student's upcoming classes get the new book from the chosen day
   on (Misty 21:42/21:45: Tony uses REF now · "that day and moving forward unless there's a change again"). No class is added,
   moved or removed (server mgmtSetBook renames the book in the class titles). */
(function(){
  const SUG = ['REF', 'RE1', 'RE2', 'RE3', 'OD1', 'OD2', 'OD3', 'OD4', 'Pathways1', 'Pathways2', 'TheAlphabet', 'ShortVowels', 'LongVowels', 'ConsonantBlends', 'LetterBlends', 'RazAa', 'RazA', 'RazB', 'RazC', 'WondersGK', 'WondersG1', 'WondersG2', 'IELTSWriting', 'IELTSSpeaking', 'Freetalk'];
  const today = () => { const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
  window.cbOpen = function(code){ const s = (STU && STU.code === code && STU.s) || {}, cur = String(s.book || '').split(/\s*,\s*/).filter(p => p && !/^(pre[-\s]?)?[abc][12]\+?$/i.test(p)).join(', ');
    openSheet(`<h1>Change book</h1><div class="mute small">${esc(s.name || code)} · ${esc(code)}${cur ? ' · now ' + esc(cur) : ''}</div>
<label>New book</label><input id="cbB" class="in-t" placeholder="e.g. REF" value="" autocomplete="off">
<div class="gx-c" style="margin-top:6px">${SUG.map(b => `<button type="button" onclick="$('cbB').value='${b}'">${b}</button>`).join('')}</div>
<label>From</label><input id="cbD" class="in-t" type="date" value="${today()}">
<div class="small mute" style="margin-top:8px">Every class from this day on gets the new book, until you change it again. No class is added, moved or removed. Earlier classes keep the old book.</div>
<button class="btn block" id="cbGo" style="margin-top:16px" onclick="cbSend('${esc(code)}')">Change the book</button>`);
    setTimeout(() => { const i = $('cbB'); if(i) i.focus(); }, 250); };
  window.cbSend = async function(code){ const b = ($('cbB').value || '').trim(), d = $('cbD').value; if(!b) return toast('Write the new book');
    const btn = $('cbGo'); if(btn){ btn.disabled = true; btn.textContent = 'Changing…'; }
    try{ const r = await api('mgmtSetBook', TOKEN, code, b, d); if(!r || !r.ok) throw r;
      closeSheet(); toast(r.n ? `${r.n} upcoming class${r.n === 1 ? '' : 'es'} now ${r.book}${r.first ? ' · from ' + r.first : ''}` : (r.same ? 'The upcoming classes already use ' + r.book : 'No upcoming classes found from that day'));
      try{ if(STU && STU.code === code && STU.s){ STU.s.book = r.book; stuRender(); } }catch(e){}
    }catch(e){ if(btn){ btn.disabled = false; btn.textContent = 'Change the book'; } toast((e && (e.msg || e.error)) || 'Not changed · check your internet and try again'); } };
  const sr0 = window.stuRender; if(sr0) window.stuRender = function(){ const r = sr0.apply(this, arguments);
    try{ if(D && D.mgr && STU && STU.code && !$('cbBtn')){ const row = document.querySelector('#sheetBody .row.noprint'); if(row) row.insertAdjacentHTML('beforeend', `<button class="btn ghost sm" id="cbBtn" onclick="cbOpen('${esc(STU.code)}')">Change book</button>`); } }catch(e){}
    return r; };
})();
