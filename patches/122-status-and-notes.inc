(function(){
  const LOG = {}, PN = {}, up = s => String(s || '').trim().toUpperCase();
  let BACK = null, PEND = null;
  const stName = () => { try{ const h = document.querySelector('#sheetBody .shero h1'); const t = h && h.firstChild ? String(h.firstChild.textContent || '').trim() : ''; if(t) return t; }catch(e){} return (STU && STU.s && STU.s.name) || (STU && STU.code) || ''; };
  const when = s => { const d = new Date(String(s).replace(' ', 'T') + ':00'); return isNaN(d) ? esc(s) : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) + (d.getFullYear() !== new Date().getFullYear() ? ' ' + d.getFullYear() : ''); };
  const logHtml = (L, n) => !L ? '<div class="sk"></div>' : !L.length ? '<div class="small mute">No notes yet.</div>' :
    L.slice(0, n).map(x => '<div class="mini" style="padding:8px 10px"><div class="row small" style="gap:6px;flex-wrap:wrap"><b>' + esc(x.status || 'Note') + '</b><span class="mute grow">' + when(x.at) + (x.by ? ' · ' + esc(x.by) : '') + '</span></div>' + (x.note ? '<div class="small" style="margin-top:2px;white-space:pre-line">' + esc(x.note) + '</div>' : '') + '</div>').join('') +
    (L.length > n ? '<div class="small mute" style="margin-top:4px">' + (L.length - n) + ' older · tap Update to see all</div>' : '');
  const lk = (code, key) => up(code) || String(key || '').toLowerCase();
  async function loadLog(code, key, note){ const k = lk(code, key); if(!k) return []; try{ const r = await api('mgmtStuLog', TOKEN, up(code), Object.assign({ key: key || '' }, note || {})); if(r && r.ok){ let L = r.log || []; if(note && note.note && !L.some(y => y.note === note.note)) return []; PN[k] = (PN[k] || []).filter(x => Date.now() - x.t < 120000); LOG[k] = PN[k].filter(x => !L.some(y => y.note === x.note)).concat(L); return LOG[k]; } }catch(e){} return LOG[k] || []; }

  // ── under both cards (trial follow-up · renewal status): a bigger note box, "Save note only" and the history ──
  function addOn(code, key, name, stage, noteId){ const b = $('sheetBody'); if(!b) return;
    const n = $(noteId); if(n && n.tagName === 'INPUT'){ const t = document.createElement('textarea'); t.id = n.id; t.className = n.className; t.rows = 2; t.placeholder = n.placeholder; t.maxLength = 500; n.replaceWith(t); }
    const btn = [...b.querySelectorAll('button.btn.block')].find(x => x.textContent.trim() === 'Save');
    if(btn) btn.insertAdjacentHTML('afterend', '<button class="btn ghost block" style="margin-top:8px" id="stNo">Save note only · status stays</button>');
    b.insertAdjacentHTML('beforeend', '<h3 style="margin:16px 0 6px">History</h3><div id="stLog">' + logHtml(LOG[lk(code, key)], 10) + '</div>');
    const nb = $('stNo'); if(nb) nb.onclick = async () => { const v = (($(noteId) || {}).value || '').trim(); if(!v) return toast('Type the note first');
      const k = lk(code, key), me = (D && D.me && D.me.name) || '', bk = BACK || (stage === 'student' && RNS && RNS.back) || null; BACK = null;
      const it = { at: ymdLocal(new Date()) + ' ' + new Date().toTimeString().slice(0, 5), status: 'Note', note: v, by: me, t: Date.now() }; PN[k] = [it].concat(PN[k] || []); LOG[k] = [it].concat(LOG[k] || []);
      closeSheet(); toast('Note saved · ' + name); if(bk) setTimeout(bk, 80); paintBox();
      const L = await loadLog(code, key, { note: v, name: name, stage: stage }); if(!L.some(y => y.note === v)){ PN[k] = (PN[k] || []).filter(x => x !== it); LOG[k] = (LOG[k] || []).filter(x => x !== it); toast('Note not saved · check your internet and try again'); } paintBox(); };
    loadLog(code, key).then(L => { const el = $('stLog'); if(el) el.innerHTML = logHtml(L, 10); }); }
  const _fu = window.fuSheet; window.fuSheet = function(i){ BACK = PEND; PEND = null; const r = _fu.apply(this, arguments); try{ const s = FUS; if(s){ addOn(s.code, s.k, s.name, 'trial', 'fuN');
    if(s.code && !/Enrolling/.test(((TFU || {})[s.k] || {}).st || '')){ const h = document.querySelector('#sheet .rnl'); if(h) h.insertAdjacentHTML('beforebegin', '<button type="button" class="btn teal block" style="margin:12px 0 4px" onclick="enSheet(\'' + esc(s.code) + '\',\'' + esc(String(s.name).replace(/'/g, '')) + '\',\'' + esc(String(s.teacher || '').replace(/'/g, '')) + '\')">✓ Enrolled · paid · record the first package</button>'); } } }catch(e){} return r; };
  const _rn = window.renSheet; window.renSheet = function(code, name){ const r = _rn.apply(this, arguments); try{ addOn(code, '', name, 'student', 'rnN'); }catch(e){} return r; };
  const _fs = window.fuSave; window.fuSave = function(){ const bk = BACK; const p = _fs.apply(this, arguments); try{ if(bk && !$('fuN')){ BACK = null; setTimeout(bk, 80); } }catch(e){} return p; };

  // ── the Status box at the top of the student page (management) ──
  function stage(){ if(!STU) return ''; const code = up(STU.code);
    try{ if(AT && AT.cols && AT.rows){ const C = {}; AT.cols.forEach((c, i) => C[c] = i); const R = AT.rows.filter(x => up(x[C.code]) === code && x[C.enrolled] !== '');
      if(R.some(x => x[C.active] === true || x[C.active] === 'TRUE')) return 'active'; if(R.length) return 'finished'; return STU.r && STU.r.trial ? 'trial' : 'none'; } }catch(e){}
    return STU.s && STU.s.left != null ? 'active' : STU.r && STU.r.trial ? 'trial' : ''; }
  function tKey(){ const t = STU && STU.r && STU.r.trial; return t ? tfuKey(t.date, stName()) : ''; }
  function paintBox(){ const el = $('stuStat'); if(!el || !STU) return; const code = STU.code, st = stage(), key = st === 'trial' ? tKey() : '';
    let now = ''; if(st === 'trial'){ const f = (TFU || {})[key]; now = f ? esc(f.st) + (f.note ? ' · ' + esc(f.note) : '') : 'Trial done · no follow-up yet'; }
    else { const s = renSt(code); now = s.k ? esc(s.label) : st === 'active' ? 'Studying · no renewal news yet' : st === 'finished' ? 'Package finished' : ''; }
    const lbl = { trial: ['Trial', 'coral'], active: ['Active', 'green'], finished: ['Not active', ''], none: ['No package', ''] }[st] || ['', ''];
    const nm = esc(String(stName()).replace(/'/g, '')), tc = esc(String((STU.s.teachers || [])[0] || (STU.r.trial && STU.r.trial.teacher) || '').replace(/'/g, ''));
    el.innerHTML = '<h2>Status' + (lbl[0] ? ' <span class="chip ' + lbl[1] + '" style="font-size:11px;margin-left:6px">' + lbl[0] + '</span>' : '') + '</h2>' + (now ? '<div class="small" style="margin-bottom:8px"><b>' + now + '</b></div>' : '') +
      '<div class="row noprint" style="gap:8px;flex-wrap:wrap"><button class="btn sm teal" onclick="stOpen()">Update · add a note</button>' +
      (st === 'trial' || st === 'none' ? '<button class="btn sm ghost" onclick="enSheet(\'' + esc(code) + '\',\'' + nm + '\',\'' + tc + '\')">Enrolled · paid</button>' : '<button class="btn sm ghost" onclick="renPaidSheet(\'' + esc(code) + '\',\'' + nm + '\',\'' + tc + '\')">Renewed · paid</button>') + '</div>' +
      '<div style="margin-top:8px">' + logHtml(LOG[lk(code, key)], 3) + '</div>'; }
  window.stOpen = function(){ if(!STU) return; const st = stage(), nm = stName(), code = STU.code; PEND = () => openStudent(code);
    if(st === 'trial'){ const t = STU.r.trial; fuSheet({ k: tKey(), name: nm, code: code, teacher: t.teacher, date: t.date, t: t.teacher }); }
    else { PEND = null; BACK = null; renSheet(code, nm); RNS.back = () => openStudent(code); } };
  const _sr = window.stuRender; window.stuRender = function(){ const r = _sr.apply(this, arguments);
    try{ if(D && D.mgr && STU && !$('stuStat')){ const sch = $('stuSch'); if(sch){ sch.insertAdjacentHTML('beforebegin', '<section class="sec" id="stuStat"></section>'); paintBox();
      const code = STU.code, key = stage() === 'trial' ? tKey() : ''; loadLog(code, key).then(() => { if(STU && STU.code === code) paintBox(); }); } } }catch(e){} return r; };
  const _ra = window.renderActive; if(_ra) window.renderActive = function(){ const r = _ra.apply(this, arguments); try{ paintBox(); }catch(e){} return r; };
  const _rt = window.renderMToday; if(_rt) window.renderMToday = function(){ const r = _rt.apply(this, arguments); try{ paintBox(); }catch(e){} return r; };
})();
