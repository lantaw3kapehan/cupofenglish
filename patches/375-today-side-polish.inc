/* 20 Oct · 375 · Teacher Today: "To do" and "Messages" tidied (Misty: "it looks crowded").
   To do: the tag sits above the title, the title may take two lines (no cut-off), the detail is smaller.
   Messages: the three latest as plain rows with thin lines (no card inside a card), "See all ›" in the heading, two compact buttons. */
(function(){
  function css(){ if($('tsCss')) return; const s = document.createElement('style'); s.id = 'tsCss'; s.textContent =
    '.tdc .li{align-items:flex-start;padding:12px 0;gap:10px}.tdc .li .tg{display:block;margin-bottom:4px}.tdc .li .tg .chip{font-size:11px;padding:2px 9px}' +
    '.tdc .li .ell{white-space:normal;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;line-height:1.35}' +
    '.tdc .li .small{font-size:12.5px;line-height:1.45;margin-top:2px}.tdc .li>.mute{margin-top:2px}' +
    '.msc{padding:4px 16px 12px!important}.msc .li{padding:11px 0!important;margin:0!important;background:none!important;box-shadow:none!important;border-radius:0!important;border-bottom:1px solid var(--line,#ece8e1)}' +
    '.msc .li:nth-of-type(n+4){display:none}.msc .li .small{font-size:12px}.msc .li .ell{font-size:14.5px;margin-top:2px}' +
    '.msc .ms-all{display:none}.msc .ms-btns{display:flex;gap:8px;padding:12px 0 0}.msc .ms-btns .btn{flex:1;padding:9px 10px;font-size:14px;white-space:nowrap;min-height:0}' +
    'h2:has(.ms-see){display:flex;align-items:baseline;gap:8px}h2 .ms-see{margin-left:auto;font-size:13px;font-weight:600;color:var(--teal,#2a9d8f);text-decoration:none;cursor:pointer}';
    document.head.appendChild(s); }
  function tidy(){ try{ if(typeof D === 'undefined' || !D || D.mgr) return; const v = $('v-today'); if(!v) return; css();
    v.querySelectorAll('h2').forEach(h => { const t = (h.firstChild && h.firstChild.textContent || '').trim(), c = h.nextElementSibling; if(!c || !c.classList.contains('card')) return;
      if(/^To do/.test(t)){ c.classList.add('tdc');
        c.querySelectorAll(':scope > .li').forEach(li => { const ch = li.querySelector(':scope > .chip'), g = li.querySelector(':scope > .grow'); if(!ch || !g) return;
          const tg = document.createElement('span'); tg.className = 'tg'; tg.appendChild(ch); g.insertBefore(tg, g.firstChild);
          if(g.classList.contains('ell')){ g.classList.remove('ell'); const w = document.createElement('div'); w.className = 'ell'; while(tg.nextSibling) w.appendChild(tg.nextSibling); g.appendChild(w); } }); }
      if(/^Messages/.test(t) && !c.classList.contains('msc')){ c.classList.add('msc');
        const a = [...c.querySelectorAll('a')].find(x => /See all messages/.test(x.textContent)); if(a){ const p = a.closest('div'); if(p && p !== c) p.classList.add('ms-all'); }
        if(!h.querySelector('.ms-see')) h.insertAdjacentHTML('beforeend', '<a class="ms-see" onclick="go(\'tinbox\')">See all ›</a>');
        const row = [...c.querySelectorAll('.row')].find(r => r.querySelector('button')); if(row){ row.classList.add('ms-btns'); row.removeAttribute('style');
          row.querySelectorAll('button').forEach(b => { if(/Message management/.test(b.textContent)) b.textContent = '✉️ New message'; else if(/Request leave/.test(b.textContent)) b.textContent = '🗓️ Request leave'; }); } } });
  }catch(e){ console.warn('today tidy', e); } }
  const _rt = window.renderToday; if(_rt) window.renderToday = function(){ const r = _rt.apply(this, arguments); try{ tidy(); setTimeout(tidy, 400); }catch(e){} return r; };
})();
