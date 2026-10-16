/* 16 Oct · Misty: on Schedule, tapping a teacher also shows that teacher's open slots for the day shown, so a change or a new
   class can be placed without opening her open-slots page. Same open slots as the teacher's page (teaching hours minus the
   classes in the calendar, and minus the classes listed on this day). Tap a time to book it; "Whole week" opens her page. */
(function(){
  if(typeof avDay !== 'function' || typeof avBook !== 'function') return;
  document.head.insertAdjacentHTML('beforeend', '<style>.scav{margin:10px 0 4px;padding:12px 14px;border-radius:14px;background:var(--tint,#F2FAF9);border:1px solid #D5EFEC}.scav .avs{margin-top:8px}.scav .hd2{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.scav .hd2 b{font-size:15px}.scav .seg{margin:0}.scav .seg button{padding:3px 10px;font-size:12px}</style>');
  const AV = {}, ASK = {}; let LEN = 25;
  const key = n => String(n || '').replace(/^teacher\s+/i, '').trim().toLowerCase();
  function data(n){ const k = key(n); if(AV[k]) return AV[k];
    let r = null; try{ r = kept('av:' + k); }catch(e){}
    if(!r || !r.days){ try{ const a = kept('avall'); const t = a && (a.teachers || []).find(x => key(x.name) === k); if(t && t.days) r = { ok: true, days: t.days, busy: t.busy || [], from: a.from }; }catch(e){} }
    return r; }
  function fetchIt(n){ const k = key(n); if(ASK[k] && Date.now() - ASK[k] < 10 * 6e4) return; ASK[k] = Date.now();
    api('mgmtAvail', TOKEN, k.charAt(0).toUpperCase() + k.slice(1), 21).then(x => { if(!x || !x.ok) return; AV[k] = x; try{ keep('av:' + k, x); }catch(e){} if(VIEW === 'schedule' && SC_T && key(SC_T) === k) paint(); }).catch(() => {}); }
  function slots(n){ const r = data(n); if(!r) return null; const nm = key(n);
    const own = SC.events.filter(e => !e.cancelled && key(e.teacher) === nm).map(e => ({ s: e.start, e: e.end, who: e.student || '' }));
    const A = { name: nm.charAt(0).toUpperCase() + nm.slice(1), days: (r.days || []).concat(['', '', '', '', '', '', '']).slice(0, 7), busy: (r.busy || []).concat(own), from: r.from || SC.date, len: LEN, wk: 0 };
    const save = AVD; AVD = A; let out; try{ const d = new Date(SC.date + 'T00:00:00'); out = { A, t: avDay(d), hours: A.days[(d.getDay() + 6) % 7], far: d >= new Date(new Date(A.from + 'T00:00:00').getTime() + 21 * 864e5) }; } finally { AVD = save; }
    return out; }
  window.scAvBook = function(t){ const n = key(SC_T), x = slots(n); if(!x) return; AVD = x.A; avBook(t); };
  window.scAvLen = function(m){ LEN = m; paint(); };
  function box(){ if(!SC_T || !SC) return ''; const n = key(SC_T), T = 'Teacher ' + esc(n.charAt(0).toUpperCase() + n.slice(1)), x = slots(n); fetchIt(n);
    const dl = new Date(SC.date + 'T12:00:00').toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
    const head = `<div class="hd2"><b class="grow">${T} · open slots · ${esc(dl)}</b><div class="seg">${[25, 50].map(m => `<button type="button" class="${LEN === m ? 'on' : ''}" onclick="scAvLen(${m})">${m} min</button>`).join('')}</div><button class="btn ghost sm" onclick="avOpen('${esc(n)}')">Whole week</button></div>`;
    let body;
    if(!x) body = '<div class="small mute" style="margin-top:6px">Loading open slots…</div>';
    else if(x.far) body = '<div class="small mute" style="margin-top:6px">Open slots are worked out for the next 3 weeks only.</div>';
    else if(!x.hours) body = `<div class="small mute" style="margin-top:6px">Not teaching on this day (no teaching hours set) · <a onclick="avOpen('${esc(n)}')" style="cursor:pointer;text-decoration:underline">set hours</a></div>`;
    else if(x.hours === 'full' || !x.t.length) body = `<div class="small" style="margin-top:6px;color:#E0533D;font-weight:700">Fully booked${SC_OFF === 0 ? ' for the rest of today' : ''} · 已满</div>`;
    else body = `<div class="avs">${x.t.map(t => `<button type="button" class="avf" title="Book this slot" onclick="scAvBook(${t})">${avT(t)}</button>`).join('')}</div><div class="small mute" style="margin-top:6px">${x.t.length} open · teaching hours ${esc(String(x.hours).replace(/,/g, ', '))} · tap a time to book it</div>`;
    return `<div class="scav">${head}${body}</div>`; }
  function paint(){ const v = $('v-schedule'); if(!v) return; const old = v.querySelector('.scav'); if(old) old.remove(); if(!SC_T) return;
    const fl = [...v.querySelectorAll('.fl')].find(f => /teacher/i.test((f.querySelector('.lbl') || {}).textContent || '')); if(!fl) return;
    fl.insertAdjacentHTML('afterend', box()); }
  const base = window.renderSchedule;
  window.renderSchedule = function(){ const r = base.apply(this, arguments); try{ if(D && D.mgr) paint(); }catch(e){} return r; };
})();
