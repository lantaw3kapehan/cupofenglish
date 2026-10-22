// 22 Oct · Misty: New class (management) easier to follow. Same fields and logic, grouped into numbered steps:
// 1 Class type (first, with a one-line meaning) · 2 Student (new-student name, source for a trial, previous classes)
// · Substitute: why the teacher is out (SC only) · 3 Teacher & book · 4 Date & time (weekly package only for Regular).
require('../tools/lib.js')(process.argv[2], [
["\n</body>", `
<script>
/* 571 · New class in steps */
(function(){
  const HINT = { '': 'A lesson in the student\\u2019s package · counted in their lessons', TC: 'A first trial for a new student · not counted · a new ST code is made', SC: 'Another teacher covers a class · not a new lesson for the student' };
  const css = '.cf-s{border:1px solid var(--line,#E6E6EC);border-radius:16px;padding:6px 14px 14px;margin-top:12px;background:#fff}.cf-h{display:flex;align-items:center;gap:8px;margin:8px 0 2px;font-weight:700;font-size:14px;color:#2E2650}.cf-h i{display:inline-flex;align-items:center;justify-content:center;width:22px;height:22px;border-radius:50%;background:#2E2650;color:#fff;font-style:normal;font-size:12px}.cf-hint{font-size:12.5px;color:#6B6884;margin-top:6px}.cf-s>label:first-of-type{margin-top:6px}';
  function sec(n, title, id){ const d = document.createElement('div'); d.className = 'cf-s'; if(id) d.id = id; d.innerHTML = '<div class="cf-h"><i>' + n + '</i>' + title + '</div>'; return d; }
  function build(){
    const b = document.getElementById('sheetBody'); if(!b || !b.querySelector('#cK') || b.querySelector('.cf-s')) return;
    if(!document.getElementById('cfCss')){ const st = document.createElement('style'); st.id = 'cfCss'; st.textContent = css; document.head.appendChild(st); }
    const $$ = id => b.querySelector('#' + id), lbl = el => el && el.previousElementSibling && el.previousElementSibling.tagName === 'LABEL' ? el.previousElementSibling : null;
    const K = $$('cK'), S = $$('cS'); if(!K || !S) return;
    const s1 = sec(1, 'Class type'), s2 = sec(2, 'Student'), s3 = sec(3, 'Teacher & book'), s4 = sec(4, 'Date & time'), sx = sec('!', 'Substitute', 'cfSub');
    const anchor = lbl(S) || S; anchor.parentNode.insertBefore(s1, anchor);
    const kl = lbl(K); if(kl) kl.remove(); s1.appendChild(K); s1.insertAdjacentHTML('beforeend', '<div class="cf-hint" id="cfHint"></div>');
    s1.after(s2); const sl = lbl(S); if(sl) sl.remove(); s2.appendChild(S); ['cSL', 'cNew', 'cSrc', 'cHist'].forEach(id => { const el = $$(id); if(el) s2.appendChild(el); });
    const ab = $$('cAbs'); if(ab){ s2.after(sx); sx.appendChild(ab); ab.style.marginTop = '4px'; }
    const tRow = $$('cT') && $$('cT').closest('.row'); const after2 = ab ? sx : s2; after2.after(s3); if(tRow) s3.appendChild(tRow); const bk = $$('cBk'); if(bk) s3.appendChild(bk);
    const dRow = $$('cD') && $$('cD').closest('.row'); s3.after(s4); if(dRow) s4.appendChild(dRow); const rp = $$('cR') && $$('cR').closest('label'); if(rp) s4.appendChild(rp); const rep = $$('cRep'); if(rep) s4.appendChild(rep);
    update(); }
  function update(){
    const b = document.getElementById('sheetBody'); if(!b || !b.querySelector('.cf-s')) return; const k = (typeof CKIND !== 'undefined' && CKIND) || '';
    const h = b.querySelector('#cfHint'); if(h) h.textContent = HINT[k] || '';
    const sx = b.querySelector('#cfSub'); if(sx) sx.style.display = k === 'SC' ? '' : 'none';
    const tl = b.querySelector('#cT') && b.querySelector('#cT').closest('.grow') && b.querySelector('#cT').closest('.grow').querySelector('label'); if(tl) tl.textContent = k === 'SC' ? 'Substitute teacher' : k === 'TC' ? 'Trial teacher' : 'Teacher';
    const rp = b.querySelector('#cR') && b.querySelector('#cR').closest('label'), on = k === '';
    if(rp){ rp.style.display = on ? '' : 'none'; if(!on && b.querySelector('#cR').checked){ b.querySelector('#cR').checked = false; try{ classRep(); }catch(e){} } }
    const n = [...b.querySelectorAll('.cf-s')].filter(x => x.style.display !== 'none'); n.forEach((x, i) => { const ii = x.querySelector('.cf-h i'); if(ii) ii.textContent = x.id === 'cfSub' ? '!' : String(n.filter(y => y.id !== 'cfSub').indexOf(x) + 1); }); }
  const _f = window.classForm; if(typeof _f === 'function') window.classForm = async function(){ const r = await _f.apply(this, arguments); try{ build(); }catch(e){ console.warn('571', e); } return r; };
  const _k = window.classKind; if(typeof _k === 'function') window.classKind = function(){ const r = _k.apply(this, arguments); try{ update(); }catch(e){} return r; };
  const _p = window.classPrev; if(typeof _p === 'function') window.classPrev = function(){ const r = _p.apply(this, arguments); try{ update(); }catch(e){} return r; };
})();
</script>

</body>`],
]);
