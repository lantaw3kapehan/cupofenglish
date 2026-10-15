(function(){
  // 15 Oct · Stage 2 · the last management saves that made you wait now close at once and save in the background:
  // student details (new / Edit details), leave form, reply on a pay check. If Google refuses, the form comes back
  // exactly as it was, with a note.
  window.sheetSnap = function(){ const b = $('sheetBody'); if(!b) return null;
    return { html: b.innerHTML, wide: $('sheet').classList.contains('wide'), vals: [...b.querySelectorAll('input,textarea,select')].map(el => el.type === 'checkbox' || el.type === 'radio' ? el.checked : el.value),
      open: [...b.querySelectorAll('details')].map(d => d.open) }; };
  window.sheetBack = function(s){ if(!s) return; try{ openSheet(s.html); if(s.wide) $('sheet').classList.add('wide'); const b = $('sheetBody');
    [...b.querySelectorAll('input,textarea,select')].forEach((el, i) => { if(i >= s.vals.length) return; if(el.type === 'checkbox' || el.type === 'radio') el.checked = s.vals[i]; else if(el.type !== 'file') el.value = s.vals[i]; });
    [...b.querySelectorAll('details')].forEach((d, i) => { if(i < s.open.length) d.open = s.open[i]; });
    b.querySelectorAll('button[disabled]').forEach(x => { x.disabled = false; if(/Saving|Sending/.test(x.textContent)) x.textContent = 'Try again'; }); }catch(e){ console.warn('sheetBack', e); } };
})();
