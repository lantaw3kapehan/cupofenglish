/* 19 Oct · 326 · Renewal early warning (Misty: "do all")
   Active students who may not renew, before the package ends: few lessons left, deadline close, classes cancelled lately,
   nothing booked in the next 2 weeks, same book for 3+ months. Already Renewed / Renewing are left out; Paused and Not renewing are shown apart.
   Shown on Active (top panel + "At risk" filter) and as one line on Overview. Data: ACTIVE (mgmtActive) + class signals (coe_renew_signals). */
(function(){
  const post = (fn, args) => fetch(FAST_URL + '-mgmt', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ op: 'screen', fn, args: args || [], token: TOKEN }) }).then(x => x.json()).then(r => { if(!(r && r.ok)) throw new Error(fn); return r.data; });
  let SIG = null, SAT = 0, OPEN = false;
  try{ SIG = JSON.parse(localStorage.getItem('coe.rsig') || 'null'); }catch(e){}
  const isM = () => !!(typeof D !== 'undefined' && D && D.mgr && TOKEN);
  function loadSig(){ if(!isM() || Date.now() - SAT < 10 * 6e4) return; SAT = Date.now(); post('mgmtRenewSig').then(d => { SIG = d || {}; try{ localStorage.setItem('coe.rsig', JSON.stringify(SIG)); }catch(e){} paintAll(); }).catch(() => { SAT = 0; }); }
  const today = () => new Date(Date.now() + 8 * 3600e3).toISOString().slice(0, 10);
  const days = (a, b) => Math.round((Date.parse(b) - Date.parse(a)) / 864e5);
  function risks(){ const A = (typeof AT !== 'undefined' && AT) || (typeof kept === 'function' && kept('active')); if(!A || !A.cols || !SIG) return null;
    const C = {}; A.cols.forEach((c, i) => C[c] = i); const seen = {}, out = [], t = today();
    A.rows.forEach(r => { if(!r[C.active]) return; const code = String(r[C.code] || '').toUpperCase(); if(!/^ST-/.test(code) || seen[code]) return; seen[code] = 1;
      const rn = String((typeof REN === 'object' && REN && REN[code]) || ''); if(/^(Renewed|Renewing)/.test(rn)) return;
      const s = SIG[code] || {}, left = r[C.available] === '' ? null : +r[C.available], dl = String(r[C.deadline] || '').slice(0, 10), why = []; let sc = 0;
      if(left != null){ if(left <= 3){ sc += 40; why.push(left <= 0 ? 'no lessons left' : left + ' lesson' + (left === 1 ? '' : 's') + ' left'); } else if(left <= 8){ sc += 25; why.push(left + ' lessons left'); } }
      if(/^\d{4}-\d{2}-\d{2}$/.test(dl)){ const dd = days(t, dl); if(dd >= 0 && dd <= 21){ sc += 20; why.push('deadline in ' + dd + ' days'); } else if(dd < 0 && left > 0){ sc += 15; why.push('deadline passed'); } }
      if(s.c30 >= 2){ sc += Math.min(30, 10 * s.c30); why.push(s.c30 + ' classes cancelled in 30 days'); }
      if(!s.n14 && (left == null || left > 0)){ sc += 25; why.push(s.last ? 'nothing booked · last class ' + s.last.slice(5) : 'nothing booked'); }
      if(s.since && days(s.since, t) >= 90 && s.book){ sc += 10; why.push('same book (' + s.book + ') for ' + Math.round(days(s.since, t) / 30) + ' months'); }
      if(/^(Paused|Not renewing)/.test(rn)){ out.push({ code, name: r[C.name], cn: r[C.cn], teacher: r[C.teacher], left, sc: -1, why: [rn.split(' · ')[0]], rn }); return; }
      if(sc >= 30) out.push({ code, name: r[C.name], cn: r[C.cn], teacher: r[C.teacher], left, sc, why, rn }); });
    return out.sort((a, b) => b.sc - a.sc); }
  const lvl = x => x.sc < 0 ? ['', 'Paused / not renewing'] : x.sc >= 60 ? ['red', 'High'] : x.sc >= 40 ? ['amber', 'Medium'] : ['', 'Watch'];
  function rowH(x){ const [c, l] = lvl(x); return `<div class="li" onclick="openStudent('${esc(x.code)}')" style="cursor:pointer"><span class="chip ${c}" style="min-width:64px;text-align:center">${l}</span><div class="grow"><b>${esc(x.name || x.code)}</b> <span class="small mute">${esc(x.cn || '')} · ${esc(x.code)} · Teacher ${esc(tName(String(x.teacher || '').split(/\s*,\s*/)[0]))}</span><div class="small" style="color:#6b4e00">${esc(x.why.join(' · '))}</div>${x.rn && x.sc >= 0 ? `<div class="small mute">${esc(x.rn.split(' · ').slice(0, 2).join(' · '))}</div>` : ''}</div></div>`; }
  function panel(){ const v = $('v-active'); if(!v || VIEW !== 'active') return; const R = risks(); let p = $('rnWarn'); if(!R){ loadSig(); return; }
    const act = R.filter(x => x.sc >= 0), off = R.filter(x => x.sc < 0);
    if(!p){ p = document.createElement('section'); p.id = 'rnWarn'; p.className = 'card'; p.style.cssText = 'padding:12px 14px;margin:0 0 14px;border:1.5px solid #F2C46D'; const lead = v.querySelector('.lead'); if(lead) lead.after(p); else v.prepend(p); }
    p.innerHTML = `<div class="row" style="align-items:center;cursor:pointer" onclick="rnToggle()"><b class="grow">⚠ Renewal early warning · ${act.length} student${act.length === 1 ? '' : 's'}</b><span class="small mute">${OPEN ? 'Hide' : 'Show'}</span></div>
<div class="small mute">Act before the package ends: message the parent, offer the next book or a new schedule, then set the renewal status.</div>
${OPEN ? act.map(rowH).join('') + (off.length ? `<details style="margin-top:8px"><summary class="small">Paused or not renewing · ${off.length}</summary>${off.map(rowH).join('')}</details>` : '') : act.slice(0, 3).map(rowH).join('') + (act.length > 3 ? `<div class="small link" style="margin-top:6px" onclick="rnToggle()">Show all ${act.length}</div>` : '')}`; }
  window.rnToggle = () => { OPEN = !OPEN; panel(); };
  function home(){ const v = $('v-home'); if(!v || VIEW !== 'home') return; const R = risks(); if(!R){ loadSig(); return; } const act = R.filter(x => x.sc >= 0), hi = act.filter(x => x.sc >= 60).length;
    let p = $('rnHome'); if(!act.length){ if(p) p.remove(); return; }
    if(!p){ p = document.createElement('div'); p.id = 'rnHome'; p.className = 'card'; p.style.cssText = 'padding:10px 14px;margin:0 0 12px;cursor:pointer;border:1.5px solid #F2C46D'; const lead = v.querySelector('.lead'); if(lead) lead.after(p); else v.prepend(p); }
    p.onclick = () => { OPEN = true; go('active'); };
    p.innerHTML = `<b>⚠ ${act.length} student${act.length === 1 ? '' : 's'} may not renew</b>${hi ? ` <span class="chip red">${hi} high</span>` : ''} <span class="small mute">· ${esc(act.slice(0, 3).map(x => x.name || x.code).join(', '))}${act.length > 3 ? '…' : ''} · tap to see why</span>`; }
  function paintAll(){ try{ panel(); }catch(e){} try{ home(); }catch(e){} }
  const _ra = window.renderActive; if(_ra) window.renderActive = function(){ const x = _ra.apply(this, arguments); try{ loadSig(); panel(); }catch(e){} return x; };
  const _rh = window.renderHome; if(_rh) window.renderHome = function(){ const x = _rh.apply(this, arguments); try{ loadSig(); home(); }catch(e){} return x; };
  const _go = window.go; window.go = function(v){ const x = _go.apply(this, arguments); try{ if(v === 'active' || v === 'home') setTimeout(paintAll, 300); }catch(e){} return x; };
  setTimeout(() => { if(isM()){ loadSig(); paintAll(); } }, 4000);
})();
