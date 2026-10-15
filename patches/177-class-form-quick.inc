(function(){
  // 15 Oct · New class, opened for a student (Misty: "when opening their name, can this be improved"):
  //  · title says who: "New class · Jun";
  //  · Quick pick: the next 14 days as chips — the student's usual days in teal, days already booked show the time
  //    (dimmed); one tap fills the date + the usual time (a single class, e.g. a make-up);
  //  · a live check under the date: time already passed / the student already has a class then / teacher busy then.
  const css = `#cQP{margin-top:12px}#cQP>b{display:block;font-size:12px;letter-spacing:.06em;text-transform:uppercase;color:#8A87A0;margin-bottom:6px}
#cQP .qp{display:flex;gap:6px;overflow-x:auto;padding-bottom:4px;scrollbar-width:thin}
#cQP button{all:unset;cursor:pointer;flex:none;min-width:58px;text-align:center;padding:7px 8px;border-radius:12px;background:#fff;border:1.5px solid #EEF0F4;font-size:12px;color:#4C4868;line-height:1.25}
#cQP button b{display:block;font-family:var(--brand);font-weight:400;font-size:17px;color:#2B2253}
#cQP button.u{border-color:#00A3AD;background:#F2FBFB}#cQP button.bk{opacity:.5}#cQP button.on{background:#2B2253;border-color:#2B2253;color:#fff}#cQP button.on b{color:#fff}
#cWarn{margin-top:8px;font-size:13px;padding:8px 12px;border-radius:10px;background:#FBEAE5;color:#A1452F}#cWarn.ok{background:#E3F4EC;color:#1C6B4C}`;
  const st = document.createElement('style'); st.id = 'cqpcss'; st.textContent = css; document.head.appendChild(st);
  const DN = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const evs = code => ((CLSM && CLSM[code]) || []).filter(e => !e.cancelled);
  window.cqpPick = function(d){ const h = CHIST; $('cD').value = d; if(h && h.time){ if(![...$('cH').options].some(o => o.value === h.time)){ const o = document.createElement('option'); o.value = o.textContent = h.time; $('cH').appendChild(o); } $('cH').value = h.time; }
    if($('cR') && $('cR').checked){ $('cR').checked = false; $('cRep').classList.add('hide'); }
    document.querySelectorAll('#cQP button').forEach(b => b.classList.toggle('on', b.dataset.d === d)); classPrev(); };
  function chips(s){ const el = $('cHist'); if(!el || !s) return; const old = $('cQP'); if(old) old.remove();
    const h = CHIST && CHIST.code === s.code ? CHIST : null, E = evs(s.code), by = {};
    E.forEach(e => { const d = ymdLocal(new Date(e.start)); (by[d] = by[d] || []).push(tm(e.start)); });
    const t0 = new Date(); t0.setHours(12, 0, 0, 0); let out = '';
    for(let k = 0; k < 14; k++){ const x = new Date(t0); x.setDate(t0.getDate() + k); const d = ymdLocal(x), u = h && h.days.includes(x.getDay()), b = by[d];
      out += `<button type="button" data-d="${d}" class="${u ? 'u' : ''}${b ? ' bk' : ''}" onclick="cqpPick('${d}')" title="${b ? 'Booked ' + b.join(', ') : u ? 'Usual day' : ''}">${k === 0 ? 'Today' : k === 1 ? 'Tmrw' : DN[x.getDay()]}<b>${x.getDate()}</b>${b ? esc(b[0]) : u ? 'usual' : '&nbsp;'}</button>`; }
    el.insertAdjacentHTML('afterend', `<div id="cQP"><b>Quick pick · one class${h && h.time ? ' at ' + esc(h.time) : ''}</b><div class="qp">${out}</div></div>`); }
  const _ch = window.classHist;
  window.classHist = async function(s){ const r = await _ch.apply(this, arguments); try{ const s2 = classStu(); if(s2 && s && s2.code === s.code && !s2.fresh) chips(s); }catch(e){} return r; };
  const _cp = window.classPrev;
  window.classPrev = function(){ const r = _cp.apply(this, arguments);
    try{ const D0 = $('cD'), H = $('cH'), s = classStu(); let w = $('cWarn'); if(!D0 || !H) return r;
      const row = D0.closest('.row'); if(!w && row){ row.insertAdjacentHTML('afterend', '<div id="cWarn" class="hide"></div>'); w = $('cWarn'); } if(!w) return r;
      const d = D0.value, t = H.value, rep = $('cR') && $('cR').checked; let msg = '', ok = '';
      document.querySelectorAll('#cQP button').forEach(b => b.classList.toggle('on', b.dataset.d === d && !rep));
      if(d && t){ const st0 = new Date(d + 'T' + t + ':00'), mins = +($('cM') || {}).value || 25, en0 = new Date(st0.getTime() + mins * 6e4);
        if(!rep && st0 < new Date()) msg = '⚠ ' + t + ' on this day has already passed';
        else if(s){ const clash = evs(s.code).find(e => new Date(e.start) < en0 && new Date(e.end) > st0); if(clash) msg = '⚠ ' + esc(s.name) + ' already has a class then · ' + tm(clash.start) + '–' + tm(clash.end) + (clash.teacher ? ' with ' + esc(tName(clash.teacher)) : ''); }
        if(!msg){ const T = ($('cT') || {}).value, all = Object.values(SCC || {}).flatMap(c => (c && c.events) || []);
          const busy = T && all.find(e => !e.cancelled && String(e.teacher || '').toLowerCase() === T.toLowerCase() && new Date(e.start) < en0 && new Date(e.end) > st0 && !(s && String(e.code || '').toUpperCase() === s.code));
          if(busy) msg = '⚠ ' + esc(tName(T)) + ' is teaching then · ' + esc(busy.student || busy.title || '') + ' ' + tm(busy.start) + '–' + tm(busy.end);
          else if(!rep && s && !s.fresh) ok = '✓ ' + new Date(d + 'T12:00:00').toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short' }) + ' · ' + t + ' is free' + (T ? ' for ' + esc(tName(T)) : ''); } }
      w.className = msg ? '' : ok ? 'ok' : 'hide'; w.innerHTML = msg || ok;
    }catch(e){ console.warn('class check', e); }
    return r; };
  const _cf = window.classForm;
  window.classForm = async function(code){ const r = await _cf.apply(this, arguments);
    try{ const s = code && SL && SL.students.find(x => x.code === code), h1 = $('sheetBody') && $('sheetBody').querySelector('h1'); if(s && h1 && /^New class$/.test(h1.textContent)) h1.textContent = 'New class · ' + s.name; }catch(e){}
    return r; };
})();
