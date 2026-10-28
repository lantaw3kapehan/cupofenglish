// 1562 · Dialogs opened from a trial use that learner's type, market and course (29 Oct 2026, Misty's audit: "Will is Adult · business
// and must not default to Kids & teens").
// Trials › a report › Price picture / Course plan / CEFR picture were opened with only the name, level and score, so Price picture and
// Course plan always started on "Kids & teens". They now pass the trial's Learner type (the report's group, set by the teacher or in the
// trial card) explicitly, and it wins over anything remembered:
//   Young learner / Teen → Kids & teens · Adult (18+) → Adults, goal Daily speaking · Adult · work English → Adults, goal Work ·
//   Adult · business English → Adults, goal Business. No learner type on the report → unchanged (you pick, as before).
// A Philippine learner (Students › Student access › Market = Philippines) opens the Philippine price list / roadmap on their programme and
// track (the PH toolkit, unchanged). The Service agreement already chose English for PH learners (1538), unchanged.
// Nothing stored changes; the pictures themselves are unchanged.
require('../tools/lib.js')(process.argv[2], [
  ['onclick="pricePic({ student: TLD.student, cn: TLD.cn', 'onclick="pricePic({ ...trLearner1562(TLD), student: TLD.student, cn: TLD.cn'],
  ['onclick="coursePlan({ student: TLD.student, cn: TLD.cn', 'onclick="coursePlan({ ...trLearner1562(TLD), student: TLD.student, cn: TLD.cn'],
  ['onclick="cefrPic({ student: TLD.student, cn: TLD.cn', 'onclick="cefrPic({ ...trLearner1562(TLD), student: TLD.student, cn: TLD.cn']
]);
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8'); const i = s.lastIndexOf('</body>');
s = s.slice(0, i) + String.raw`<script>
/* 1562 · trial dialogs: the trial's learner type wins */
(function(){ if(window.__1562) return; window.__1562 = 1;
  window.trLearner1562 = function(t){ if(!t) return {};
    try{ var c = String(t.code || '').toUpperCase(), L = window.phLearners1535 ? phLearners1535() : null, p = L && L[c];
      if(p && p.prog) return { ph: p.prog, rec: p.track || '', _ph: { pid: p.prog, tid: p.track || '' } }; }catch(e){}
    var g = String(t.group || '').trim(); if(!g) return {};
    if(/^adult/i.test(g)) return { adult: 1, ielts: 0, pet: 0, ket: 0, goal: /business/i.test(g) ? 'business' : /work/i.test(g) ? 'work' : 'daily', _lt: g };
    return { adult: 0, ielts: 0, pet: 0, ket: 0, _lt: g }; };
  var _cp = window.coursePlan; if(typeof _cp === 'function') window.coursePlan = function(o){ o = o || {};
    if(o._ph && typeof window.phRoadPic === 'function') return phRoadPic(o._ph.pid, o._ph.tid);
    var r = _cp.apply(this, arguments); try{ if(o._lt && o.adult && o.goal && typeof cpGoal === 'function') cpGoal(o.goal); }catch(e){} return r; };
  var _cf = window.cefrPic; if(typeof _cf === 'function') window.cefrPic = function(o){ if(o && o._ph && typeof window.phRoadPic === 'function') return phRoadPic(o._ph.pid, o._ph.tid); return _cf.apply(this, arguments); };
})();
</script>
` + s.slice(i);
fs.writeFileSync(file, s);
console.log('1562 trial dialogs use the learner type');
