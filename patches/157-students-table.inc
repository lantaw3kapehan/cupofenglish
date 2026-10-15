(function(){
  // 15 Oct · Students (management), quicker to scan on a laptop (Misty: "let's go to STUDENTS screen").
  //  · one compact row per student with fixed columns: Student · Level · Lessons left · Valid until;
  //  · a header row to sort by Name, Lessons left (fewest first) or Valid until (soonest first) · remembered;
  //  · lessons left as a pill (coral at 5 or fewer), an expired deadline in coral;
  //  · each student's source under the name: partner 🤝, student referral 👥, CupOfEnglish ☕, or "Source not set";
  //  · the source also at the top of the student's own page;
  //  · phones keep the card list.
  const css = `
#v-astudents .sa-h{display:none}
@media(min-width:900px){
  #v-astudents .sa-h{display:grid;grid-template-columns:minmax(0,1fr) 84px 110px 130px;gap:14px;align-items:center;padding:8px 14px 6px;margin-top:10px;font-size:12px;letter-spacing:.06em;text-transform:uppercase;color:#8A87A0;position:sticky;top:0;background:var(--bg,#F7F6F3);z-index:2}
  #v-astudents .sa-h button{all:unset;cursor:pointer;color:#8A87A0;white-space:nowrap}
  #v-astudents .sa-h button.on{color:#00737B;font-weight:700}
  #v-astudents .sa-h button:hover{color:#2B2253}
  #v-astudents .li.sa{display:grid;grid-template-columns:minmax(0,1fr) 84px 110px 130px;gap:14px;align-items:center;padding:10px 14px;border-radius:14px}
  #v-astudents .li.sa:hover{background:#fff;box-shadow:0 4px 14px rgba(43,34,83,.06)}
  #v-astudents .li.sa>.av{display:none}
  #v-astudents .li.sa>.sa-r{display:contents}
  #v-astudents .li.sa .sa-c{grid-column:2;justify-self:start}
  #v-astudents .li.sa .sa-l{grid-column:3;justify-self:start}
  #v-astudents .li.sa .sa-d{grid-column:4;justify-self:start}
  #v-astudents .li.sa .grow{grid-column:1}
  #v-astudents .li.sa .tags{margin-top:4px}
}
#v-astudents .sa-l{display:inline-block;font-size:13px;padding:3px 10px;border-radius:999px;background:#EAF6F6;color:#00737B;font-weight:600;white-space:nowrap}
#v-astudents .sa-l.minus{background:#FBEAE5;color:#B4513B}
#v-astudents .sa-l.mute{background:#F1F2F6;color:#8A87A0;font-weight:400}
#v-astudents .sa-d{font-size:13px;white-space:nowrap}
.sa-src{display:inline-flex;align-items:center;gap:4px;margin-top:4px;font-size:11.5px;padding:2px 9px;border-radius:999px;background:#F3F1FA;color:#4C3F8F;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;box-sizing:border-box}
.sa-src.ref{background:#EAF6EF;color:#2F6B4F}
.sa-src.coe{background:#E8F5F6;color:#00737B}
.sa-src.none{background:#FBEAE5;color:#B4513B}
.shero .sa-src{margin-top:0;font-size:12.5px;padding:4px 10px}`;
  const st = document.createElement('style'); st.id = 'sacss'; st.textContent = css; document.head.appendChild(st);

  let SORT = (() => { try{ return localStorage.getItem('coe.stSort') || 'name'; }catch(e){ return 'name'; } })();
  const up = s => String(s || '').toUpperCase();
  function deadlines(){ const out = {}; try{ if(!AT || !AT.cols) return out; const C = {}; AT.cols.forEach((c, i) => C[c] = i);
    (AT.rows || []).forEach(r => { const k = up(r[C.code]); if(!/^ST-/.test(k)) return; if(r[C.active] && r[C.deadline] && (!out[k] || r[C.deadline] < out[k])) out[k] = r[C.deadline]; }); }catch(e){} return out; }
  function sources(){ const out = {}; try{ if(!AT || !AT.cols) return out; const C = {}; AT.cols.forEach((c, i) => C[c] = i); if(C.source == null) return out;
    (AT.rows || []).forEach(r => { const k = up(r[C.code]); if(!/^ST-/.test(k)) return; const v = String(r[C.source] || '').trim(); if(v && (!out[k] || r[C.active])) out[k] = v; else if(!(k in out)) out[k] = ''; }); }catch(e){} return out; }
  function srcTag(v){ v = String(v || '').trim(); if(!v || /^n\/?a$/i.test(v)) return '<span class="sa-src none" title="Add the source in ACTIVE › SOURCE">Source not set</span>';
    const m = v.match(/^(ST-\d{4}-\d{3})\s*[–-]\s*(.+)$/i); if(m) return '<span class="sa-src ref" title="Student referral">👥 Referred by ' + esc(m[2]) + ' (' + esc(m[1].toUpperCase()) + ')</span>';
    if(/^(COE|CupOfEnglish)\b/i.test(v)) return '<span class="sa-src coe" title="Came to CupOfEnglish directly">☕ ' + esc(v.replace(/^COE\b/i, 'CupOfEnglish')) + '</span>';
    return '<span class="sa-src" title="Partner / agent">🤝 ' + esc(v) + '</span>'; }
  const fmtD = x => { const d = new Date(String(x).slice(0, 10) + 'T12:00:00'); return isNaN(d) ? x : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }); };
  // the source also on the student's own page, next to the code and teacher (management only)
  const _sr = window.stuRender;
  if(_sr) window.stuRender = function(){ const r = _sr.apply(this, arguments);
    try{ if(D && D.mgr && typeof STU !== 'undefined' && STU && STU.code){ const row = document.querySelector('#sheetBody .shero .row'); const S = sources(), k = up(STU.code);
      if(row && (k in S) && !row.querySelector('.sa-src')) row.insertAdjacentHTML('beforeend', srcTag(S[k])); } }catch(e){}
    return r; };
  window.saSort = function(k){ SORT = k; try{ localStorage.setItem('coe.stSort', k); }catch(e){} renderAStudents(); };
  const _r = window.renderAStudents;
  window.renderAStudents = function(){
    let keep = null;
    try{ if(MS && SORT !== 'name'){ keep = MS; const dl = SORT === 'dl' ? deadlines() : null;
      MS = MS.slice().sort((a, b) => SORT === 'left' ? ((a.left == null ? 1e9 : a.left) - (b.left == null ? 1e9 : b.left)) || String(a.name).localeCompare(String(b.name))
        : String(dl[up(a.code)] || '9999').localeCompare(String(dl[up(b.code)] || '9999')) || String(a.name).localeCompare(String(b.name))); } }catch(e){ keep = null; }
    let r; try{ r = _r.apply(this, arguments); } finally { if(keep) MS = keep; }
    try{
      const v = $('v-astudents'); if(!v) return r;
      const rows = v.querySelectorAll('.li[onclick^="openStudent"]'); if(!rows.length) return r;
      const SRC = sources(), hasSrc = Object.keys(SRC).length > 0;
      rows.forEach(li => { try{ const code = up((String(li.getAttribute('onclick') || '').match(/openStudent\('([^']+)'/) || [])[1]); const g = li.querySelector('.grow'); if(hasSrc && g && code && (code in SRC) && !g.querySelector('.sa-src')) g.insertAdjacentHTML('beforeend', '<div>' + srcTag(SRC[code]) + '</div>'); }catch(e){} });
      rows.forEach(li => { const right = li.lastElementChild; if(!right || right.classList.contains('grow')) return; li.classList.add('sa'); right.classList.add('sa-r');
        [...right.children].forEach(c => { const t = c.textContent.trim(); if(c.classList.contains('chip')) c.classList.add('sa-c'); else if(/^by /.test(t)){ c.classList.add('sa-d'); c.textContent = 'by ' + fmtD(t.slice(3)); } else if(/left|—|shared/.test(t)) c.classList.add('sa-l'); }); });
      const first = rows[0]; if(first && !v.querySelector('.sa-h')){ const b = (k, l) => `<button class="${SORT === k ? 'on' : ''}" onclick="saSort('${k}')">${l}${SORT === k ? ' ↓' : ''}</button>`;
        first.insertAdjacentHTML('beforebegin', `<div class="sa-h">${b('name', 'Student')}<span>Level</span>${b('left', 'Lessons left')}${b('dl', 'Valid until')}</div>`); }
    }catch(e){ console.warn('students table', e); }
    return r;
  };
  try{ if(VIEW === 'astudents') renderAStudents(); }catch(e){}
})();
