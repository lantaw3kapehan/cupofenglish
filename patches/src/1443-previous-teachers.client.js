/* 1443 · Previous teachers stay on the student (Misty 12:03: "for deactivated teachers I just want the record of that teacher to
   show on the student too, like Daniela … her history should still appear").
   A teacher who taught in the student's package but no longer has classes with them (or is deactivated) is shown last, with a
   subtle "(previous)" tag: student list, student page, lesson summary picture. Her lessons, notes and reports are untouched.
   "Current" = has an upcoming class with this student (database copy sys:tmap); deactivated = Team & access (1440) says inactive.
   The current teacher is now always first, so defaults that take the first teacher (new note, class note, reminders) pick her. */
(function(){
  if(window.PV43) return;
  const MGR = () => typeof D !== 'undefined' && D && D.mgr;
  const PV = window.PV43 = { tm: null, at: 0, off: {} };
  const lc = s => String(s || '').trim().toLowerCase(), up = s => String(s || '').trim().toUpperCase();
  try{ const k = JSON.parse(localStorage.getItem('coe.tmap43') || 'null'); if(k && k.tm) { PV.tm = k.tm; PV.at = k.at || 0; } }catch(e){}
  function offList(){ try{ const L = (window.AS40 && AS40.L) || (JSON.parse(store('get', 'coe.m.staff40') || 'null') || {}).L || []; const o = {}; L.forEach(p => { if(p.status !== 'active' && p.role === 'teacher') o[lc(p.name)] = 1; }); PV.off = o; }catch(e){} }
  offList();
  /* which of a student's teachers are previous ones */
  PV.prev = function(code, names){
    const tm = PV.tm && PV.tm[up(code)], L = (names || []).map(String).filter(Boolean); if(!L.length) return [];
    let cur = {};
    if(tm){ Object.keys(tm).forEach(t => { if(tm[t] && tm[t].next) cur[t] = 1; });
      if(!Object.keys(cur).length){ let best = ''; Object.keys(tm).forEach(t => { const l = String((tm[t] || {}).last || ''); if(l > best){ best = l; cur = {}; cur[t] = 1; } else if(l && l === best) cur[t] = 1; }); } }
    const known = Object.keys(cur).length > 0 && L.some(n => cur[lc(n)]);
    return L.filter(n => PV.off[lc(n)] || (known && !cur[lc(n)]));
  };
  /* current teachers first; s.prev = the previous ones (the teachers list itself keeps every name) */
  PV.fix = function(s){ try{ if(!MGR() || !s || !s.code || !Array.isArray(s.teachers) || s.teachers.length < 1) return s; untag(s);
    const p = PV.prev(s.code, s.teachers), P = {}; p.forEach(n => P[lc(n)] = 1);
    if(p.length){ s.teachers = s.teachers.filter(n => !P[lc(n)]).concat(s.teachers.filter(n => P[lc(n)])); s.prev = p; } else if(s.prev) delete s.prev; }catch(e){} return s; };
  PV.fixAll = function(){ try{ if(typeof MS !== 'undefined' && Array.isArray(MS)) MS.forEach(PV.fix); }catch(e){} try{ if(typeof SL !== 'undefined' && SL && Array.isArray(SL.students)) SL.students.forEach(PV.fix); }catch(e){}
    try{ if(typeof STU !== 'undefined' && STU && STU.s) PV.fix(STU.s); }catch(e){} };
  /* while a screen draws, previous teachers read "Daniela (previous)"; the real list is put back right after */
  const TAG = ' (previous)';
  function withTags(list, fn){ const saved = []; (list || []).forEach(s => { if(s && Array.isArray(s.prev) && s.prev.length && Array.isArray(s.teachers) && s.prev.length < s.teachers.length){ const P = {}; s.prev.forEach(n => P[lc(n)] = 1); saved.push([s, s.teachers]); s.teachers = s.teachers.map(n => P[lc(n)] ? n + TAG : n); } });
    try{ return fn(); } finally { saved.forEach(([s, t]) => { s.teachers = t; }); untagAll(); } }
  /* a screen may copy the student while it draws: make sure no "(previous)" stays in the data */
  const untag = s => { try{ if(s && Array.isArray(s.teachers) && s.teachers.some(n => /\(previous\)$/.test(n))) s.teachers = s.teachers.map(n => String(n).replace(/ \(previous\)$/, '')); }catch(e){} };
  function untagAll(){ try{ if(typeof STU !== 'undefined' && STU) untag(STU.s); }catch(e){} try{ if(typeof MS !== 'undefined' && Array.isArray(MS)) MS.forEach(untag); }catch(e){} try{ if(typeof SL !== 'undefined' && SL && Array.isArray(SL.students)) SL.students.forEach(untag); }catch(e){} }
  function soften(root){ try{ if(!root) return; root.querySelectorAll('.chip.teal').forEach(c => { if(/\(previous\)$/.test(c.textContent) && !c.dataset.pv){ c.dataset.pv = 1; c.classList.remove('teal'); c.innerHTML = c.innerHTML.replace(/ \(previous\)$/, ' <span style="opacity:.7;font-weight:500">(previous)</span>'); } }); }catch(e){} }
  const _ras = window.renderAStudents;
  if(typeof _ras === 'function') window.renderAStudents = function(){ PV.fixAll(); const a = arguments, t = this; return withTags(typeof MS !== 'undefined' && Array.isArray(MS) ? MS : [], () => _ras.apply(t, a)); };
  const _sr = window.stuRender;
  if(typeof _sr === 'function') window.stuRender = function(){ PV.fixAll(); const a = arguments, t = this, s = (typeof STU !== 'undefined' && STU && STU.s) ? [STU.s] : [];
    const r = withTags(s, () => _sr.apply(t, a)); soften(document.getElementById('sheetBody')); return r; };
  /* lesson summary picture: the teacher cell */
  const tagCell = (code, html) => { try{ if(!MGR() || typeof html !== 'string' || !html) return html;
    const s = (typeof MS !== 'undefined' && Array.isArray(MS) ? MS : []).find(x => up(x.code) === up(code)), tm = (PV.tm && PV.tm[up(code)]) || {};
    const known = {}; ((s && s.teachers) || []).concat(Object.keys(tm)).forEach(n => known[lc(n)] = 1);
    let done = false;
    return html.replace(/(font-size:14px">)([^<]*(?:<br>[^<]*)*)(?=<div|<\/td>)/g, (m, a, T) => { if(done) return m;
      const names = T.split('<br>').map(x => x.trim()).filter(Boolean); if(!names.some(n => known[lc(n)])) return m; done = true;
      const P = {}; PV.prev(code, names).concat((s && s.prev) || []).forEach(n => P[lc(n)] = 1); if(!Object.keys(P).length || names.every(n => P[lc(n)])) return m;
      return a + names.map(n => P[lc(n)] ? n + ' <span style="font-weight:400;opacity:.65">(previous)</span>' : n).join('<br>'); }); }catch(e){ return html; } };
  const _ls = window.lsHtml; if(typeof _ls === 'function') window.lsHtml = function(code){ return tagCell(code, _ls.apply(this, arguments)); };
  const _sh = window.shHtml; if(typeof _sh === 'function') window.shHtml = function(code){ return tagCell(code, _sh.apply(this, arguments)); };
  /* data as it arrives */
  const _api = window.api;
  window.api = async function(fn){ const r = await _api.apply(this, arguments); try{ if(fn === 'mgmtStudents' && Array.isArray(r)) r.forEach(PV.fix); else if(fn === 'schedLists' && r && Array.isArray(r.students)) r.students.forEach(PV.fix); }catch(e){} return r; };
  /* the upcoming-classes map (refreshed every 10 minutes while open) */
  PV.load = async function(){ try{ if(!MGR() || !TOKEN) return; if(Date.now() - PV.at < 5 * 6e4 && PV.tm) return;
    const r = await fetch(FAST_URL, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ op: 'docs', token: TOKEN, keys: ['sys:tmap'] }) }).then(x => x.json());
    const d = r && r.ok && r.docs && r.docs['sys:tmap']; if(!d || !d.data || !d.data.tmap) return;
    const sig = JSON.stringify(d.data.tmap).length + '|' + d.at; const changed = sig !== PV.sig; PV.sig = sig; PV.tm = d.data.tmap; PV.at = Date.now();
    try{ localStorage.setItem('coe.tmap43', JSON.stringify({ tm: PV.tm, at: PV.at })); }catch(e){}
    offList();
    if(changed){ PV.fixAll(); try{ if(VIEW === 'astudents') renderAStudents(); }catch(e){} }
  }catch(e){} };
  PV.load(); setTimeout(() => PV.load(), 8000); setInterval(() => { if(document.visibilityState === 'visible') PV.load(); }, 10 * 6e4);
})();
