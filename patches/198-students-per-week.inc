/* 15 Oct night · Students (management): how often each student really takes classes, at a glance.
   Worked out by the database from each student's own history (S-MONTHLY, last 6 full months, counted from the first
   class) — the same numbers as "Lessons a week" on the parent picture. Shown as classes a week × usual length, with the
   lessons a week under it; sortable (most first). New students without a full month yet show "new". */
(function(){
  const css = `
#v-astudents .sa-w{display:inline-flex;flex-direction:column;align-items:flex-start;gap:1px;line-height:1.2}
#v-astudents .sa-w b{font-size:13px;font-weight:700;color:#2B2253;white-space:nowrap}
#v-astudents .sa-w small{font-size:11.5px;color:#8A87A0;white-space:nowrap}
#v-astudents .sa-w.lo b{color:#B4513B}
#v-astudents .sa-w.new b{color:#A3A0B5;font-weight:400}
@media(min-width:900px){
  #v-astudents .sa-h,#v-astudents .li.sa{grid-template-columns:minmax(0,1fr) 84px 110px 118px 130px!important}
  #v-astudents .li.sa .sa-w{grid-column:4;justify-self:start}
  #v-astudents .li.sa .sa-d{grid-column:5!important}
}
@media(max-width:899px){ #v-astudents .sa-w{align-items:flex-end;margin-top:4px} }`;
  const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
  let WS = (() => { try{ return localStorage.getItem('coe.stSort') === 'wk'; }catch(e){ return false; } })();
  const up = s => String(s || '').toUpperCase();
  const _ss = window.saSort;
  const keepWk = () => { try{ localStorage.setItem('coe.stSort', 'wk'); }catch(e){} };
  window.saSort = function(k){
    if(k === 'wk'){ WS = true; if(_ss) _ss.call(this, 'name'); else renderAStudents(); keepWk(); return; }   // the list's own sort set to "as given", then most first here
    WS = false; return _ss ? _ss.apply(this, arguments) : renderAStudents(); };
  if(WS && _ss){ try{ _ss('name'); }catch(e){} keepWk(); }
  const cell = s => { const w = s && s.wk; if(!w) return '<span class="sa-w new"><b>new</b><small>no full month yet</small></span>';
    const per = w.cw ? w.cw + '× a week' : w.v + ' a week', len = w.mins ? w.mins + ' min' : '';
    return `<span class="sa-w${w.v < 1 ? ' lo' : ''}" title="From the last ${w.n} month${w.n === 1 ? '' : 's'} of classes"><b>${per}${len ? ' · ' + len : ''}</b><small>${w.v} lesson${w.v === 1 ? '' : 's'} a week</small></span>`; };
  const _r = window.renderAStudents;
  window.renderAStudents = function(){
    let keep = null;
    if(WS && MS){ keep = MS; MS = MS.slice().sort((a, b) => ((b.wk ? b.wk.v : -1) - (a.wk ? a.wk.v : -1)) || String(a.name).localeCompare(String(b.name))); }
    let r; try{ r = _r.apply(this, arguments); } finally { if(keep) MS = keep; }
    try{
      const v = $('v-astudents'); if(!v || !MS) return r; const by = {}; MS.forEach(s => by[up(s.code)] = s);
      if(!MS.some(s => s.wk)) return r;   // the list came from Google (no history worked out yet)
      v.querySelectorAll('.li[onclick^="openStudent"]').forEach(li => { if(li.querySelector('.sa-w')) return;
        const code = up((String(li.getAttribute('onclick') || '').match(/openStudent\('([^']+)'/) || [])[1]), s = by[code]; if(!s) return;
        const right = li.querySelector('.sa-r') || li.lastElementChild; if(!right) return;
        const d = right.querySelector('.sa-d'); if(d) d.insertAdjacentHTML('beforebegin', cell(s)); else right.insertAdjacentHTML('beforeend', cell(s)); });
      const h = v.querySelector('.sa-h');
      if(h && !h.querySelector('[data-wk]')){ const btns = [...h.querySelectorAll('button')], dl = btns.find(b => /Valid until/.test(b.textContent));
        if(WS) btns.forEach(b => { b.classList.remove('on'); b.textContent = b.textContent.replace(/\s*↓$/, ''); });
        const b = `<button data-wk="1" class="${WS ? 'on' : ''}" onclick="saSort('wk')" title="Most classes a week first">A week${WS ? ' ↓' : ''}</button>`;
        if(dl) dl.insertAdjacentHTML('beforebegin', b); else h.insertAdjacentHTML('beforeend', b); }
    }catch(e){ console.warn('per week', e); }
    return r;
  };
  try{ if(VIEW === 'astudents') renderAStudents(); }catch(e){}
})();
