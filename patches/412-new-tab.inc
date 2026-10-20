/* 20 Oct · 412 · Open another screen in a new tab or window without leaving this one (Misty).
   · Cmd-click (Mac) / Ctrl-click (Windows) or the middle mouse button on a menu item, a student, or any button that
     goes to a screen opens it in a new browser tab; the screen you are on stays as it is.
   · Right-click a menu item › "Open in new tab" / "Open in new window" works too (the menu items are real links now).
   · A student opened that way has its own address (…/#student=ST-2026-102), so the new tab opens straight on that student.
   · Every tab keeps its own screen: reloading a tab returns to that tab's screen, not to the last one used elsewhere. */
(function(){
  const base = () => location.href.split('#')[0];
  const H = v => (window.coeH ? coeH(v) : '#' + v);
  function target(el){ const a = el.closest('[onclick]'); if(!a) return null; const s = a.getAttribute('onclick') || '';
    let m = s.match(/openStudent\('([^']+)'\)/); if(m) return base() + '#student=' + encodeURIComponent(m[1]);
    m = s.match(/(?:^|[;\s])go\('([a-z]+)'\)/); if(m) return base() + H(m[1]);
    return null; }
  const open = (e) => { if(!(e.metaKey || e.ctrlKey || e.button === 1)) return; const u = target(e.target); if(!u) return; e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation(); window.open(u, '_blank', 'noopener'); };
  document.addEventListener('click', open, true);
  document.addEventListener('auxclick', open, true);
  document.addEventListener('mousedown', e => { if(e.button === 1 && target(e.target)) e.preventDefault(); }, true);   /* no auto-scroll icon on middle click */
  /* menu items as real links (right-click › open in new tab); a normal click still stays in this tab */
  function links(){ document.querySelectorAll('#navIn button[data-v]').forEach(b => { if(b.dataset.lk) return; b.dataset.lk = 1; const v = b.dataset.v; const a = document.createElement('a'); a.href = H(v); a.className = 'navlk'; a.tabIndex = -1; a.setAttribute('aria-hidden', 'true'); a.addEventListener('click', e => { e.preventDefault(); }); b.style.position = 'relative'; b.appendChild(a); }); }
  const st = document.createElement('style'); st.textContent = '#navIn .navlk{position:absolute;inset:0;border-radius:inherit}'; document.head.appendChild(st);
  const bn = window.buildNav; if(bn) window.buildNav = function(){ const r = bn.apply(this, arguments); try{ links(); }catch(e){} return r; };
  setTimeout(() => { try{ links(); }catch(e){} }, 800);
  /* this tab's own screen: an address with a screen wins over the last screen used in another tab */
  try{ const h = (location.hash || '').slice(1);
    if(/^student=/.test(h)){ const code = decodeURIComponent(h.slice(8)); const t0 = Date.now();
      const tryOpen = () => { if(typeof D !== 'undefined' && D && typeof openStudent === 'function' && $('app') && !$('app').classList.contains('hide')){ try{ if(D.mgr) go('astudents'); }catch(e){} openStudent(code); } else if(Date.now() - t0 < 15000) setTimeout(tryOpen, 300); };
      setTimeout(tryOpen, 400); } }catch(e){}
  const so = window.openStudent; if(so) window.openStudent = function(code){ const r = so.apply(this, arguments); try{ if(history.replaceState && history.state && history.state.sh) history.replaceState(history.state, '', '#student=' + encodeURIComponent(code)); }catch(e){} return r; };
})();
