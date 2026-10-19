/* 19 Oct · 283 · the CEFR journey is drawn again when the student's class list arrives (a book change in the calendar shows at once) */
(function(){ const _ss = window.stuSched; if(!_ss) return;
  window.stuSched = function(L){ const h = _ss.apply(this, arguments);
    try{ setTimeout(() => { try{ if(typeof STU === 'undefined' || !STU || STU.cls !== L) return; const el = document.querySelector('section.cj'); if(!el) return; const n = cjHtml(STU); if(n && n !== el.outerHTML){ const t = document.createElement('div'); t.innerHTML = n; const x = t.firstElementChild; if(x) el.replaceWith(x); } }catch(e){} }, 0); }catch(e){}
    return h; }; })();
