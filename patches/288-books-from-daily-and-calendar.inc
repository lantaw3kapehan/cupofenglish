/* 19 Oct · 288 · Books (Misty: book changes are kept in the 2026 -DAILY tabs; Lily changed to OD2 today but the list still said OD1)
   1 · Students list: a book change already in the calendar shows next to the book now — "A1, OD1 → OD2 from 25 Oct"
       (coe_next_books: the last class taught vs. the classes booked; only a real switch, not two books taken in turn).
   2 · Student page · CEFR journey: the months come from the -DAILY tabs (coe_stu_daily: month, teacher, level, book, units),
       with the monthly records only for months the -DAILY tabs do not have. Drawn again when they arrive. */
(function(){
  const post = (fn, args) => fetch(FAST_URL + '-mgmt', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ op: 'screen', fn, args: args || [], token: TOKEN }) }).then(x => x.json()).then(r => { if(!(r && r.ok)) throw new Error(fn); return r.data; });
  let NB = null, NBat = 0, NBbusy = false;
  const dShort = d => { try{ return new Date(d + 'T12:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }); }catch(e){ return d; } };
  function mark(){ if(!NB || typeof MS === 'undefined' || !Array.isArray(MS)) return false; let ch = false;
    MS.forEach(s => { if(!s || !s.code) return; if(s._book0 === undefined) s._book0 = s.book || ''; const L = NB[String(s.code).toUpperCase()] || [];
      const multi = (s.teachers || []).length > 1, txt = L.map(x => '→ ' + x.b + ' from ' + dShort(x.from) + (multi ? ' (' + String(x.t || '').replace(/\b\w/g, c => c.toUpperCase()) + ')' : '')).join(' · ');
      const nb = s._book0 + (txt ? (s._book0 ? ' ' : '') + txt : ''); if(s.book !== nb){ s.book = nb; ch = true; } });
    return ch; }
  function nbLoad(){ if(NBbusy || !TOKEN || !(D && D.mgr) || Date.now() - NBat < 3 * 6e4) return; NBbusy = true;
    post('nextBooks').then(d => { NB = d || {}; NBat = Date.now(); if(mark() && VIEW === 'astudents') renderAStudents(); }).catch(() => {}).finally(() => { NBbusy = false; }); }
  window.nbRefresh = () => { NBat = 0; nbLoad(); };
  const _ra = window.renderAStudents;
  if(_ra) window.renderAStudents = function(){ try{ mark(); }catch(e){} const r = _ra.apply(this, arguments); try{ nbLoad(); }catch(e){} return r; };
  const _api = api; api = function(fn, ...args){ const p = _api(fn, ...args); if(fn === 'mgmtSetBook') Promise.resolve(p).then(() => { setTimeout(window.nbRefresh, 1500); const code = String(args[1] || '').trim().toUpperCase();   /* the class list too (284 looked for it in the wrong place) */
    try{ if(typeof STU !== 'undefined' && STU && STU.code === code) _api('mgmtStuClasses', TOKEN, code).then(x => { if(!Array.isArray(x)) return; CLSM[code] = x; if(STU && STU.code === code){ STU.cls = x; const el = $('stuSch'); if(el) el.innerHTML = stuSched(x); } }).catch(() => {}); }catch(e){} }).catch(() => {}); return p; };

  // 2 · the CEFR journey from the -DAILY months
  const DL = {};
  function redraw(){ try{ const el = document.querySelector('section.cj'); if(!el || !(typeof STU !== 'undefined' && STU)) return; const n = cjHtml(STU); if(n && n !== el.outerHTML){ const t = document.createElement('div'); t.innerHTML = n; const x = t.firstElementChild; if(x) el.replaceWith(x); } }catch(e){} }
  function useDaily(code){ const d = DL[code]; if(!d || !(typeof STU !== 'undefined' && STU) || STU.code !== code || !STU.r) return false; if(STU.r._dly === d) return false;
    const base = (STU.r._mo0 = STU.r._mo0 || (STU.r.monthly || [])), have = {}; d.forEach(x => { have[x.m] = 1; });
    STU.r.monthly = d.map(x => ({ m: x.m, t: x.t, c: x.c, u: Number(x.u) || 0, n: 0, lv: x.lv })).concat(base.filter(x => x && !have[String(x.m)])); STU.r._dly = d; return true; }
  function dlLoad(code){ if(!code || DL[code] || !(D && D.mgr)) { if(useDaily(code)) redraw(); return; } DL[code] = 'busy';
    post('stuDaily', [code]).then(d => { DL[code] = Array.isArray(d) ? d : []; if(useDaily(code)) redraw(); }).catch(() => { delete DL[code]; }); }
  const _ss = window.stuSched;
  if(_ss) window.stuSched = function(L){ const h = _ss.apply(this, arguments); try{ if((typeof STU !== 'undefined' && STU) && STU.code) setTimeout(() => dlLoad(STU.code), 0); }catch(e){} return h; };
  const _sr = window.stuRender;
  if(_sr) window.stuRender = function(){ try{ if((typeof STU !== 'undefined' && STU) && STU.code && Array.isArray(DL[STU.code])) useDaily(STU.code); }catch(e){} const r = _sr.apply(this, arguments); try{ if((typeof STU !== 'undefined' && STU) && STU.code) dlLoad(STU.code); }catch(e){} return r; };
})();
