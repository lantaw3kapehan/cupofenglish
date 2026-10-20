/* 20 Oct · 383 · Weekly package with its own time per day (e.g. Elsa: Sat 15:30 and Sun 11:00), and more than one time on a day.
   Under "Weekly package" each chosen day gets a time row (it starts at the main Time); "+ time" adds a second class that day.
   Same time everywhere → the old single booking. Different times → one booking per time (days grouped), the classes are
   numbered in date order across all slots so the package total stays the same, and the parent picture lists each day's time. */
(function(){
  const WN = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'], WZ = '日一二三四五六', ord = d => (d + 6) % 7;
  const okT = t => /^([01]?\d|2[0-3]):[0-5]\d$/.test(String(t || '').trim());
  const pad = t => { t = String(t || '').trim(); return t.length === 4 ? '0' + t : t; };
  const css = document.createElement('style');
  css.textContent = '#cSlots{margin-top:10px;display:flex;flex-direction:column;gap:6px}#cSlots .sl{display:flex;align-items:center;gap:8px;padding:6px 8px;border-radius:12px;background:var(--tint,#F5F1EA)}#cSlots .sl b{width:40px;flex:none}#cSlots .sl select{flex:1;min-width:0;margin:0}#cSlots .sl .x{border:0;background:none;font-size:18px;line-height:1;color:#9A3B22;padding:4px 6px;cursor:pointer}#cSlots .sl .ad{border:0;background:none;color:var(--teal,#1F7A72);font-weight:600;font-size:13px;padding:4px 6px;cursor:pointer;white-space:nowrap}#cSlots .hint{font-size:12px;opacity:.75}';
  document.head.appendChild(css);

  /* the slot rows: [{d, time, own}] in week order (Mon first), then by time */
  function slots(){ return [...document.querySelectorAll('#cSlots .sl')].map(r => ({ d: +r.dataset.d, time: (r.querySelector('select') || {}).value || '', own: r.dataset.own === '1' })); }
  window.classSlots = function(){ if(!$('cR') || !$('cR').checked) return []; return slots().filter(x => okT(x.time)); };
  function mixed(){ const S = window.classSlots(); if(!S.length) return false; const T = new Set(S.map(x => pad(x.time))); const dd = new Set(S.map(x => x.d)); return T.size > 1 || dd.size !== S.length || pad(S[0].time) !== pad(($('cH') || {}).value); }
  window.classMixed = mixed;
  function row(d, time, own){ return '<div class="sl" data-d="' + d + '" data-own="' + (own ? 1 : 0) + '"><b>' + WN[d] + '</b>' + timeSel('cSl' + d + '_' + Math.random().toString(36).slice(2, 7), time || '', 'Time') +
    '<button type="button" class="ad" title="Another class on ' + WN[d] + '" onclick="classSlotAdd(' + d + ')">+ time</button>' +
    '<button type="button" class="x" title="Remove" onclick="classSlotDel(this)">×</button></div>'; }
  function wire(){ document.querySelectorAll('#cSlots .sl select').forEach(s => { if(s._w) return; s._w = 1; s.addEventListener('change', () => { s.closest('.sl').dataset.own = '1'; classPrev(); }); }); }
  function sortRows(){ const box = $('cSlots'); if(!box) return; const R = [...box.querySelectorAll('.sl')];
    R.sort((a, b) => ord(+a.dataset.d) - ord(+b.dataset.d) || String((a.querySelector('select') || {}).value || '99').localeCompare(String((b.querySelector('select') || {}).value || '99')));
    R.forEach(r => box.insertBefore(r, box.querySelector('.hint'))); }
  window.classSlotAdd = function(d){ const box = $('cSlots'); if(!box) return; const have = [...box.querySelectorAll('.sl[data-d="' + d + '"] select')].map(s => s.value).filter(Boolean).sort();
    let t = ''; if(have.length){ const [h, m] = pad(have[have.length - 1]).split(':').map(Number), mins = +(($('cM') || {}).value) || 50, x = h * 60 + m + Math.ceil(mins / 15) * 15; if(x < 24 * 60) t = String(Math.floor(x / 60)).padStart(2, '0') + ':' + String(x % 60).padStart(2, '0'); }
    box.querySelector('.hint').insertAdjacentHTML('beforebegin', row(d, t, 1)); wire(); sortRows(); classPrev(); };
  window.classSlotDel = function(btn){ const r = btn.closest('.sl'), d = r.dataset.d, box = $('cSlots'); r.remove();
    if(!box.querySelector('.sl[data-d="' + d + '"]')){ const b = document.querySelector('#cDays button[data-d="' + d + '"]'); if(b) b.classList.remove('on'); }
    classPrev(); };
  /* keep the rows in step with the day buttons and the main Time */
  function sync(){ const rep = $('cRep'); if(!rep) return; let box = $('cSlots');
    if(!box){ const days = $('cDays'); if(!days) return; days.insertAdjacentHTML('afterend', '<div id="cSlots"><div class="hint">Each day can have its own time · tap “+ time” for two classes on one day.</div></div>'); box = $('cSlots'); }
    const on = (typeof classDays === 'function' ? classDays() : []), main = (($('cH') || {}).value || '').trim();
    box.querySelectorAll('.sl').forEach(r => { if(on.indexOf(+r.dataset.d) < 0) r.remove(); });
    on.forEach(d => { if(!box.querySelector('.sl[data-d="' + d + '"]')) box.querySelector('.hint').insertAdjacentHTML('beforebegin', row(d, main, 0)); });
    box.querySelectorAll('.sl').forEach(r => { if(r.dataset.own !== '1'){ const s = r.querySelector('select'); if(s && main && s.value !== main){ if(![...s.options].some(o => o.value === main)) s.insertAdjacentHTML('beforeend', '<option value="' + main + '">' + main + '</option>'); s.value = main; } } });
    box.classList.toggle('hide', !on.length); const hn = box.querySelector('.hint'); if(hn) hn.classList.toggle('hide', !on.length);
    wire(); sortRows(); }

  /* all the class dates, in order, each with its slot time */
  function plan(){ const S = window.classSlots(), d0 = ($('cD') || {}).value, n = Math.max(1, Math.min(60, +($('cN') || {}).value || 1)), out = [];
    if(!S.length || !d0) return out; const by = {}; S.forEach(x => { (by[x.d] = by[x.d] || []).push(pad(x.time)); }); Object.values(by).forEach(a => a.sort());
    const d = new Date(d0 + 'T12:00:00'); for(let k = 0; out.length < n && k < 400; k++){ const x = new Date(d); x.setDate(d.getDate() + k); const T = by[x.getDay()]; if(!T) continue;
      for(const t of T){ if(out.length >= n) break; out.push({ day: ymdLocal(x), d: x.getDay(), time: t }); } }
    return out; }
  window.classPlan = plan;
  function groups(P){ const G = {}; P.forEach(p => { const g = G[p.time] = G[p.time] || { time: p.time, days: [], dates: [] }; if(g.days.indexOf(p.d) < 0) g.days.push(p.d); g.dates.push(p.day); });
    return Object.values(G).sort((a, b) => a.dates[0].localeCompare(b.dates[0]) || a.time.localeCompare(b.time)); }
  function label(P){ const seen = {}, L = []; P.forEach(p => { const k = p.d + '|' + p.time; if(!seen[k]){ seen[k] = 1; L.push(p); } });
    L.sort((a, b) => ord(a.d) - ord(b.d) || a.time.localeCompare(b.time));
    const by = {}; L.forEach(p => { (by[p.d] = by[p.d] || []).push(p.time); });
    const ks = Object.keys(by).map(Number).sort((a, b) => ord(a) - ord(b));
    return { en: ks.map(d => WN[d] + ' ' + by[d].join(' & ')).join(' and '), zh: ks.map(d => '周' + WZ[d] + ' ' + by[d].join('、')).join('，'), short: ks.map(d => WN[d] + ' ' + by[d].join('/')).join(' · ') }; }
  window.classSlotLabel = label;

  /* dates for the old code (count, last date): the real mixed list */
  const baseDates = window.classDates;
  window.classDates = function(){ try{ if(mixed()) return plan().map(p => p.day); }catch(e){} return baseDates.apply(this, arguments); };

  /* clash check for every time group */
  let MXK = '';
  const baseCk = window.ckRun;
  window.ckRun = function(q, elId, btnId){ try{ if(elId === 'cPrev' && mixed()){ const P = plan(), G = groups(P), tc = ($('cT') || {}).value || '', mins = +(($('cM') || {}).value) || 50;
      if(!tc || !G.length) return; const k = JSON.stringify([tc, mins, G]); if(MXK === k && CK.k === k){ if(CK.r) ckShow(elId, btnId); return; } MXK = k; CK = { k, r: null };
      clearTimeout(window.ckRun.t); window.ckRun.t = setTimeout(() => { Promise.all(G.map(g => api('classCheck', TOKEN, { teacher: tc, dates: g.dates, time: g.time, mins }).catch(() => null))).then(R => {
        if(CK.k !== k) return; const ok = R.filter(r => r && r.ok); if(!ok.length) return;
        CK.r = { ok: true, hours: ok.every(r => r.hours), issues: [].concat(...ok.map(r => r.issues || [])) }; ckShow(elId, btnId); }); }, 450); return; } }catch(e){}
    return baseCk.apply(this, arguments); };

  const basePrev = window.classPrev;
  window.classPrev = function(){ try{ sync(); }catch(e){}
    const r = basePrev.apply(this, arguments);
    try{ const el = $('cPrev'), old = $('cMx'); if(old) old.remove();
      if(el && mixed() && el.innerHTML){ const hv = esc((($('cH') || {}).value) || '--:--') + ' · '; if(el.innerHTML.indexOf('<br>' + hv) >= 0) el.innerHTML = el.innerHTML.replace('<br>' + hv, '<br>');   /* the main time is not every class's time */
        const P = plan(), L = label(P), fd = x => new Date(x + 'T12:00:00').toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
        if(P.length) el.insertAdjacentHTML('afterbegin', '<div id="cMx" style="margin-bottom:6px"><b>Every ' + esc(L.en) + '</b><div class="small">' + P.length + ' classes · first ' + esc(fd(P[0].day) + ' ' + P[0].time) + ' · last ' + esc(fd(P[P.length - 1].day) + ' ' + P[P.length - 1].time) + '</div></div>'); }
      const b = $('cGo'), P = mixed() ? plan() : null; if(b && !b.disabled && P && P.length){ const any = /anyway$/.test(b.textContent); b.textContent = 'Add ' + P.length + ' classes to calendar' + (any ? ' anyway' : ''); }
    }catch(e){}
    return r; };

  /* add: one booking per time */
  const baseSend = window.sendClass;
  window.sendClass = async function(){
    if(!$('cR') || !$('cR').checked || !mixed()) return baseSend.apply(this, arguments);
    const s = classStu(); if(!s) return toast('Choose a student from the list');
    if(CKIND === 'SC') return toast('A substitute is for one class · untick Weekly package');
    const teacher = $('cT').value; if(!teacher) return toast('Choose a teacher');
    const bad = slots().find(x => !okT(x.time)); if(bad) return toast('Choose a time for ' + WN[bad.d]);
    const P = plan(); if(!P.length) return toast('Choose the start date');
    const G = groups(P), L = label(P), force = ckForce() || !!window.CFORCE;
    const base = { code: s.code, student: s.name, kind: CKIND, fresh: !!s.fresh, cn: s.fresh ? (($('cCn') || {}).value || '').trim() : '', book: $('cB').value, teacher, mins: $('cM').value, force };
    if(CKIND === 'TC' && CSRC){ if(CSRC === 'Student'){ classRefChk(); if(!CREF) return toast('Pick the referring student from the list'); if(CREF.code === s.code) return toast('A student cannot refer themselves'); Object.assign(base, { src: 'Student', refCode: CREF.code, refName: CREF.name }); } else Object.assign(base, { src: CSRC, partner: CSRC === 'Partner' ? (($('cPt') || {}).value || '').trim() : '' }); }
    const bk = 'c:' + s.code + '|mx|' + P[0].day; if(BUSY[bk]) return toast('Still adding these classes · wait a moment'); BUSY[bk] = 1;
    const body = $('sheetBody'), snap = body.innerHTML, vals = {}; body.querySelectorAll('input,select,textarea').forEach(el => { if(el.id) vals[el.id] = (el.type === 'checkbox' || el.type === 'radio') ? el.checked : el.value; });
    const who = esc(s.name || s.code), pk0 = '<b>' + who + '</b> · every ' + esc(L.en) + ' · ' + P.length + ' classes';
    closeSheet(); const pk = svPill(null, '⏳ Adding ' + pk0 + '…', 'wait');
    const done = [], fail = []; let first = null;
    for(let i = 0; i < G.length; i++){ const g = G[i];
      const f = Object.assign({}, base, { date: g.dates[0], time: g.time, days: g.dates.length > 1 ? g.days.slice() : [], count: g.dates.length });
      if(i > 0){ f.fresh = false; f.cn = ''; delete f.src; delete f.refCode; delete f.refName; delete f.partner; }   /* the new student row, the source and the referral are saved once */
      try{ svPill(pk, '⏳ Adding ' + pk0 + '<div class="small" style="opacity:.85">' + (i + 1) + ' of ' + G.length + ' · ' + esc(g.days.sort((a, b) => ord(a) - ord(b)).map(d => WN[d]).join(' & ') + ' ' + g.time) + '</div>', 'wait'); }catch(e){}
      try{ const r = await api('addClass', TOKEN, f); if(!r || !r.ok) throw r; done.push(g); if(!first) first = { f, r }; }
      catch(e){ fail.push({ g, msg: (e && e.msg) || 'Not added', conflict: !!(e && e.conflict) }); if(i === 0) break; }
    }
    delete BUSY[bk]; window.CFORCE = 0;
    const gl = g => esc(g.days.slice().sort((a, b) => ord(a) - ord(b)).map(d => WN[d]).join(' & ') + ' ' + g.time + ' · ' + g.dates.length + ' class' + (g.dates.length === 1 ? '' : 'es'));
    if(!done.length){   /* nothing saved: the form comes back as it was */
      openSheet(snap); Object.keys(vals).forEach(k => { const el = $(k); if(!el) return; if(el.type === 'checkbox' || el.type === 'radio') el.checked = vals[k]; else el.value = vals[k]; });
      try{ wire(); classPrev(); }catch(e){}
      const m = fail[0] ? fail[0].msg : 'Not added';
      svPill(pk, '✕ <b>Not added</b> · ' + esc(m) + '<div class="small" style="opacity:.85">Nothing was saved · your details are back in the form</div>', 'bad');
      try{ const g = $('cGo'); if(g){ g.disabled = false; g.insertAdjacentHTML('beforebegin', '<div id="cErr" class="mini" style="background:#FFF5F2;border:1px solid #E9B8AC;margin:10px 0"><b style="color:#9A3B22">Not added yet</b> · ' + esc(m) + (fail[0] && fail[0].conflict ? '<div style="margin-top:8px"><button type="button" class="btn sm coral" onclick="window.CFORCE=1;sendClass()">Add anyway</button></div>' : '') + '</div>'); } }catch(e){}
      return; }
    svPill(pk, (fail.length ? '⚠️ <b>Partly saved</b> · ' : '✓ <b>Saved in Google Calendar</b> · ') + pk0 +
      '<div class="small" style="opacity:.85">' + done.map(g => '✓ ' + gl(g)).concat(fail.map(x => '✕ ' + gl(x.g) + ' · ' + esc(x.msg))).join('<br>') + (fail.length ? '<br>Add the missing time again with Add class.' : '') + '</div>', fail.length ? 'bad' : 'ok');
    try{ ding('msg'); }catch(y){}
    CABS = ''; CSRC = ''; CREF = null;
    if(base.fresh && SL){ try{ SL.students.unshift({ code: s.code, name: s.name }); }catch(e){} }
    const ok = new Set(done.map(g => g.time)), dates = P.filter(p => ok.has(p.time)), L2 = label(dates);
    window._mxLbl = L2;
    const share = () => { try{ classShare(Object.assign({}, first.f, { time: dates[0].time }), Object.assign({}, first.r, { dates: dates.map(p => p.day), mins: +base.mins || 50 }), s); }catch(x){ closeSheet(); } finally { window._mxLbl = null; } };
    whenFree(share);
    try{ Object.keys(SCC).forEach(k => { SCC[k]._t = 0; }); const d0 = new Date(); d0.setHours(12, 0, 0, 0); const t = new Date(P[0].day + 'T12:00:00'); SC_OFF = Math.round((t - d0) / 864e5); loadSchedule(0); }catch(e){}
  };
})();
