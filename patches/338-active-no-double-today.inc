/* 19 Oct · 338 · Lessons left: today's classes are never counted twice.
   The ACTIVE records already count the day's classes (Mia ST-2024-148: October 2.5 = 5, 9, 12, 16 and 19 Oct, same as her video folder).
   Google's Active answer (used when the database is slow) adds "classes ended today" (liveGap_) on top → 33.5 used / 4 left instead of 33 / 4.5.
   Every Active answer, from Google or the database, is set back to the records: used − today, left + today, this month − today. */
(function(){
  const r1 = x => Math.round(x * 10) / 10;
  function fix(v){ try{ if(!v || !Array.isArray(v.cols) || !Array.isArray(v.rows)) return v; const C = {}; v.cols.forEach((c, i) => C[c] = i); if(C.today == null) return v;
      v.rows.forEach(r => { const t = +r[C.today] || 0; if(!(t > 0)) return;
        if(C.finished != null && r[C.finished] !== '' && r[C.finished] != null) r[C.finished] = r1(+r[C.finished] - t);
        if(C.available != null && r[C.available] !== '' && r[C.available] != null) r[C.available] = r1(+r[C.available] + t);
        if(C.months != null && Array.isArray(r[C.months]) && r[C.months].length){ const k = r[C.months].length - 1; if(+r[C.months][k] >= t) r[C.months][k] = r1(+r[C.months][k] - t); }
        r[C.today] = 0; }); }catch(e){} return v; }
  window.coeFixActive = fix;
  const _api = api; api = function(fn, ...a){ const p = _api(fn, ...a); return fn === 'mgmtActive' ? Promise.resolve(p).then(fix) : p; };
  const _ra = window.renderActive; if(_ra) window.renderActive = function(){ try{ if(typeof AT !== 'undefined' && AT) fix(AT); }catch(e){} return _ra.apply(this, arguments); };
  try{ if(typeof AT !== 'undefined' && AT) fix(AT); }catch(e){}
  try{ const k = typeof kept === 'function' && kept('active'); if(k) fix(k); }catch(e){}
})();
