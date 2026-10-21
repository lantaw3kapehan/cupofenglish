/* 21 Oct · 528 · To do "flickering is back, especially in Renewals due" and trial follow-ups still saying "Enrolling" (Elsa twice).
   Cause: two older helpers redrew To do on a timer by calling an inner copy of the screen, which skipped every later step
   (Enrolled check, duplicate removal, section icons, the quiet "Paused or not renewing" rows). The bare screen showed, then
   the steps were added again a moment later → flicker, and sometimes the bare version stayed (raw "Enrolling", Elsa twice).
   Now every redraw goes through the whole screen, and redraws close together are merged here, at the outside, once. */
(function(){
  const inner = window.renderMToday; if(!inner) return; let lastAt = 0, t = 0, userAt = 0;
  ['click', 'keydown', 'touchend'].forEach(ev => addEventListener(ev, () => { userAt = Date.now(); }, true));
  const go = a => { lastAt = Date.now(); return inner.apply(window, a); };
  window.renderMToday = function(){ const a = arguments, now = Date.now(); clearTimeout(t);
    if(now - userAt < 1500 || now - lastAt > 350) return go(a);
    t = setTimeout(() => { try{ go(a); }catch(e){ console.warn('528', e); } }, 350); };
})();
