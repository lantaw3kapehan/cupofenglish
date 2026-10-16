/* 16 Oct · Misty: Michael was put at 19:00 with Teacher Pam while 18:00 (right before her 18:30 class) was free, leaving a gap.
   So the app now points out the "best fit" times: free times right after or right before a teacher's class that day
   (5 min break kept), so her classes sit together with no gap.
   · Schedule › a teacher: best-fit times are marked ★ first in her open slots.
   · Add class / Move class: if the chosen time leaves a gap and a best-fit time is free, a note shows it with a
     "Use 18:00" button. It never blocks saving. */
(function(){
  if(typeof avDay !== 'function') return;
  document.head.insertAdjacentHTML('beforeend', '<style>.avf.avbest{background:#16BCB0;color:#fff;border-color:#16BCB0}.avf.avbest:hover{background:#0E9F95}.gapw{margin-top:8px;padding:8px 10px;border-radius:10px;background:#EAF8F6;color:#0B5F59}.gapw .btn{margin:6px 6px 0 0}</style>');
  const key = n => String(n || '').replace(/^teacher\s+/i, '').trim().toLowerCase(), MEM = {}, ASK = {}, BRK = 5 * 6e4, Q = 15 * 6e4;
  function avData(n){ const k = key(n); if(MEM[k]) return MEM[k]; let r = null;
    try{ r = kept('av:' + k); }catch(e){}
    if(!r || !r.days){ try{ const a = kept('avall'), t = a && (a.teachers || []).find(x => key(x.name) === k); if(t && t.days) r = { ok: true, days: t.days, busy: t.busy || [], from: a.from }; }catch(e){} }
    return r && r.days ? r : null; }
  function avLoad(n){ const k = key(n); if(!k || (ASK[k] && Date.now() - ASK[k] < 10 * 6e4)) return Promise.resolve(MEM[k] || null); ASK[k] = Date.now();
    return api('mgmtAvail', TOKEN, k.charAt(0).toUpperCase() + k.slice(1), 21).then(x => { if(x && x.ok){ MEM[k] = x; try{ keep('av:' + k, x); }catch(e){} return x; } return null; }).catch(() => null); }
  // free times on a day, and the best-fit ones (right after / right before one of the teacher's classes)
  function avFit(n, ymd, len, skip){ const k = key(n), r = avData(n); if(!r) return null; len = +len || 25; const L = len * 6e4;
    const d = new Date(ymd + 'T00:00:00'), w = (d.getDay() + 6) % 7, hours = String((r.days || [])[w] || '');
    const own = typeof SC !== 'undefined' && SC && SC.date === ymd ? SC.events.filter(e => !e.cancelled && key(e.teacher) === k).map(e => ({ s: e.start, e: e.end, who: e.student || '' })) : [];
    const seen = {}, busy = (r.busy || []).concat(own).map(b => ({ s: +new Date(b.s), e: +new Date(b.e), who: avWho(b.who) || String(b.who || '') }))
      .filter(b => { if(skip && b.s === skip) return false; if(seen[b.s + '-' + b.e]) return false; seen[b.s + '-' + b.e] = 1; return true; });
    const d1 = d.getTime(), d2 = d1 + 864e5, day = busy.filter(b => b.s >= d1 && b.s < d2).sort((a, b) => a.s - b.s);
    const A = { name: k, days: (r.days || []).concat(['', '', '', '', '', '', '']).slice(0, 7), busy: busy.map(b => ({ s: b.s, e: b.e, who: b.who })), from: r.from || ymd, len, wk: 0 };
    const save = AVD; AVD = A; let free = []; try{ free = avDay(d); } finally { AVD = save; }
    const blocks = hours === 'full' ? [] : hours.split(',').map(x => x.split('-')).filter(p => p.length === 2).map(p => p.map(t => { const [h, m] = t.split(':').map(Number), z = new Date(d); z.setHours(h, m || 0, 0, 0); return z.getTime(); }));
    const now = Date.now() + 30 * 6e4, ok = t => t >= now && blocks.some(b => t >= b[0] && t + L <= b[1]) && !busy.some(x => x.s < t + L && x.e > t);
    const best = {}; day.forEach(c => { const a = Math.ceil((c.e + BRK) / Q) * Q, b = Math.floor((c.s - L - BRK) / Q) * Q;
      if(ok(a) && !best[a]) best[a] = 'after ' + (c.who || 'a class') + ' (' + avT(c.s) + ')';
      if(ok(b) && !best[b]) best[b] = 'before ' + (c.who || 'a class') + ' (' + avT(c.s) + ')'; });
    const B = Object.keys(best).map(Number).sort((a, b) => a - b).map(t => ({ t, why: best[t] }));
    return { free, best: B, day, hours, len }; }
  // a chosen time that leaves a gap, when a best-fit time is free
  function gapOf(n, ymd, time, len, skip){ const x = avFit(n, ymd, len, skip); if(!x || !x.day.length || !x.best.length) return null;
    const [h, m] = time.split(':').map(Number), z = new Date(ymd + 'T00:00:00'); z.setHours(h, m, 0, 0); const t = z.getTime(), te = t + len * 6e4;
    const prev = x.day.filter(c => c.e <= t).pop(), next = x.day.find(c => c.s >= te);
    if((prev && t - prev.e <= Q) || (next && next.s - te <= Q)) return null;   /* already next to a class */
    const B = x.best.filter(b => b.t !== t); return B.length ? { B, prev, next } : null; }
  window.avData2 = avData; window.avLoad2 = avLoad; window.avFit = avFit;
  window.avUseTime = function(id, t){ const el = $(id); if(!el) return; if(![...el.options].some(o => o.value === t)){ const o = document.createElement('option'); o.value = o.textContent = t; el.appendChild(o); }
    el.value = t; el.dispatchEvent(new Event('input')); el.dispatchEvent(new Event('change')); if(id === 'cH'){ try{ classPrev(); }catch(e){} } toast('Time set to ' + t); };
  let EDIT = null; const _ep = ePrev; ePrev = function(e){ EDIT = e || null; return _ep.apply(this, arguments); };
  function hint(elId){ const el = $(elId); if(!el) return; const old = el.querySelector('.gapw'); if(old) old.remove();
    const c = elId === 'cPrev', g = id => (($(id) || {}).value || '').trim();
    const tc = g(c ? 'cT' : 'eT'), ymd = g(c ? 'cD' : 'eD'), time = g(c ? 'cH' : 'eH'), len = +g(c ? 'cM' : 'eM') || (c ? 50 : 25);
    if(!tc || !/^\d{4}-\d{2}-\d{2}$/.test(ymd) || !/^\d{1,2}:\d{2}$/.test(time)) return;
    const skip = !c && EDIT && key(EDIT.teacher) === key(tc) ? +new Date(EDIT.start) : 0;
    if(!avData(tc)){ avLoad(tc).then(r => { if(r) hint(elId); }); return; }
    const x = gapOf(tc, ymd, time, len, skip); if(!x) return;
    const gapTxt = x.prev && x.next ? 'between her ' + avT(x.prev.s) + ' and ' + avT(x.next.s) + ' classes' : x.prev ? 'after her ' + avT(x.prev.s) + ' class' : 'before her ' + avT(x.next.s) + ' class';
    el.insertAdjacentHTML('beforeend', `<div class="gapw"><b>💡 Better fit for Teacher ${esc(tc.charAt(0).toUpperCase() + tc.slice(1))}</b><div class="small">${esc(time)} leaves a gap ${esc(gapTxt)}. These times are free and keep her classes together:</div>${x.B.slice(0, 3).map(b => `<button type="button" class="btn sm teal" onclick="avUseTime('${c ? 'cH' : 'eH'}','${avT(b.t)}')">Use ${avT(b.t)}</button><span class="small">${esc(b.why)}</span> `).join('')}<div class="small mute" style="margin-top:4px">Or keep ${esc(time)} if the parent asked for it.</div></div>`); }
  const _ck = ckShow; ckShow = function(elId, btnId){ const r = _ck.apply(this, arguments); try{ if(D && D.mgr && (elId === 'cPrev' || elId === 'ePrev')) hint(elId); }catch(e){} return r; };
})();
