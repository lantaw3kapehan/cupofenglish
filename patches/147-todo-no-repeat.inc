(function(){
  // The things in the orange "Management is waiting" box are not listed a second time in the To do card on the right.
  const _rt = window.renderToday; window.renderToday = function(){ const r = _rt.apply(this, arguments);
    try{ if(!D || D.mgr || !$('mustBox')) return r; const root = $('v-today'), h2 = [...root.querySelectorAll('h2')].find(x => /^To do/.test(x.textContent.trim())); if(!h2) return r;
      const card = h2.nextElementSibling; if(!card) return r; let left = 0;
      card.querySelectorAll(':scope > .li').forEach(li => { if(li.dataset.must != null) li.style.display = 'none'; else left++; });
      const c = h2.querySelector('.c'); if(c) c.textContent = left || '';
      if(!left && !card.querySelector('.td-up')) card.insertAdjacentHTML('beforeend', '<div class="small mute td-up" style="padding:12px 0">Everything is in the box at the top ↑</div>');
    }catch(e){ console.warn('todo repeat', e); } return r; };
})();
