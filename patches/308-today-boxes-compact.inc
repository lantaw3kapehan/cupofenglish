/* 19 Oct · 308 · Teacher Today: smaller, clearer boxes (Misty: Mayi's screen — the same progress check in two big boxes).
   · Both boxes are tighter (less padding, smaller titles, closer rows).
   · When every warning is just something to DO (progress check, task, memorandum) and it is already in "Management is waiting for…",
     the red warning box is not shown twice: the waiting box turns red and says what is overdue ("⛔ Overdue 4 days · counts as a warning until done").
   · The "What did you change…" plan box only shows when a warning is about how she teaches (not fixed, same issue, class visits not read, messages). */
(function(){
  if(!document.getElementById('cmpCss')) document.head.insertAdjacentHTML('beforeend', '<style id="cmpCss">#ftBox,#mustBox{padding:10px 14px!important;border-width:1.5px!important;border-radius:14px!important;margin:10px 0 4px!important}#ftBox h3,#mustBox h3{font-size:15px!important;margin:0 0 2px!important}#ftBox ul{margin-top:4px!important}#ftBox textarea{min-height:0}.must-r{padding:7px 0!important;gap:10px!important}.must-r b,.must-r .t{font-size:15px}#mustBox.od{border-color:#C0392B!important;background:#FDECEA!important}</style>');
  const ACT = /^(Progress check|Task|Memorandum)$/;
  function tidy(){ if(!(typeof D !== 'undefined' && D && !D.mgr)) return; const ft = document.getElementById('ftBox'), must = document.getElementById('mustBox'), R = window._FT; if(!ft || !R || !R.items) return;
    const items = R.items; if(!items.length) return;
    if(items.every(x => ACT.test(x.kind)) && must){ ft.remove(); must.classList.add('od'); const old = must.querySelector('.od-l'); if(old) old.remove();
      const d = Math.max(0, ...items.map(x => +x.days || 0)), h3 = must.querySelector('h3');
      if(h3) h3.insertAdjacentHTML('afterend', '<div class="small od-l" style="color:#8E1F12;font-weight:600;margin:0 0 4px">⛔ Overdue' + (d ? ' ' + d + ' day' + (d > 1 ? 's' : '') : '') + ' · counts as a warning until done</div>');
      return; }
    if(!items.some(x => !ACT.test(x.kind))){ ['ftP', 'ftB'].forEach(id => { const e = document.getElementById(id); if(e) e.remove(); }); const lb = [...ft.querySelectorAll('label')].find(l => /What did you change/.test(l.textContent)); if(lb) lb.remove(); }
    if(must && ft.compareDocumentPosition(must) & Node.DOCUMENT_POSITION_PRECEDING) must.before(ft);   // the warning first, then the list
  }
  const _rt = window.renderToday; if(_rt) window.renderToday = function(){ const r = _rt.apply(this, arguments); try{ setTimeout(tidy, 0); setTimeout(tidy, 400); }catch(e){} return r; };
})();
