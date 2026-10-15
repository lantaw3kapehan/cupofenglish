(function(){
  // 15 Oct · Schedule › tap a class: the student is one tap away (Misty: "make it convenient to also directly edit here").
  // Under the class: Student page · Edit details · + Add a class (filled in for this student). The name opens the student page too.
  const css = `.ce2-stu{display:flex;flex-wrap:wrap;gap:8px;margin-top:14px;padding-top:14px;border-top:1px solid #EEF0F4}
.ce2-stu>span{width:100%;font-size:12px;letter-spacing:.06em;text-transform:uppercase;color:#8A87A0}
.ce2-stu button{flex:1 1 140px}
#sheetBody h1.ce2-n{cursor:pointer}#sheetBody h1.ce2-n:hover{color:#00737B}`;
  const st = document.createElement('style'); st.id = 'ce2css'; st.textContent = css; document.head.appendChild(st);
  const pen = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;margin-right:4px"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>';
  const _ce = window.classEdit;
  window.classEdit = async function(i, src){ const r = await _ce.apply(this, arguments);
    try{ if(!D || !D.mgr) return r; const e = evList(src || '')[i]; if(!e) return r;
      const code = String(e.code || (String(e.title || '').match(/ST-\d{4}-\d{3}/i) || [])[0] || '').toUpperCase(); if(!/^ST-\d{4}-\d{3}$/.test(code)) return r;
      const b = $('sheetBody'); if(!b || b.querySelector('.ce2-stu')) return r;
      const h1 = b.querySelector('h1'); if(h1){ h1.classList.add('ce2-n'); h1.title = 'Open the student page'; h1.onclick = () => { closeSheet(); setTimeout(() => openStudent(code), 120); }; }
      const nm = esc(e.student || code);
      b.insertAdjacentHTML('beforeend', `<div class="ce2-stu"><span>${nm} · ${esc(code)}</span>
<button class="btn ghost sm" onclick="closeSheet();setTimeout(()=>openStudent('${code}'),120)">Student page</button>
<button class="btn ghost sm" onclick="closeSheet();setTimeout(()=>stuEdit('${code}'),120)">${pen}Edit details</button>
<button class="btn teal sm" onclick="closeSheet();setTimeout(()=>classForm('${code}'),120)">+ Add a class</button></div>`);
    }catch(x){ console.warn('class sheet student', x); }
    return r; };
})();
