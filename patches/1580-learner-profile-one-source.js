// 1580: (Misty, 29 Oct · Students audit, item 1) every dialog uses the right student's learner type, market, course and level.
// Root causes found:
//  · Amy (ST-2026-021, 9, Young learner on her trial report) showed "Adult · business" in her Renewal · step by step: patch 800 put the
//    trial card's learner-type box (built from TLD, the LAST trial card opened, here Will's) into the first `.tl4` box of any open card.
//    The renewal step-by-step on the student page uses the same `.tl4` styling, so it got Will's box, and a tap on it would have saved
//    Will's report. Now only the trial card (#tlAct) gets it.
//  · Will (ST-2026-123, trial report "Adult · business English", course BusinessEnglish, no age on DATABASE) got Kids & teens in the
//    trial card's Course plan and Price picture: those buttons never passed the learner type, and isAdult() only looked at age/grade.
//    Now one function, coeLearner(code), decides (trial report → course → age/grade → student list), and the dialogs default from it.
//  · The renewal form took the teacher from STU (the last student page opened) when no teacher was passed; now only if it is the same student.
const lib = require('../tools/lib.js'), file = process.argv[2];
lib(file, [
  // 800: the learner-type box only on the trial card
  ["const t = (typeof TLD !== 'undefined') ? TLD : null, w = document.querySelector('#sheetBody .tl4'); if(!t || !w) return;",
   "const t = (typeof TLD !== 'undefined') ? TLD : null, w = document.querySelector('#sheetBody #tlAct.tl4'); if(!t || !w) return;   /* 1580: the trial card only, never the renewal step-by-step */"],
  ["if(document.querySelector('#sheetBody .tl4') && !document.querySelector('#sheetBody .tl4 #tlGrp')) fix();",
   "if(document.querySelector('#sheetBody #tlAct.tl4') && !document.querySelector('#sheetBody #tlAct.tl4 #tlGrp')) fix();"],
  // course plan: the goal can be passed (adult business → Business English)
  ["CP = { o: o, bk: (o.student && CPB[o.student]) || sugg(o), ad: !!o.adult, goal: 'daily', band: bandOf(o.cefr) };",
   "CP = { o: o, bk: (o.student && CPB[o.student]) || sugg(o), ad: !!o.adult, goal: o.goal && AG[o.goal] ? o.goal : 'daily', band: bandOf(o.cefr) };"],
  // renewal form: the teacher of THIS student only
  ["const tch0 = teacher || (typeof STU !== 'undefined' && STU && STU.s && (STU.s.teachers || [])[0]) || '';",
   "const tch0 = teacher || (typeof STU !== 'undefined' && STU && STU.s && String(STU.code || '').toUpperCase() === String(code || '').toUpperCase() && (STU.s.teachers || [])[0]) || '';   /* 1580 */"],
  // isAdult: the trial report's learner type and the course count too (Will: no age, Business English)
  ["const r = DB && DB.rows && DB.rows.find(x => String(x[0] || '').toUpperCase() === code); if(r){ const gr = String(r[8] || '').trim(); return /^(WA|UM|U\\d|PhD|ADULT)$/i.test(gr) || (+r[6] >= 20 && !/^(G\\d+|GK)$/i.test(gr)); } return false; };",
   "const r = DB && DB.rows && DB.rows.find(x => String(x[0] || '').toUpperCase() === code); if(r){ const gr = String(r[8] || '').trim(); if(/^(WA|UM|U\\d|PhD|ADULT)$/i.test(gr) || (+r[6] >= 20 && !/^(G\\d+|GK)$/i.test(gr))) return true; }\n  try{ if(window.coeLearner){ const L = coeLearner(code); if(L.adult != null) return L.adult; } }catch(e){} return false; };   /* 1580 */"],
  ["</body>\n</html>",
   `<script id="coe-learner">
/* 1580 · ONE learner profile for every student dialog (course plan, price picture, messages, renewal, payment confirmation).
   coeLearner(code, hint) → { code, adult: true|false|null (null = not known), kind: 'kid'|'teen'|'adult'|'', group, goal: 'daily'|'work'|'business',
   exam: 'ielts'|'pet'|'ket'|'', course, age, source, market: 'cn'|'ph', phProg, from }.
   Order: the trial report's learner type (what management set) → the course on DATABASE → age / grade on DATABASE → the student list.
   Nothing here is saved; it only decides defaults. Every dialog still lets you change it. */
(function(){
  if(window.coeLearner) return;
  const AD = /business|dk ?english|pathways|market ?leader|daily ?english|adult/i, KID = /^(the ?alphabet|od ?\\d|wonders|phonics|short ?vowels|long ?vowels|consonant|letter ?blends|raz|re-?f\\b|winter reading|opw)/i;
  const up = s => String(s || '').trim().toUpperCase();
  function trialGroup(code){ try{ const T = (typeof TRL !== 'undefined' && TRL && TRL.rows) || []; const t = T.filter(x => up(x.code) === code && (x.group || x._g)).sort((a, b) => String(b.date).localeCompare(String(a.date)))[0]; return t ? (t._g || t.group) : ''; }catch(e){ return ''; } }
  window.coeLearner = function(code, hint){ hint = hint || {}; code = up(code);
    const o = { code, adult: null, kind: '', group: '', goal: 'daily', exam: '', course: '', age: null, grade: '', source: '', market: 'cn', phProg: '', from: '' };
    let r = null; try{ r = code && typeof DB !== 'undefined' && DB && DB.rows ? DB.rows.find(x => up(x[0]) === code) : null; }catch(e){}
    if(r){ o.course = String(r[12] || '').trim(); o.source = String(r[22] || '').trim(); o.grade = String(r[8] || '').trim();
      const b = String(r[5] || ''); if(/^\\d{4}-\\d{2}-\\d{2}/.test(b)){ const d = new Date(b.slice(0, 10) + 'T00:00:00'), n = new Date(); let a = n.getFullYear() - d.getFullYear(); if(n.getMonth() < d.getMonth() || (n.getMonth() === d.getMonth() && n.getDate() < d.getDate())) a--; if(a >= 2 && a < 100) o.age = a; }
      if(o.age == null && +r[6] > 0) o.age = +r[6]; }
    if(!o.course && hint.course) o.course = String(hint.course);
    let s = null; try{ s = code && Array.isArray(MS) ? MS.find(x => up(x.code) === code) : null; }catch(e){}
    if(!o.course && s && s.book) o.course = String(s.book);
    const c = o.course;
    o.exam = /ielts/i.test(c) ? 'ielts' : /(^|[^a-z])pet([^a-z]|$)|cambridge ?pet/i.test(c) ? 'pet' : /(^|[^a-z])ket([^a-z]|$)|cambridge ?ket/i.test(c) ? 'ket' : '';
    const g = hint.group || trialGroup(code);
    if(g && !/pick/i.test(g)){ o.group = g; o.adult = /^adult/i.test(g); o.kind = o.adult ? 'adult' : /teen/i.test(g) ? 'teen' : 'kid'; o.from = 'trial report'; }
    else if(AD.test(c)){ o.adult = true; o.kind = 'adult'; o.from = 'course'; }
    else if(KID.test(c)){ o.adult = false; o.kind = o.age != null && o.age >= 11 ? 'teen' : 'kid'; o.from = 'course'; }
    else if(/^(WA|UM|U\\d|PhD|ADULT)$/i.test(o.grade) || (o.age != null && o.age >= 18 && !/^(G\\d+|GK)$/i.test(o.grade))){ o.adult = true; o.kind = 'adult'; o.from = 'age'; }
    else if(o.age != null || /^(G\\d+|GK)$/i.test(o.grade)){ o.adult = false; o.kind = o.age != null && o.age <= 10 ? 'kid' : 'teen'; o.from = 'age'; }
    else if(s && s.adult != null){ o.adult = !!s.adult; o.kind = s.adult ? 'adult' : ''; o.from = 'student list'; }
    const gs = (o.group || '') + ' ' + (o.adult ? c : '');
    o.goal = /business|market ?leader/i.test(gs) ? 'business' : /work/i.test(gs) ? 'work' : 'daily';
    try{ if(code && window.isPhLearner && isPhLearner(code)){ o.market = 'ph'; const P = (window.phLearners1535 && phLearners1535()) || {}, x = P[code] || {}; o.phProg = /ielts/i.test(String(x.prog || '') + ' ' + c) ? 'ielts' : 'adult'; o.phTrack = x.track || ''; } }catch(e){}
    o.label = o.kind === 'adult' ? (o.goal === 'business' ? 'Adult · business' : o.goal === 'work' ? 'Adult · work' : 'Adult') : o.kind === 'teen' ? 'Teen (11–17)' : o.kind === 'kid' ? 'Young learner' : 'Not known yet';
    return o; };
  /* the trial card's Course plan / Price picture pass only the name: take the learner from that trial (TLD) or the student */
  const who = o => { let code = o.code || '', hint = o.group || o.learner ? { group: o.group || o.learner } : {};   /* an explicit learner type passed in always wins */ try{ if(typeof TLD !== 'undefined' && TLD && (!o.student || TLD.student === o.student)){ if(!code) code = TLD.code || ''; if(TLD.student === o.student && !hint.group) hint = { group: TLD._g || TLD.group || '' }; } }catch(e){} return coeLearner(code, hint); };
  const cp0 = window.coursePlan; if(typeof cp0 === 'function') window.coursePlan = function(o){ o = Object.assign({}, o || {});
    try{ if(o.student && o.adult == null && !o.enq){ const L = who(o); if(L.adult != null){ o.adult = L.adult; if(L.adult && !o.goal) o.goal = L.goal; } } }catch(e){}
    return cp0.call(this, o); };
  const pp0 = window.pricePic; if(typeof pp0 === 'function') window.pricePic = function(o){ o = Object.assign({}, o || {});
    try{ if(o.student && !o.ph && o.adult == null && !o.ielts && !o.pet && !o.ket && !o.enq){ const L = who(o);
        if(L.market === 'ph') return pp0.call(this, { ph: L.phProg || 'adult', rec: L.phTrack || undefined });
        if(L.exam === 'ielts') o.ielts = 1; else if(L.exam === 'pet') o.pet = 1; else if(L.exam === 'ket') o.ket = 1; else if(L.adult != null) o.adult = L.adult; } }catch(e){}
    return pp0.call(this, o); };
})();
</script>
</body>
</html>`]
]);
