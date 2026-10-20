/* 20 Oct · 356 · The child's age always in view (Misty: "always show the age of the kid … any place better that it is easy to know")
   · Student page: a coral age chip next to the code ("8 yrs · 8岁", + grade when known), and the name from DATABASE when the page only knows the code (Abner ST-2026-126)
   · Trial report sheet: age after the student's name
   Age from DATABASE › Birthdate (col F), worked out on Manila's date. No birthdate → a quiet "Age ?" chip that opens Edit details. */
(function(){
  const up = s => String(s || '').trim().toUpperCase();
  const css = document.createElement('style'); css.textContent = '.age-chip{background:#FDECE7!important;color:#B4472E!important;font-weight:700}.age-chip.q{background:#F1F0F6!important;color:#8A86A0!important;font-weight:600;cursor:pointer}';
  document.head.appendChild(css);
  function birthOf(code){ try{ const r = ((typeof DB !== 'undefined' && DB && DB.rows) || []).find(x => up(x[0]) === up(code)); if(!r) return null;
    const raw = String(r[5] == null ? '' : r[5]).trim(); let m = raw.match(/^(\d{4})-(\d{2})-(\d{2})/); let ymd = m ? [+m[1], +m[2], +m[3]] : null;
    if(!ymd){ m = raw.match(/^(\d{1,2})[-\s\/]([A-Za-z]{3})[a-z]*[-\s\/,]*(\d{4})$/); if(m){ const M = 'janfebmaraprmayjunjulaugsepoctnovdec'.indexOf(m[2].toLowerCase()) / 3 + 1; if(M >= 1) ymd = [+m[3], M, +m[1]]; } }
    return { ymd, grade: String(r[8] || '').trim(), en: String(r[2] || '').trim(), cn: String(r[1] || '').trim() }; }catch(e){ return null; } }
  function ageOf(ymd){ if(!ymd) return null; const t = new Date(Date.now() + 8 * 3600e3), y = t.getUTCFullYear(), mo = t.getUTCMonth() + 1, d = t.getUTCDate();
    let a = y - ymd[0]; if(mo < ymd[1] || (mo === ymd[1] && d < ymd[2])) a--; return a >= 0 && a < 100 ? a : null; }
  window.coeAge = function(code){ const b = birthOf(code); return b ? { age: ageOf(b.ymd), grade: b.grade, en: b.en, cn: b.cn, known: !!b } : null; };
  const chip = (code, a) => a && a.age != null ? `<span class="chip age-chip">${a.age} yrs · ${a.age}岁${a.grade ? ' · ' + esc(a.grade) : ''}</span>` : `<span class="chip age-chip q" onclick="closeSheet();setTimeout(()=>stuEdit('${esc(code)}'),120)" title="Add the birthdate in Edit details">Age ? · add birthdate</span>`;
  let asked = 0;
  function stuAge(){ try{ if(typeof STU === 'undefined' || !STU || !STU.code) return; const hero = document.querySelector('#sheetBody .shero'); if(!hero || hero.querySelector('.age-chip')) return;
    if(typeof DB === 'undefined' || !DB){ try{ const k = kept('db'); if(k) DB = k; }catch(e){} }
    if((typeof DB === 'undefined' || !DB) && !asked){ asked = 1; loadDb(true).then(() => { asked = 0; stuAge(); }).catch(() => { asked = 0; }); return; }
    const a = coeAge(STU.code), row = hero.querySelector('.row');
    if(row) row.insertAdjacentHTML('beforeend', chip(STU.code, a));
    const h = hero.querySelector('h1'); if(a && a.en && h && up(h.firstChild && h.firstChild.textContent) === up(STU.code)){ h.innerHTML = esc(a.en) + (a.cn ? ' <span class="cn">' + esc(a.cn) + '</span>' : ''); }
  }catch(e){} }
  const _sr = window.stuRender; if(_sr) window.stuRender = function(){ const r = _sr.apply(this, arguments); try{ stuAge(); }catch(e){} return r; };
  /* trial sheet: age after the name */
  const _tp = window.tlPaint; if(_tp) window.tlPaint = function(){ const r = _tp.apply(this, arguments); try{ const t = TLD; if(t && t.code){ const a = coeAge(t.code), h = document.querySelector('#sheetBody h1'); if(h && !h.querySelector('.age-chip') && a && a.age != null) h.insertAdjacentHTML('beforeend', ' <span class="chip age-chip" style="font-size:13px;vertical-align:middle">' + a.age + ' yrs · ' + a.age + '岁</span>'); } }catch(e){} return r; };
})();
