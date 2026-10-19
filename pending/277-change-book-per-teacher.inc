/* 19 Oct · 277 · Celine: Annie has Teacher Pam (OD1) and Teacher Julia (Long Vowels); changing the book for one changed both.
   Change book now asks whose classes change when the student has more than one teacher, and sends that teacher
   (server mgmtSetBook renames only that teacher's classes). One teacher: no question, as before. */
(function(){
  const SUG = ['REF', 'RE1', 'RE2', 'RE3', 'OD1', 'OD2', 'OD3', 'OD4', 'Pathways1', 'Pathways2', 'TheAlphabet', 'ShortVowels', 'LongVowels', 'ConsonantBlends', 'LetterBlends', 'RazAa', 'RazA', 'RazB', 'RazC', 'WondersGK', 'WondersG1', 'WondersG2', 'IELTSWriting', 'IELTSSpeaking', 'Freetalk'];
  const today = () => { const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
  let CB_T = '';
  function teachersOf(code){   // the teachers of the upcoming classes, with the book each one uses now
    const L = (STU && STU.code === code && STU.cls) || (typeof CLSM !== 'undefined' && CLSM[code]) || [], now = Date.now(), by = {};
    (Array.isArray(L) ? L : []).forEach(c => { if(!c || c.cancelled || !c.teacher || new Date(c.start).getTime() < now - 864e5) return;
      const k = String(c.teacher).trim(); if(!by[k] || new Date(c.start) < new Date(by[k].start)) by[k] = { name: k, book: c.book || '', start: c.start }; });
    return Object.keys(by).map(k => by[k]).sort((a, b) => a.name.localeCompare(b.name)); }
  window.cbPickT = function(n){ CB_T = n; document.querySelectorAll('#cbT button').forEach(b => { const on = b.dataset.t === n; b.style.background = on ? '#2B2253' : ''; b.style.color = on ? '#fff' : ''; }); };
  window.cbOpen = function(code){ const s = (STU && STU.code === code && STU.s) || {}, T = teachersOf(code); CB_T = T.length === 1 ? T[0].name : '';
    openSheet(`<h1>Change book</h1><div class="mute small">${esc(s.name || code)} · ${esc(code)}</div>
${T.length > 1 ? `<label>Whose classes?</label><div id="cbT" class="gx-c" style="margin-top:6px">${T.map(t => `<button type="button" data-t="${esc(t.name)}" onclick="cbPickT('${esc(t.name)}')">Teacher ${esc(t.name)}${t.book ? ' · ' + esc(t.book) + ' now' : ''}</button>`).join('')}</div>
<div class="small mute" style="margin-top:6px">Only that teacher's classes change. The other teacher keeps her book.</div>` : (T.length === 1 ? `<div class="small mute" style="margin-top:6px">Teacher ${esc(T[0].name)}${T[0].book ? ' · ' + esc(T[0].book) + ' now' : ''}</div>` : '')}
<label>New book</label><input id="cbB" class="in-t" placeholder="e.g. REF" value="" autocomplete="off">
<div class="gx-c" style="margin-top:6px">${SUG.map(b => `<button type="button" onclick="$('cbB').value='${b}'">${b}</button>`).join('')}</div>
<label>From</label><input id="cbD" class="in-t" type="date" value="${today()}">
<div class="small mute" style="margin-top:8px">Every class from this day on gets the new book, until you change it again. No class is added, moved or removed. Earlier classes keep the old book.</div>
<button class="btn block" id="cbGo" style="margin-top:16px" onclick="cbSend('${esc(code)}')">Change the book</button>`);
    window._cbMulti = T.length > 1; setTimeout(() => { const i = $('cbB'); if(i && !window._cbMulti) i.focus(); }, 250); };
  window.cbSend = async function(code){ const b = ($('cbB').value || '').trim(), d = $('cbD').value; if(!b) return toast('Write the new book');
    if(window._cbMulti && !CB_T) return toast('Choose whose classes change');
    const btn = $('cbGo'); if(btn){ btn.disabled = true; btn.textContent = 'Renaming the classes…'; }
    try{ const r = await api('mgmtSetBook', TOKEN, code, b, d, CB_T || ''); if(!r || !r.ok) throw r;
      closeSheet(); const who = CB_T ? ' · Teacher ' + CB_T : '';
      if(r.done === false) toast(`${r.book}${who} from ${r.from} · ${r.n} classes changed now, the rest within a few minutes`); else toast(r.n ? `${r.n} upcoming class${r.n === 1 ? '' : 'es'}${who} now ${r.book}${r.first ? ' · from ' + r.first : ''}` : (r.same ? 'The upcoming classes already use ' + r.book : 'No upcoming classes found from that day'));
      try{ if(STU && STU.code === code && STU.s && !window._cbMulti){ STU.s.book = r.book; stuRender(); } }catch(e){}
    }catch(e){ if(btn){ btn.disabled = false; btn.textContent = 'Change the book'; } toast((e && (e.msg || e.error)) || 'Not changed · check your internet and try again'); } };
})();
