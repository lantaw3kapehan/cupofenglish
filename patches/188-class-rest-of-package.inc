/* 15 Oct · Weekly package: book the rest of the student's package in one go.
   Lessons left (Students list) − classes already booked ahead = classes still to book; the number is filled in and the
   last date shown, so a schedule stretches to the end of the package (e.g. Ying · 13 left → every Sunday until January). */
function classRest(){ try{
  const s = classStu(); if(!s || s.left == null || s.shared) return null;
  const now = Date.now(), L = (CLSM && CLSM[s.code]) || [];
  const booked = L.filter(e => !e.cancelled && new Date(e.start).getTime() >= now && !/(^|-)\s*(TC|SC)\s*$/i.test(String(e.title || '').replace(/\s+X$/i, '')) && !/trial/i.test(e.title || ''))
    .reduce((a, e) => a + ((new Date(e.end) - new Date(e.start)) / 6e4 <= 30 ? 0.5 : 1), 0);
  return { left: +s.left, booked, rest: Math.max(0, Math.round((+s.left - booked) * 2) / 2), name: s.name };
}catch(e){ return null; } }
(function(){
  const base = window.classPrev;
  window.classPrev = function(){
    const r = base.apply(this, arguments);
    try{
      const el = $('cRest'); if(!el) return r; const R = classRest();
      if(!R){ el.innerHTML = ''; return r; }
      const D = classDates(), last = D.length > 1 ? D[D.length - 1] : '';
      const m = +(($('cM') || {}).value) || 50, n = Math.round(R.rest * 50 / m);
      el.innerHTML = '<div class="mini" style="background:var(--tint)"><b>' + esc(R.name) + ' · ' + R.left + ' lesson' + (R.left === 1 ? '' : 's') + ' left</b>' +
        (R.booked ? ' · ' + R.booked + ' already booked' : '') + ' → <b>' + R.rest + ' to book</b>' +
        (R.rest > 0 ? ' <button type="button" class="btn sm teal" style="margin-left:6px" onclick="classFill(' + R.rest + ')">Book the rest · ' + n + ' class' + (n === 1 ? '' : 'es') + '</button>' : '') +
        (last ? '<div class="small mute" style="margin-top:4px">With these days the last class is on <b>' + esc(fd(last)) + '</b></div>' : '') + '</div>';
    }catch(e){}
    return r;
  };
  const rep = window.classRep;
  window.classRep = function(){
    const r = rep.apply(this, arguments);
    try{ if($('cR').checked){ const R = classRest(); if(R && R.rest > 0) classFill(R.rest); } }catch(e){}
    return r;
  };
})();
