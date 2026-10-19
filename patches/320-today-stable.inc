/* 19 Oct · 320 · Today without jumping (Misty: "whenever I go to TODAY screen, it is moving adjusting the boxes, flickers before it becomes stable")
   Every redraw of Today is followed by several tidy-ups (0–600 ms: boxes grouped, duplicates removed, videos, names, Teacher of the Month).
   Now the last finished Today stays on screen while the new one is drawn and tidied underneath; after ~0.7 s it is swapped in at once. */
(function(){
  const HOLD = 700, MAX = 1600;
  let snap = null, tmr = 0, t0 = 0, last = '';
  function release(){ clearTimeout(tmr); const v = $('v-today');
    if(v){ v.style.opacity = ''; v.style.pointerEvents = ''; v.style.minHeight = ''; if(typeof VIEW !== 'undefined' && VIEW === 'today' && v.offsetParent !== null && !document.hidden) last = v.innerHTML; }
    if(snap){ snap.remove(); snap = null; } }
  function hold(){ const v = $('v-today'); if(!v || snap || v.offsetParent === null || document.hidden) return false;
    const html = last || (v.childElementCount ? v.innerHTML : '');
    if(!html){ snap = { remove(){} }; v.style.opacity = '0'; v.style.pointerEvents = 'none'; t0 = Date.now(); return true; }   // first draw: show it once it is tidy
    const par = v.parentNode; if(getComputedStyle(par).position === 'static') par.style.position = 'relative';
    const r = v.getBoundingClientRect(), pr = par.getBoundingClientRect();
    snap = document.createElement('div'); snap.className = v.className; snap.setAttribute('aria-hidden', 'true'); snap.innerHTML = html;
    snap.querySelectorAll('[id]').forEach(e => e.removeAttribute('id'));
    snap.style.cssText = `position:absolute;left:${r.left - pr.left + par.scrollLeft - par.clientLeft}px;top:${r.top - pr.top + par.scrollTop - par.clientTop}px;width:${r.width}px;margin:0;pointer-events:none;z-index:4`;
    par.insertBefore(snap, v);
    v.style.minHeight = Math.max(r.height, 200) + 'px'; v.style.opacity = '0'; v.style.pointerEvents = 'none'; t0 = Date.now(); return true; }
  const _rt = window.renderToday;
  window.renderToday = function(){ try{ if(typeof VIEW !== 'undefined' && VIEW === 'today') hold(); }catch(e){}
    const x = _rt.apply(this, arguments);
    try{ if(snap){ clearTimeout(tmr); tmr = setTimeout(release, Math.max(0, Math.min(HOLD, MAX - (Date.now() - t0)))); } else if(VIEW === 'today'){ clearTimeout(tmr); tmr = setTimeout(release, HOLD); } }catch(e){}
    return x; };
  const _go = window.go; window.go = function(v){ if(v !== 'today' && snap) release(); return _go.apply(this, arguments); };
  addEventListener('resize', () => { if(snap) release(); });
})();
