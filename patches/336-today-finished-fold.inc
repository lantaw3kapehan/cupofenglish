/* 19 Oct · 336 · Today (teacher): a class with homework, class note and video all done folds into "✓ Finished today" at the bottom,
   one short line each (tap a line to open it). Classes still to teach or with something missing stay open on top. (Misty: "it's cluttered and looks stressful") */
(function(){
  const isT = () => !!(typeof D !== 'undefined' && D && !D.mgr && TOKEN);
  const css = document.createElement('style'); css.textContent = `.dnBox{padding:10px 14px;margin-top:10px;background:#F3FAF6;border:1.5px solid #CDE9DA}
.dnBox>summary{list-style:none;cursor:pointer;display:flex;align-items:center;gap:8px}.dnBox>summary::-webkit-details-marker{display:none}
.dnBox>summary b{color:#1E7A55}.dnBox .cls{padding-top:8px;padding-bottom:8px;cursor:pointer}
.cls.dn:not(.dnOpen) .note,.cls.dn:not(.dnOpen) .cact,.cls.dn:not(.dnOpen) .hw,.cls.dn:not(.dnOpen) .cvisit,.cls.dn:not(.dnOpen) .grow>div:not(.row):not(.dnS){display:none!important}
.dnS{font-size:13px;color:#1E7A55;margin-top:2px}.cls.dnOpen .dnS{display:none}`;
  document.head.appendChild(css);
  let busy = false;
  function done(card){ if(card.classList.contains('trial') || card.classList.contains('x')) return false;
    const hw = [...card.querySelectorAll('.hw')]; if(hw.length < 3) return false;
    if(hw.some(h => !h.classList.contains('ok'))) return false;
    const t = card.textContent; return /Homework given/.test(t) && /Class note saved/.test(t) && /video uploaded/i.test(t); }
  function fold(){ const v = $('v-today'); if(!v || !isT() || busy) return; const h2 = [...v.querySelectorAll('h2')].find(x => /Today's classes/.test(x.textContent)); if(!h2) return;
    const list = h2.nextElementSibling; if(!list || list.tagName !== 'DIV' || list.classList.contains('empty')) return;
    let box = v.querySelector('.dnBox'); const cards = [...list.children].filter(x => x.classList && x.classList.contains('cls')), fin = cards.filter(done);
    const back = box ? [...box.querySelectorAll('.cls')].filter(x => !done(x)) : [];
    if(!fin.length && !back.length) return;
    busy = true;
    try{
      if(fin.length && !box){ box = document.createElement('details'); box.className = 'card dnBox'; box.innerHTML = '<summary><b class="grow"></b><span class="small mute">tap to see ›</span></summary><div class="dnL"></div>'; list.after(box); }
      fin.forEach(c => { c.classList.add('dn'); if(!c.querySelector('.dnS')){ const s = document.createElement('div'); s.className = 'dnS'; s.textContent = '✓ Homework · ✓ Class note · ✓ Video';
          const g = c.querySelector('.grow'); if(g) g.appendChild(s); c.addEventListener('click', e => { if(e.target.closest('a,button,.nm,.bkchip,.hw')) return; c.classList.toggle('dnOpen'); }); }
        box.querySelector('.dnL').appendChild(c); });
      if(back.length){ const e = list.querySelector(':scope > .empty'); if(e) e.remove(); }
      back.forEach(c => { c.classList.remove('dn', 'dnOpen'); const s = c.querySelector('.dnS'); if(s) s.remove(); list.appendChild(c); });
      if(box){ const n = box.querySelectorAll('.cls').length; if(!n){ box.remove(); } else box.querySelector('summary b').textContent = '✓ Finished today · ' + n + ' class' + (n === 1 ? '' : 'es') + ' · all done'; }
      if(!list.querySelector('.cls') && box){ list.innerHTML = '<div class="empty" style="padding:14px">All of today\'s classes are finished ✓</div>'; }
    } finally { busy = false; } }
  const _rt = window.renderToday; if(_rt) window.renderToday = function(){ const x = _rt.apply(this, arguments); try{ fold(); }catch(e){} return x; };
  let t = 0; new MutationObserver(() => { if(busy || !isT()) return; clearTimeout(t); t = setTimeout(() => { try{ fold(); }catch(e){} }, 120); }).observe(document.body, { childList: true, subtree: true });
})();
