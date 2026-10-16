/* 16 Oct · Misty: when a package's validity date has passed and the student still has lessons left, the classes stay as
   scheduled, and the student's name shows it: "Validity ended 30 Oct · extended 12 days" (the days count up by themselves).
   Shown on class cards (management Schedule and To do, the teacher's Today and Schedule), the Students list and the
   student's page. Management reads the deadline from ACTIVE (the active package); a teacher from her own student list. */
(function(){
  const css = `.vn{display:inline-flex;align-items:center;gap:5px;margin-left:6px;padding:2px 9px;border-radius:999px;font-size:11.5px;font-weight:700;
    background:#FBEFE3;color:#9A4E12;white-space:nowrap;vertical-align:middle;line-height:1.5}
  .vn i{width:6px;height:6px;border-radius:50%;background:#D9822B;flex:none}
  .cls .vn{margin-left:0;margin-top:4px}
  .vn-row{display:block;margin-top:4px}`;
  const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
  let VAT = null, VAT_AT = 0, busy = false;
  const today = () => { const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
  const dayN = s => Date.UTC(+s.slice(0, 4), +s.slice(5, 7) - 1, +s.slice(8, 10)) / 864e5;
  function table(){ const A = (typeof AT !== 'undefined' && AT && AT.cols) ? AT : VAT;
    if(D && D.mgr && !A && !busy && Date.now() - VAT_AT > 5 * 6e4){ busy = true; VAT_AT = Date.now();
      api('mgmtActive', TOKEN).then(d => { if(d && d.cols) { VAT = d; paint(); } }).catch(() => {}).finally(() => { busy = false; }); }
    return A; }
  // code → { dl: 'yyyy-mm-dd', days } when the validity has passed and lessons are left
  function ended(){ const out = {}, t = today();
    try{
      if(D && D.mgr){ const A = table(); if(!A || !A.cols) return out; const C = {}; A.cols.forEach((c, i) => C[c] = i);
        const by = {};
        (A.rows || []).forEach(r => { const k = String(r[C.code] || '').toUpperCase(); if(!/^ST-/.test(k) || !r[C.active]) return; (by[k] = by[k] || []).push(r); });
        Object.keys(by).forEach(k => { const R = by[k], dls = R.map(r => String(r[C.deadline] || '').slice(0, 10)).filter(x => /^\d{4}-\d{2}-\d{2}$/.test(x)).sort();
          if(!dls.length) return; const dl = dls[dls.length - 1];   /* the newest package's validity */
          const left = R.some(r => r[C.available] !== '' && +r[C.available] > 0) || R.some(r => r[C.available] === '' && r[C.shared]);
          if(dl < t && left) out[k] = { dl, days: dayN(t) - dayN(dl) }; });
      } else if(D && D.students){ (D.students || []).forEach(s => { const dl = String(s.deadline || '').slice(0, 10); if(!/^\d{4}-\d{2}-\d{2}$/.test(dl)) return;
          if(dl < t && (s.left == null ? s.shared : s.left > 0)) out[String(s.code).toUpperCase()] = { dl, days: dayN(t) - dayN(dl) }; }); }
    }catch(e){}
    return out; }
  const fmt = s => new Date(s + 'T12:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  const chip = v => `<span class="vn" title="Validity ended ${fmt(v.dl)} · classes continue · extended ${v.days} day${v.days === 1 ? '' : 's'} so far"><i></i>Validity ended ${fmt(v.dl)} · extended ${v.days} day${v.days === 1 ? '' : 's'}</span>`;
  function paint(){
    const E = ended(); if(!Object.keys(E).length) { document.querySelectorAll('.vn').forEach(x => x.remove()); return; }
    // class cards: the code is in the card's small line
    document.querySelectorAll('.cls').forEach(c => { if(c.classList.contains('x')) return; const m = (c.textContent.match(/ST-\d{4}-\d{3}/) || [])[0], v = m && E[m.toUpperCase()];
      const old = c.querySelector('.vn'); if(!v){ if(old) old.remove(); return; } if(old && old.dataset.k === v.dl + v.days) return; if(old) old.remove();
      const nm = c.querySelector('.nm'); const box = nm ? (nm.closest('.row') || nm) : null; if(!box) return;
      box.insertAdjacentHTML('afterend', chip(v).replace('class="vn"', 'class="vn vn-row" data-k="' + v.dl + v.days + '"')); });
    // student lists and the student page heading
    document.querySelectorAll('[onclick^="openStudent(\'"]').forEach(el => { if(el.closest('.cls')) return; const m = (el.getAttribute('onclick').match(/openStudent\('([^']+)'/) || [])[1], v = m && E[m.toUpperCase()];
      const old = el.querySelector(':scope .vn'); if(!v){ if(old) old.remove(); return; } if(old) return;
      const nm = el.querySelector('b, .nm, .t') || el; nm.insertAdjacentHTML('beforeend', chip(v)); });
    const sp = document.querySelector('#sheet.on, #v-student'); if(sp && typeof STU !== 'undefined' && STU && STU.code){ const v = E[String(STU.code).toUpperCase()], h = sp.querySelector('h1');
      if(h && v && !h.querySelector('.vn')) h.insertAdjacentHTML('beforeend', chip(v)); }
  }
  let tmr = 0; new MutationObserver(() => { clearTimeout(tmr); tmr = setTimeout(paint, 250); }).observe(document.body, { childList: true, subtree: true });
  setInterval(paint, 60 * 6e4);   /* the day count moves on by itself */
  window.validityEnded = ended;
})();
