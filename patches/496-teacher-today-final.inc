/* 21 Oct · 496 · Teacher Today, final polish (Misty: "refine and polish for the final one").
   · No repeats on a class card: the grey "I'm in · opens 19:55" chip goes — the In pill says it ("In · 19:55").
   · A class with everything done (In, Homework, Note, Video all ✓) folds to one calm line with a green edge, so the eye goes to what is left.
   · The past classes' "Last class" notes close; the next class's note stays open.
   · The sound / reminders card moves to the bottom of the right column (a setting, not a task): Time-in → To do → Messages → settings.
   · Even spacing between the sections. */
(function(){
  const css = document.createElement('style');
  css.textContent = `
#v-today .cls.fin96{opacity:.72;box-shadow:inset 3px 0 0 #2E9E6F}
#v-today .cls.fin96 .note,#v-today .cls.fin96 .cact{display:none}
#v-today .cls.fin96:hover{opacity:1}
#v-today .cls.fin96:hover .note,#v-today .cls.fin96:hover .cact{display:block}
#v-today h2{margin-top:22px!important}
#v-today .yd92+h2,#v-today .lead+h2{margin-top:14px!important}`;
  document.head.appendChild(css);
  function tidy(){ const v = document.getElementById('v-today'); if(!v || !D || D.mgr) return;
    v.querySelectorAll('.cls').forEach(card => { const chip = [...card.querySelectorAll('.cact .chip')].find(c => /^I'm in · opens (\d{1,2}:\d{2})/.test(c.textContent.trim()));
      const pin = card.querySelector('.cs93 span:first-child'); if(chip && pin && pin.classList.contains('l')){ const t = chip.textContent.match(/(\d{1,2}:\d{2})/)[1]; if(!/·/.test(pin.textContent)) pin.lastChild.textContent = 'In · ' + t; pin.title = 'I’m in opens at ' + t; chip.remove(); }
      const pills = card.querySelectorAll('.cs93 span'); if(pills.length && [...pills].every(p => p.classList.contains('d'))) card.classList.add('fin96'); });
    const ps = v.querySelector('.ps92'), mh = [...v.querySelectorAll('h2')].find(h => /^Messages/.test(h.textContent.trim()));
    if(ps && mh && !ps.dataset.m96){ let t = mh.nextElementSibling; if(t){ ps.dataset.m96 = 1; t.after(ps); } } }
  const _rt = window.renderToday; if(_rt) window.renderToday = function(){ const r = _rt.apply(this, arguments); try{ tidy(); }catch(e){ console.warn('td96', e); } setTimeout(() => { try{ tidy(); }catch(e){} }, 350); return r; };
  try{ if(typeof VIEW !== 'undefined' && VIEW === 'today') renderToday(); }catch(e){}
})();
