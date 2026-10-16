/* 16 Oct · Misty: "To do flickers". Opening To do redrew the whole page 5 times in 3 seconds (the TODAY tab, renewals,
   trial follow-ups, data to fix, trial reports and agreements each arrive on their own and each redrew it).
   Now: redraws close together are joined into one (at most one every 0.8 s), and a redraw that would look exactly the
   same changes nothing on screen (open sections, scroll and focus stay as they are). */
(function(){
  const base = window.renderMToday; let last = 0, tmr = 0;
  function run(){ tmr = 0; const v = $('v-mtoday'); if(!v || VIEW !== 'mtoday'){ last = Date.now(); return base(); }
    const oldH = v.innerHTML, kids = [...v.childNodes], y = window.scrollY, r = base();
    try{ if(v.innerHTML === oldH && kids.length) v.replaceChildren(...kids); else if(Math.abs(window.scrollY - y) > 2) window.scrollTo(0, y); }catch(e){}
    last = Date.now(); return r; }
  window.renderMToday = function(){ if(tmr) return; const gap = Date.now() - last; if(gap > 800) return run(); tmr = setTimeout(run, 800 - gap); };
})();
