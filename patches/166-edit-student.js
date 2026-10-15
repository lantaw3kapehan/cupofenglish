// 15 Oct · Edit a student from the app (Misty: "an EDIT BUTTON … right now we make edits to the excel").
//  · "Edit" in the student page's Profile header (next to Open in sheet), in the top buttons, and in a trial's details;
//    it opens the DATABASE form on the student's latest row, filled in (names, birthdate, gender, grade, city,
//    trial, first class, lessons, CEFR & books, free lessons…);
//  · the form gets a Source field (pick from the sources already used, or type a new one) · saved into DATABASE › SOURCE
//    once the STUEDIT server paste is in (before that it is simply not saved, nothing else changes);
//  · the source tags (Students, Trials, student page) now show DATABASE › SOURCE = where the student came from, and only
//    fall back to ACTIVE › SOURCE (the package's source) when DATABASE has none.
require('../tools/lib.js')(process.argv[2], [
["recommended: d(r[21]), free: c(23) }; };", "recommended: d(r[21]), source: c(22), free: c(23) }; };"],
["sRc: 'recommended', sEnd: 'ended' };", "sRc: 'recommended', sEnd: 'ended', sSrc: 'source' };"],
["`<label>City</label>${inp('sCity',v.city,'text','Dongguan')}`)}", "`<label>City</label>${inp('sCity',v.city,'text','Dongguan')}`)}\n<label>Source <span class=\"mute small\">· partner, referring student or CupOfEnglish</span></label><input id=\"sSrc\" class=\"in-t\" list=\"sSrcL\" value=\"${esc(v.source||'')}\" placeholder=\"Pick or type · e.g. Jinan – Dr. Rose · ST-2024-068 – Dudu · COE – Misty\" autocomplete=\"off\"><datalist id=\"sSrcL\">${(() => { const S = {}; ((typeof DB !== 'undefined' && DB && DB.rows) || []).forEach(r => { const x = String(r[22] || '').trim(); if(x && !/^n\\/?a$/i.test(x)) S[x] = (S[x] || 0) + 1; }); return Object.keys(S).sort((a, b) => S[b] - S[a]).slice(0, 80).map(x => '<option value=\"' + esc(x) + '\">').join(''); })()}</datalist>"],
["recommended:v('sRc'), ended:v('sEnd')};", "recommended:v('sRc'), ended:v('sEnd'), source:v('sSrc')};"],
// source tags: DATABASE first
["if(v && (!out[k] || r[C.active])) out[k] = v; else if(!(k in out)) out[k] = ''; }); }catch(e){} return out; }",
 "if(v && (!out[k] || r[C.active])) out[k] = v; else if(!(k in out)) out[k] = ''; }); }catch(e){}\n    try{ if(typeof DB !== 'undefined' && DB && DB.rows){ const seen = {}; DB.rows.forEach(r => { const k = up(r[0]); if(!/^ST-/.test(k) || seen[k]) return; seen[k] = 1; const v = String(r[22] || '').trim(); if(v && !/^n\\/?a$/i.test(v)) out[k] = v; }); } }catch(e){}   /* 166: DATABASE first */\n    return out; }"],
["if(/^ST-/.test(k) && v && (r[C.active] || !out[k])) out[k] = v; }); } }catch(e){}", "if(/^ST-/.test(k) && v && !out[k]) out[k] = v; }); } }catch(e){}   /* 166: DATABASE first, ACTIVE only when blank */"],
["\n</script>\n\n</body>", `
</script>
<script>
(function(){
  const PEN = '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="vertical-align:-2px;margin-right:6px"><path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16z"/><path d="M13.5 6.5l4 4"/></svg>';
  const up = s => String(s || '').trim().toUpperCase();
  window.stuEdit = async function(code){ code = up(code); if(!/^ST-/.test(code)) return toast('No student code yet · add it in DATABASE first');
    if(typeof DB === 'undefined' || !DB){ toast('Opening the student’s DATABASE row…'); try{ await loadDb(true); }catch(e){} }
    const r = ((typeof DB !== 'undefined' && DB && DB.rows) || []).find(x => up(x[0]) === code);
    if(!r) return toast(code + ' is not in DATABASE yet');
    closeSheet(); setTimeout(() => stuForm(r[r.length - 1], r[0]), 120); };
  const btn = (code, cls) => '<button class="btn ' + (cls || 'ghost') + ' sm s2-edit" onclick="event.stopPropagation();stuEdit(\\'' + esc(code) + '\\')">' + PEN + 'Edit details</button>';
  // student page: top buttons + Profile header
  const _sr = window.stuRender;
  if(_sr) window.stuRender = function(){ const r = _sr.apply(this, arguments);
    try{ if(D && D.mgr && typeof STU !== 'undefined' && STU && STU.code){ const b = $('sheetBody'); if(b){
      const ag = [...b.querySelectorAll('button')].find(x => /^Agreement$|^Lesson summary$/.test(x.textContent.trim()) && x.closest('.row, div'));
      if(ag && !b.querySelector('.s2-edit')) ag.insertAdjacentHTML('afterend', btn(STU.code, 'ghost'));
      const ph = [...b.querySelectorAll('h2')].find(h => /^\\s*Profile/.test(h.textContent));
      if(ph && !ph.querySelector('.s2-edit')){ const lk = ph.querySelector('a'); (lk || ph).insertAdjacentHTML(lk ? 'beforebegin' : 'beforeend', btn(STU.code, 'teal')); }
    } } }catch(e){}
    return r; };
  // trial details
  if(typeof tlOpen === 'function'){ const _tl = tlOpen;
    tlOpen = async function(){ const r = await _tl.apply(this, arguments);
      try{ const b = $('sheetBody'); if(D && D.mgr && b && !b.querySelector('.s2-edit')){ const m = (b.textContent || '').slice(0, 600).match(/ST-\\d{4}-\\d{3}/); const h1 = b.querySelector('h1');
        if(m && h1) h1.insertAdjacentHTML('afterend', '<div style="margin:8px 0 4px">' + btn(m[0], 'ghost') + '</div>'); } }catch(e){}
      return r; }; }
  const st = document.createElement('style'); st.textContent = '.s2-edit{white-space:nowrap}h2 .s2-edit{margin-left:10px;font-family:var(--f,inherit);font-size:13px;vertical-align:middle}';
  document.head.appendChild(st);
})();
</script>

</body>`],
]);
