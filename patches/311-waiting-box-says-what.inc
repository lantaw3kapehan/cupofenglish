/* 19 Oct · 311 · "Management is waiting for …" says WHAT in the title (Misty: "they wouldn't know"):
   one item  → "⚠ Management is waiting for your progress check · Jelly Sun Shihan"
   several   → "⚠ Management is waiting for 3 things: progress check (Jelly), trial report (Sheren), message (Celine)" */
(function(){
  const who = x => String(x.title || '').split(' · ')[0].trim();
  function name(){ const must = document.getElementById('mustBox'), L = window._MUST; if(!must || !L || !L.length) return; const h3 = must.querySelector('h3'); if(!h3 || h3.dataset.named) return;
    const lab = x => String(x.label || '').replace(/^\W+/, '').toLowerCase();
    h3.textContent = L.length === 1 ? '⚠ Management is waiting for your ' + lab(L[0]) + (who(L[0]) ? ' · ' + who(L[0]) : '')
      : '⚠ Management is waiting for ' + L.length + ' things: ' + L.slice(0, 4).map(x => lab(x) + (who(x) ? ' (' + who(x).split(/\s+/)[0] + ')' : '')).join(', ') + (L.length > 4 ? ', …' : '');
    h3.dataset.named = '1'; }
  const _rt = window.renderToday; if(_rt) window.renderToday = function(){ const r = _rt.apply(this, arguments); try{ setTimeout(name, 0); setTimeout(name, 450); }catch(e){} return r; };
})();
