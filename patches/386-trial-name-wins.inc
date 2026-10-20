/* 20 Oct · 386 · Elsa showed as "Eric" in Add class: her new ACTIVE row 6 copied Eric's name cells (Google's enrolment copies the
   top row). From the trial screen the trial's own name now wins (form title, student box, booking titles, parent picture), until
   ACTIVE is corrected. Book chips: no "N/A" or "REF". */
(function(){
  window.NAMEFIX = window.NAMEFIX || {};
  const baseStu = window.classStu;
  window.classStu = function(){ const s = baseStu.apply(this, arguments); try{ const n = s && NAMEFIX[String(s.code).toUpperCase()]; if(n && n !== s.name) return Object.assign({}, s, { name: n }); }catch(e){} return s; };
  const fixForm = (code, nm) => { try{ const cs = $('cS'); if(cs && cs.value.toUpperCase().indexOf(code) === 0) cs.value = code + ' · ' + nm; const h = $('sheetBody').querySelector('h1'); if(h && /^New class/.test(h.textContent)) h.textContent = 'New class · ' + nm; classPrev(); }catch(e){} };
  const baseT = window.tlSched;
  if(baseT) window.tlSched = async function(){ const x = (typeof TLD !== 'undefined') ? TLD : null, code = x && String(x.code || '').toUpperCase(), nm = x && String(x.student || '').trim();
    if(code && nm) NAMEFIX[code] = nm;
    const r = await baseT.apply(this, arguments);
    if(code && nm){ fixForm(code, nm); setTimeout(() => fixForm(code, nm), 1500); }   /* again after the student list reloads */
    return r; };
  const basePick = window.classPick;
  if(basePick) window.classPick = function(){ const r = basePick.apply(this, arguments); try{ const s = classStu(); if(s && NAMEFIX[s.code]){ const h = $('sheetBody').querySelector('h1'); if(h && /^New class/.test(h.textContent)) h.textContent = 'New class · ' + s.name; } }catch(e){} return r; };
  /* book chips: hide placeholders */
  const bp = window.classPrev; window.classPrev = function(){ const r = bp.apply(this, arguments); try{ const B = $('cBk'); if(B) B.querySelectorAll('.bk button:not(.more)').forEach(b => { if(/^(N\/?A|REF|#?REF!?|-+|none|tbd)$/i.test(b.textContent.trim())) b.remove(); }); }catch(e){} return r; };
})();
