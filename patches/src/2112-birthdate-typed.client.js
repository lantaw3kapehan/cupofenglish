/* 2112 (12 Nov 11:56, Misty: Anna's birthdate typed again, still "Age ? · add birthdate"; save 8363 arrived with birth "" and birthKeep 1).
   The birthdate decision (960, 2097) is read from the form when the save goes out; on Misty's laptop it still came out empty. Belt and braces:
   the date typed in a student's birthdate box is remembered by student code the moment it is typed, and the save sends it (a typed date
   always wins over "keep the old one"). Clearing the box is not touched here (960 asks first). */
(function(){
  if(window.__bd2112) return; window.__bd2112 = 1;
  const T = {};
  const grab = ev => { try{ const i = ev.target; if(!i || i.id !== 'sBirth') return; const f = i.closest('#sheetBody') || document; const R = f.querySelector('#sBirthR');
    const code = String((R && R.value) || '').split('|')[1] || ''; const v = String(i.value || '').trim();
    if(/^ST-\d{4}-\d{3}$/i.test(code) && /^\d{4}-\d{2}(-\d{2})?$/.test(v)) T[code.toUpperCase()] = { v, t: Date.now() }; }catch(e){} };
  document.addEventListener('input', grab, true); document.addEventListener('change', grab, true);
  window.__bd2112T = T;   /* read by the 960 save hook (patched below): a typed date wins over "keep" */
})();
