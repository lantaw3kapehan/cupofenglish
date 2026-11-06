// 1813: (Misty 6 Nov 18:47 "in TO DO, trial, Lewis is here? when he's already enrolled?") Lewis ST-2025-067 is an existing student
//   (68-lesson package since 9 May 2026); his 18 Oct "trial" was a try-out with a new teacher (Christian) before moving to Mayi.
//   Trial follow-ups now leave out a student who already had an active, enrolled package that started before the trial — they are
//   not a new enrolment to chase. Also left out of the "Trials not followed up" count on Overview.
const lib = require('../tools/lib.js'), file = process.argv[2];
lib(file, [
  ["  function pkg(code, trial){ try{",
   "  window.tdExisting1813 = function(code, trial){ try{ if(!(typeof AT !== 'undefined' && AT && AT.cols && AT.rows)) return false; const C = {}; AT.cols.forEach((c, i) => C[c] = i);   /* 1813 */\n"
   + "    let t0 = String(trial || ''); if(!/^\\d{4}-\\d{2}-\\d{2}/.test(t0)){ const d = new Date(t0); t0 = isNaN(d) ? '' : ymdLocal(d); } t0 = t0.slice(0, 10); if(!t0) return false;\n"
   + "    return AT.rows.some(r => up(r[C.code]) === up(code) && +r[C.enrolled] > 0 && (C.active == null || r[C.active] === true || r[C.active] === 'TRUE') && C.start != null && /^\\d{4}-\\d{2}-\\d{2}/.test(String(r[C.start] || '')) && String(r[C.start]).slice(0, 10) < t0); }catch(e){ return false; } };\n"
   + "  function pkg(code, trial){ try{"],
  ["      const P = code ? pkg(code, ymd) : null;",
   "      if(code && ymd && window.tdExisting1813(code, ymd)){ row.remove(); return; }   /* 1813: already a student before the trial */\n      const P = code ? pkg(code, ymd) : null;"],
  ["return (!fu || /not set/i.test(fu)) && !TFU[tfuKey(r[0], r[1])]; });",
   "return (!fu || /not set/i.test(fu)) && !TFU[tfuKey(r[0], r[1])] && !(window.tdExisting1813 && tdExisting1813(r[2], r[0])); });   /* 1813 */"],
]);
