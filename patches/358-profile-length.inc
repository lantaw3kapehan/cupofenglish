/* 20 Oct · 358 · Student page (Misty: "the renewal cycle is repeated here, improve this, and their length with us, can it be on top")
   · Profile: a field that appears twice with the same value (DATABASE has two RENEWAL CYCLE columns) is shown once; if the two differ, the second says "(2)"
   · Top of the page: a teal "With us 1 yr 3 mo · since Jul 2025" chip next to the age, worked out from the first class (DATABASE › Enrollment · First class) */
(function(){
  const _dp = window.dbProfile; if(_dp) window.dbProfile = function(P){
    try{ if(P && P.head && P.row){ const seen = {}, head = [], row = [];
      P.head.forEach((k, j) => { const key = String(k || '').trim().toUpperCase(), v = String(P.row[j] == null ? '' : P.row[j]).trim();
        if(key && seen[key] !== undefined){ if(seen[key] === v || !v) return; head.push(k + ' (2)'); row.push(P.row[j]); return; }
        seen[key] = v; head.push(k); row.push(P.row[j]); });
      P = Object.assign({}, P, { head, row }); } }catch(e){}
    return _dp.call(this, P); };
  const css = document.createElement('style'); css.textContent = '.len-chip{background:#E3F4F2!important;color:#00737B!important;font-weight:700}'; document.head.appendChild(css);
  const MON = 'janfebmaraprmayjunjulaugsepoctnovdec';
  function dayOf(v){ v = String(v || '').trim(); let m = v.match(/^(\d{4})-(\d{2})-(\d{2})/); if(m) return [+m[1], +m[2], +m[3]];
    m = v.match(/^(\d{1,2})[-\s\/]([A-Za-z]{3})[a-z]*[-\s\/,]*(\d{4})$/); if(m){ const M = MON.indexOf(m[2].toLowerCase()) / 3 + 1; if(M >= 1) return [+m[3], M, +m[1]]; } return null; }
  function since(code){ try{ const P = STU && STU.r && STU.r.profile; let d = null;
      if(P && P.head) P.head.forEach((k, j) => { if(!d && /FIRST CLASS/i.test(String(k)) && !/TRIAL/i.test(String(k))) d = dayOf(P.row[j]); });
      if(!d){ const r = ((typeof DB !== 'undefined' && DB && DB.rows) || []).find(x => String(x[0]).trim().toUpperCase() === String(code).toUpperCase()); if(r) d = dayOf(r[16]); }
      return d; }catch(e){ return null; } }
  function chip(){ try{ if(typeof STU === 'undefined' || !STU || !STU.code) return; const hero = document.querySelector('#sheetBody .shero'); if(!hero || hero.querySelector('.len-chip')) return;
    const d = since(STU.code); if(!d) return; const t = new Date(Date.now() + 8 * 3600e3);
    let mo = (t.getUTCFullYear() - d[0]) * 12 + (t.getUTCMonth() + 1 - d[1]); if(t.getUTCDate() < d[2]) mo--; if(mo < 0) return;
    const y = Math.floor(mo / 12), m = mo % 12, txt = mo < 1 ? 'New this month' : 'With us ' + (y ? y + ' yr' + (y > 1 ? 's' : '') : '') + (y && m ? ' ' : '') + (m ? m + ' mo' : '');
    const lab = MON.substr((d[1] - 1) * 3, 3); const html = `<span class="chip len-chip" title="First class ${d[0]}-${String(d[1]).padStart(2, '0')}-${String(d[2]).padStart(2, '0')}">${txt} · since ${lab[0].toUpperCase() + lab.slice(1)} ${d[0]}</span>`;
    const age = hero.querySelector('.age-chip'); if(age) age.insertAdjacentHTML('afterend', html); else { const row = hero.querySelector('.row'); if(row) row.insertAdjacentHTML('beforeend', html); } }catch(e){} }
  const _sr = window.stuRender; if(_sr) window.stuRender = function(){ const r = _sr.apply(this, arguments); try{ chip(); setTimeout(chip, 400); }catch(e){} return r; };
})();
