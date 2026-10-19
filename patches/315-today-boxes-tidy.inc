/* 19 Oct · 315 · Teacher Today, final tidy (Misty on Pam's screen: two boxes said the same things, the title was a long run-on):
   · "Management is waiting for 6 things" + one short line of what (Message 1 · Leave 1 · QA visit 2 · To fix 1); the first 3 rows show, "Show all 6" opens the rest.
   · Anything in the red warning box that is also in the waiting box (a message, a class visit to read, a progress check…) is said once, in the waiting box,
     which turns red with "⛔ Overdue …". The red box stays only for teaching points (not fixed, same issue), with the plan box. */
(function(){
  function tidy(){ if(!(typeof D !== 'undefined' && D && !D.mgr)) return; const must = document.getElementById('mustBox'), L = window._MUST || []; if(!must) return;
    const lab = x => String(x.label || '').replace(/^\W+/, '').trim(), labs = new Set(L.map(x => lab(x).toLowerCase()));
    const h3 = must.querySelector('h3');
    if(h3 && L.length > 1 && !must.dataset.t15){ h3.textContent = '⚠ Management is waiting for ' + L.length + ' things'; const c = {}; L.forEach(x => { const k = lab(x); c[k] = (c[k] || 0) + 1; });
      h3.insertAdjacentHTML('afterend', '<div class="small" style="font-weight:600;margin:0 0 2px">' + Object.keys(c).map(k => esc(k) + (c[k] > 1 ? ' ' + c[k] : '')).join(' · ') + '</div>'); must.dataset.t15 = '1'; }
    const rows = [...must.querySelectorAll('.must-r')];
    if(rows.length > 3 && !must.querySelector('.m15-more')){ rows.slice(3).forEach(r => r.style.display = 'none');
      const b = document.createElement('button'); b.className = 'btn ghost sm m15-more'; b.style.marginTop = '6px'; b.textContent = 'Show all ' + rows.length; b.onclick = () => { rows.forEach(r => r.style.display = ''); b.remove(); }; must.appendChild(b); }
    const ft = document.getElementById('ftBox'), R = window._FT; if(!ft || !R || !R.items) return;
    const same = x => labs.has(String(x.kind).toLowerCase()) || /^(Progress check|Task|Memorandum)$/.test(x.kind);
    const lis = [...ft.querySelectorAll('li')]; let left = 0, od = 0;
    R.items.slice(0, lis.length).forEach((x, i) => { if(same(x)){ if(lis[i]) lis[i].remove(); od = Math.max(od, +x.days || 0); } else left++; });
    if(R.items.some(same)){ must.classList.add('od'); if(!must.querySelector('.od-l') && h3) h3.insertAdjacentHTML('afterend', '<div class="small od-l" style="color:#8E1F12;font-weight:600;margin:0 0 2px">⛔ Overdue' + (od ? ' ' + od + ' day' + (od > 1 ? 's' : '') : '') + ' · counts as a warning until done</div>'); }
    if(!left){ ft.remove(); return; }
    if(!R.items.some(x => !same(x) && !/^(Progress check|Task|Memorandum)$/.test(x.kind))){ ['ftP', 'ftB'].forEach(id => { const e = document.getElementById(id); if(e) e.remove(); }); }
  }
  const _rt = window.renderToday; if(_rt) window.renderToday = function(){ const r = _rt.apply(this, arguments); try{ setTimeout(tidy, 60); setTimeout(tidy, 600); }catch(e){} return r; };
})();
