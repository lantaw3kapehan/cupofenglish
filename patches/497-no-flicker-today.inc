/* 21 Oct · 497 · Misty: "check for flickering screen too or related problems".
   Found: teacher Today was redrawn whole several times in the first seconds (cached data, fresh data, messages, reminders, pay check,
   leave, Excellence…), often with nothing new; each redraw also re-ran the screen's finishing touches a moment later, closed any note
   or day the teacher had opened, and could move the scroll. Same pattern on any screen that shows saved data first and fresh data after.
   · Everywhere: when the fresh copy is exactly the saved copy, the screen is not drawn a second time.
   · Teacher Today: a redraw with the same data in the same minute is skipped; redraws that arrive together are merged (the first at once,
     the rest once after 300 ms); the scroll position, opened "Last class" notes and opened sections are kept across a redraw.
   A tap that changes something still redraws at once. */
(function(){
  // 1 · swr: no second paint when nothing changed
  try{ const S0 = window.swr; if(typeof S0 === 'function') window.swr = swr = async function(k, call, set, paint){
    const old = kept(k); let oj = null; if(old){ set(old); paint(); homeSoon(); try{ oj = JSON.stringify(old); }catch(e){} }
    try{ const v = await call(); set(v); keep(k, v); let same = false; try{ same = oj != null && JSON.stringify(v) === oj; }catch(e){} if(!same){ paint(); homeSoon(); } return v; }
    catch(e){ if(!old) throw e; } }; }catch(e){ console.warn('swr97', e); }

  // 2 · teacher Today
  const base = window.renderToday; if(!base) return;
  const J = x => { try{ return JSON.stringify(x); }catch(e){ return String(Math.random()); } };
  const hash = s => { let h = 0; for(let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return h + ':' + s.length; };
  const G = n => { try{ return window[n] !== undefined ? window[n] : eval('typeof ' + n + ' !== "undefined" ? ' + n + ' : null'); }catch(e){ return null; } };
  const sig = () => hash(J([Math.floor(Date.now() / 6e4), G('D'), G('TLV'), G('MYR'), G('PCK'), G('FB'), G('TMSG'), G('REM'), G('GR') && (G('GR').evals || []).length, window._KX && window._KX.at,
    (typeof Notification !== 'undefined' ? Notification.permission : ''), (() => { try{ return chimeOn(); }catch(e){ return ''; } })()]));
  let last = '', lastAt = 0, t = 0, userAt = 0;
  ['click', 'keydown', 'touchend'].forEach(ev => addEventListener(ev, () => { userAt = Date.now(); }, true));
  function keepState(){ const v = document.getElementById('v-today'); if(!v) return null;
    return { y: window.scrollY, notes: [...v.querySelectorAll('.cls .note.open')].map(n => { const b = n.closest('.cls') && n.closest('.cls').querySelector('[onclick^="classBrief("]'); return b ? b.getAttribute('onclick') : ''; }).filter(Boolean),
      det: [...v.querySelectorAll('details[open] > summary')].map(s => s.textContent.trim().slice(0, 40)) }; }
  function putState(s){ const v = document.getElementById('v-today'); if(!v || !s) return;
    s.notes.forEach(on => { const b = v.querySelector('[onclick="' + on.replace(/"/g, '\\"') + '"]'), n = b && b.closest('.cls') && b.closest('.cls').querySelector('.note'); if(n) n.classList.add('open'); });
    v.querySelectorAll('details > summary').forEach(sm => { if(s.det.includes(sm.textContent.trim().slice(0, 40))) sm.parentNode.open = true; });
    if(Math.abs(window.scrollY - s.y) > 2) window.scrollTo(0, s.y); }
  function run(args){ const teacher = !!(typeof D !== 'undefined' && D && !D.mgr), v = document.getElementById('v-today');
    if(teacher){ const s = sig(); if(s === last && v && v.children.length && Date.now() - userAt > 1500) return; last = s; }
    lastAt = Date.now(); const st = teacher ? keepState() : null; const r = base.apply(this, args); if(st){ putState(st); setTimeout(() => putState(Object.assign({}, st, { y: window.scrollY })), 380); } return r; }
  window.renderToday = renderToday = function(){ const args = arguments, now = Date.now();
    if(!(typeof D !== 'undefined' && D && !D.mgr) || now - userAt < 1500 || now - lastAt > 300){ clearTimeout(t); return run(args); }
    clearTimeout(t); t = setTimeout(() => { try{ run(args); }catch(e){ console.warn('td97', e); } }, 300); };
})();
