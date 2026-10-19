/* 19 Oct · 350 · Student page › "Change teacher" (Misty: Lewis from Teacher Julia to Teacher Mayi, new book).
   Keeps the student, his code, payments, lessons left and history. From the chosen date:
   1. every class of the old teacher moves to the new teacher (same day and time · database first, Google Calendar follows · a double booking is listed, never forced)
   2. the new book, if given, is set for the new teacher from that date (after Google has the moves, so the calendar titles stay right)
   3. reminds the one sheet step: a row for the new teacher right under the package row in ACTIVE (Enrolled empty), so her lessons come off the same package */
(function(){
  const SUG = ['REF', 'RE1', 'RE2', 'RE3', 'OD1', 'OD2', 'OD3', 'OD4', 'OD5', 'OD6', 'ODF1', 'Pathways1', 'Pathways2', 'TheAlphabet', 'ShortVowels', 'LongVowels', 'ConsonantBlends', 'LetterBlends', 'RazAa', 'RazA', 'RazB', 'RazC', 'WondersGK', 'WondersG1', 'WondersG2', 'Freetalk'];
  const cap = s => { s = String(s || '').trim(); return s ? s[0].toUpperCase() + s.slice(1) : s; };
  const d8 = iso => new Date(new Date(iso).getTime() + 8 * 3600e3), ymd = iso => d8(iso).toISOString().slice(0, 10), hm = iso => d8(iso).toISOString().slice(11, 16);
  const today = () => new Date(Date.now() + 8 * 3600e3).toISOString().slice(0, 10);
  let CT = null;
  function allTeachers(){ let L = []; try{ if(typeof SL !== 'undefined' && SL && SL.teachers) L = SL.teachers; else { const k = kept('sl2'); if(k && k.teachers) L = k.teachers; } }catch(e){}
    if(!L.length){ try{ L = (LV && LV.teachers) || []; }catch(e){} } return [...new Set(L.map(cap).filter(Boolean))].sort(); }
  function upcoming(){ const L = (STU && STU.code === CT.code && STU.cls) || []; return (Array.isArray(L) ? L : []).filter(c => c && !c.cancelled && c.start && !/-TC$/i.test(String(c.title || '').replace(/\s+X$/, ''))); }
  function moving(){ const f = CT.from || today(); return upcoming().filter(c => cap(c.teacher) === CT.old && ymd(c.start) >= f && new Date(c.end || c.start).getTime() > Date.now() - 6e4).sort((a, b) => a.start.localeCompare(b.start)); }
  function paint(){ const T = allTeachers().filter(t => t !== CT.old), olds = [...new Set(upcoming().filter(c => new Date(c.start).getTime() > Date.now()).map(c => cap(c.teacher)))].sort(), M = moving();
    openSheet(`<h1>Change teacher</h1><div class="mute small">${esc(CT.name)} · ${esc(CT.code)} · keeps the same student, code, lessons left and history</div>
${olds.length > 1 ? `<label>From which teacher</label><div class="gx-c" style="margin-top:6px">${olds.map(t => `<button type="button" style="${t === CT.old ? 'background:#2B2253;color:#fff' : ''}" onclick="ctSet('old','${esc(t)}')">Teacher ${esc(t)}</button>`).join('')}</div>` : `<div class="small" style="margin-top:8px">Now: <b>Teacher ${esc(CT.old || '—')}</b></div>`}
<label>New teacher</label><div class="gx-c" style="margin-top:6px">${T.map(t => `<button type="button" style="${t === CT.nw ? 'background:#2B2253;color:#fff' : ''}" onclick="ctSet('nw','${esc(t)}')">Teacher ${esc(t)}</button>`).join('')}</div>
<label>From</label><input id="ctD" class="in-t" type="date" value="${esc(CT.from || today())}" onchange="ctSet('from',this.value)">
<label>New book <span class="mute small">(optional · leave empty to keep the books)</span></label><input id="ctB" class="in-t" placeholder="e.g. OD1" value="${esc(CT.book || '')}" oninput="CT_book(this.value)" autocomplete="off">
<div class="gx-c" style="margin-top:6px">${SUG.map(b => `<button type="button" onclick="$('ctB').value='${b}';CT_book('${b}')">${b}</button>`).join('')}</div>
<div class="card" style="margin-top:12px;padding:10px 14px;background:#F6F5FA"><b>${M.length} class${M.length === 1 ? '' : 'es'}</b> with Teacher ${esc(CT.old || '—')} from ${esc(CT.from || today())} will move to <b>Teacher ${esc(CT.nw || '…')}</b> · same days and times${M.length ? `<div class="small mute" style="margin-top:4px">${M.slice(0, 6).map(c => esc(ymd(c.start).slice(5) + ' ' + hm(c.start) + (c.book ? ' · ' + c.book : ''))).join(' · ')}${M.length > 6 ? ' …' : ''}</div>` : ''}</div>
<button class="btn teal block" id="ctGo" style="margin-top:12px" onclick="ctRun()" ${CT.nw && M.length ? '' : 'disabled'}>Change to Teacher ${esc(CT.nw || '…')}</button>
<div class="small mute" style="margin-top:6px">Classes already taught stay with Teacher ${esc(CT.old || '—')} (her pay and records).</div>`); }
  window.CT_book = v => { CT.book = String(v || '').trim(); };
  window.ctSet = (k, v) => { if(k === 'from') CT.from = v; else CT[k] = v; const b = $('ctB'); if(b) CT.book = b.value.trim(); paint(); };
  window.ctOpen = function(code){ const s = (STU && STU.code === code && STU.s) || {}, now = Date.now();
    const nx = ((STU && STU.cls) || []).filter(c => c && !c.cancelled && new Date(c.start).getTime() > now).sort((a, b) => a.start.localeCompare(b.start));
    CT = { code, name: s.name || code, old: nx.length ? cap(nx[0].teacher) : cap(s.teacher), nw: '', from: today(), book: '' }; paint(); };
  async function waitGoogle(ids){ const end = Date.now() + 120e3; let left = ids.slice();
    while(left.length && Date.now() < end){ await new Promise(z => setTimeout(z, 4000)); const still = [];
      for(const id of left){ try{ const r = await fetch(FAST_URL + '-mgmt', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ op: 'writeStatus', id, token: TOKEN }) }).then(x => x.json()); if(!(r && r.ok && (r.status === 'done' || r.status === 'error'))) still.push(id); }catch(e){ still.push(id); } }
      left = still; const g = $('ctProg'); if(g) g.textContent = 'Google Calendar · ' + (ids.length - left.length) + ' of ' + ids.length + ' done'; }
    return left.length === 0; }
  window.ctRun = async function(){ const M = moving(), o = Object.assign({}, CT); if(!o.nw || !M.length) return;
    openSheet(`<h1>Changing to Teacher ${esc(o.nw)}…</h1><div class="small mute">${esc(o.name)} · ${M.length} classes · please keep this open</div><div class="card" style="margin-top:12px;padding:12px 14px"><div id="ctProg">Moving the classes · 0 of ${M.length}</div></div>`);
    const ids = [], clash = [], fail = []; let n = 0;
    for(const c of M){ const f = { action: 'move', start: c.start, date: ymd(c.start), time: hm(c.start), mins: Math.round((new Date(c.end) - new Date(c.start)) / 6e4) || 25, teacher: o.nw };
      try{ const r = await api('editClass', TOKEN, c.id, f); if(r && r.ok){ n++; if(r.queued) ids.push(r.queued); } else if(r && (r.conflict || /already has/i.test(String(r.msg || '')))) clash.push(ymd(c.start) + ' ' + hm(c.start) + ' · ' + (r.msg || 'double booking')); else fail.push(ymd(c.start) + ' ' + hm(c.start) + ' · ' + ((r && r.msg) || 'not saved')); }
      catch(e){ const m = String((e && (e.msg || e.error)) || 'not saved'); if(e && (e.conflict || /already has/i.test(m))) clash.push(ymd(c.start) + ' ' + hm(c.start) + ' · ' + m); else fail.push(ymd(c.start) + ' ' + hm(c.start) + ' · ' + m); }
      const g = $('ctProg'); if(g) g.textContent = 'Moving the classes · ' + (n + clash.length + fail.length) + ' of ' + M.length; }
    let bookMsg = '';
    if(o.book && n){ const g = $('ctProg'); if(g) g.textContent = 'Waiting for Google Calendar…'; const okG = await waitGoogle(ids);
      try{ const r = await api('mgmtSetBook', TOKEN, o.code, o.book, o.from, o.nw); bookMsg = r && r.ok ? '✓ Book ' + o.book + ' from ' + o.from + (okG ? '' : ' · Google Calendar is still catching up') : 'Book not changed · ' + ((r && (r.msg || r.error)) || 'use Change book'); }
      catch(e){ bookMsg = 'Book not changed · use Change book'; } }
    try{ delete CLSM[o.code]; store('del', 'coe.cls.' + o.code); }catch(e){}
    openSheet(`<h1>✓ ${esc(o.name)} · now with Teacher ${esc(o.nw)}</h1>
<div class="card" style="margin-top:10px;padding:12px 14px;background:#E3F4EC;border-color:#BFE3CF"><b>${n} class${n === 1 ? '' : 'es'} moved</b> from Teacher ${esc(o.old)} to Teacher ${esc(o.nw)} from ${esc(o.from)} · Google Calendar follows in a few seconds${bookMsg ? '<div style="margin-top:4px">' + esc(bookMsg) + '</div>' : ''}</div>
${clash.length ? `<div class="card" style="margin-top:10px;padding:12px 14px;background:#FFF4E5;border-color:#F3D48B"><b>Not moved · Teacher ${esc(o.nw)} already has a class then</b><div class="small" style="margin-top:4px">${clash.map(esc).join('<br>')}</div><div class="small mute" style="margin-top:4px">Move these one by one in Schedule (another time, or Save anyway).</div></div>` : ''}
${fail.length ? `<div class="card" style="margin-top:10px;padding:12px 14px;background:#FDECEA;border-color:#F3C9BD"><b>Not saved</b><div class="small" style="margin-top:4px">${fail.map(esc).join('<br>')}</div></div>` : ''}
<div class="card" style="margin-top:10px;padding:12px 14px"><b>One step in the sheet (ACTIVE)</b><div class="small" style="margin-top:4px">Add a row for <b>${esc(o.code)} · ${esc(o.name)} · Teacher ${esc(o.nw)}</b> right under his package row, with <b>Enrolled empty</b> (like Teacher Kat under Teacher Daniela). Then Teacher ${esc(o.nw)}'s lessons come off the same package and the lessons left stay right.</div></div>
<button class="btn block" style="margin-top:12px" onclick="closeSheet();openStudent('${esc(o.code)}')">Back to ${esc(o.name)}</button>`); };
  const sr1 = window.stuRender; if(sr1) window.stuRender = function(){ const r = sr1.apply(this, arguments);
    try{ const cb = $('cbBtn'); if(cb && !$('ctBtn') && D && D.mgr && STU && STU.code) cb.insertAdjacentHTML('afterend', `<button class="btn ghost sm" id="ctBtn" onclick="ctOpen('${esc(STU.code)}')">Change teacher</button>`); }catch(e){}
    return r; };
})();
