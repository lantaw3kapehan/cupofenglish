// 20/21 Oct · To do › Trial follow-ups: a trial whose student already has a package in ACTIVE reads "✓ Enrolled", not "Enrolling"; the same trial listed twice shows once.
require('../tools/lib.js')(process.argv[2], [["\n</script>\n\n</body>", "\n</script>\n<script>\n" + `/* 21 Oct · 487 · Misty: "the trial students ENROLLING status here, actually they have already enrolled, so can it auto detect too and change the wordings?"
   · Each trial follow-up row is checked against ACTIVE: the student's code has a ticked package (lessons enrolled) that started on or after
     the trial (or has no start yet) → the chip reads "✓ Enrolled · 33 lessons · ACTIVE row 7" in green and the row is shown as done.
   · "Enrolling" without a package yet now reads "Enrolling · waiting for the package" (said yes, payment not recorded yet).
   · The same trial listed twice (same student, same trial date) shows once (Elsa appeared twice).
   ACTIVE is read from the app's own copy (loaded once in the background if To do opens first). */
(function(){
  const css = document.createElement('style');
  css.textContent = '#td-follow .tdr.e87{opacity:.78} #td-follow .tdr.e87 .tdn{background:#EEF8F3!important;color:#1F6B45!important} #td-follow .tdr.e87 .tdn b,#td-follow .tdr.e87 .tdn span{color:#1F6B45!important}';
  document.head.appendChild(css);
  const up = s => String(s || '').trim().toUpperCase();
  let asked = false;
  function pkg(code, trial){ try{ if(!(typeof AT !== 'undefined' && AT && AT.cols && AT.rows)) return null; const C = {}; AT.cols.forEach((c, i) => C[c] = i);
    const t0 = String(trial || '').slice(0, 10);
    const R = AT.rows.filter(r => up(r[C.code]) === up(code) && +r[C.enrolled] > 0 && (C.active == null || r[C.active] === true || r[C.active] === 'TRUE'));
    const r = R.find(r => { const s = C.start != null ? String(r[C.start] || '').slice(0, 10) : ''; return !s || !t0 || s >= t0 || /^\\d{4}-\\d{2}-\\d{2}/.test(s) === false; }); if(!r) return null;
    return { row: C.row != null ? r[C.row] : '', n: r[C.enrolled], left: C.available != null ? r[C.available] : '' }; }catch(e){ return null; } }
  function tidy(){ const sec = document.getElementById('td-follow'); if(!sec) return;
    if(!(typeof AT !== 'undefined' && AT && AT.cols) && !asked){ asked = true; api('mgmtActive', TOKEN).then(v => { if(v && v.cols){ AT = v; if(VIEW === 'mtoday') renderMToday(); } }).catch(() => {}); }
    const seen = {};
    sec.querySelectorAll('.tdr').forEach(row => {
      const code = ((row.textContent.match(/ST-\\d{4}-\\d{3}/) || [])[0] || ''), trial = ((row.textContent.match(/Trial ([A-Z][a-z]{2} \\d{1,2})/) || [])[1] || ''), nm = ((row.querySelector('.nm, b') || {}).textContent || '').trim();
      const key = (code || nm) + '|' + trial; if(seen[key]){ row.remove(); return; } seen[key] = 1;
      const chip = [...row.querySelectorAll('.tags .chip')].find(c => /^Enrolling\\b/.test(c.textContent.trim())); if(!chip && !code) return;
      const ymd = (() => { const m = trial.match(/([A-Z][a-z]{2}) (\\d{1,2})/); if(!m) return ''; const mi = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].indexOf(m[1]), now = new Date(); let y = now.getFullYear(); if(mi > now.getMonth()) y--; return y + '-' + String(mi + 1).padStart(2, '0') + '-' + String(m[2]).padStart(2, '0'); })();
      const P = code ? pkg(code, ymd) : null;
      if(P){ const txt = '✓ Enrolled · ' + P.n + ' lessons' + (P.row ? ' · ACTIVE row ' + P.row : '');
        if(chip){ chip.textContent = txt; chip.className = 'chip green'; }
        else { const tg = row.querySelector('.tags'); if(tg && !tg.querySelector('.e87c')) tg.insertAdjacentHTML('beforeend', '<span class="chip green e87c">' + esc(txt) + '</span>'); }
        row.classList.add('e87'); row.removeAttribute('data-focus');
        [...row.querySelectorAll('.tags .chip')].forEach(c => { if(/paid · ACTIVE row/.test(c.textContent) && c !== chip) c.remove(); }); }
      else if(chip && !/waiting for the package/.test(chip.textContent)){ chip.textContent = chip.textContent.replace(/^Enrolling\\b/, 'Enrolling · waiting for the package'); chip.className = 'chip amber'; }
    }); }
  const _r = window.renderMToday; if(_r) window.renderMToday = function(){ const r = _r.apply(this, arguments); try{ tidy(); }catch(e){ console.warn('e87', e); } return r; };
  try{ if(typeof VIEW !== 'undefined' && VIEW === 'mtoday') renderMToday(); }catch(e){}
})();
` + "</script>\n\n</body>"]]);
