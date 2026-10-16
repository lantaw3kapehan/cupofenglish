/* 16 Oct · 242 · a saved meeting ID stays on the screen. It used to jump back to the old one (or "+ Meeting ID") when the
   schedule was read again before Google had written it (about a minute), so the teacher typed it again. Kept here for 15 min. */
(function(){
  const K = 'coe.meetp'; let P = {};
  try{ P = JSON.parse(localStorage.getItem(K) || '{}') || {}; }catch(e){ P = {}; }
  const keep = () => { try{ localStorage.setItem(K, JSON.stringify(P)); }catch(e){} };
  function mpApply(){
    if(typeof D === 'undefined' || !D || !D.schedule) return; const now = Date.now(); let ch = false;
    Object.keys(P).forEach(code => { const p = P[code];
      if(!p || !(p.until > now)){ delete P[code]; ch = true; return; }
      D.schedule.forEach(x => { if(x.code === code && String(x.meet || '').replace(/\D/g, '') !== p.v) x.meet = p.v; }); });
    if(ch) keep();
  }
  if(typeof render === 'function'){ const r0 = render; render = function(){ try{ mpApply(); }catch(e){} return r0.apply(this, arguments); }; }
  if(typeof api === 'function'){ const a0 = api; api = async function(fn){
    if(fn !== 'tSetMeet') return a0.apply(this, arguments);
    const code = String(arguments[2] || ''), v = String(arguments[3] || '').replace(/\D/g, '');
    if(code && v){ P[code] = { v: v, until: Date.now() + 15 * 60000 }; keep(); }
    let r; try{ r = await a0.apply(this, arguments); }catch(e){ delete P[code]; keep(); throw e; }
    if(!r || !r.ok){ delete P[code]; keep(); }
    return r;
  }; }
})();
