// 798: (Misty) "for Will the roadmap is still for young learners"
// · The faster "Send trial report" (sends in the background) left out the Learner type the teacher picked, so Google fell back to the
//   default (young learner) roadmap: Oxford Discover → Reading Explorer, Flyers/KET. It now sends the Learner type again.
// · It is also required again before sending (the faster send skipped that check).
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["const ctx = Object.assign({}, TRC), body = { picks: TRS.picks.slice(), texts: TRS.texts.slice(), cefr: '' }, key = trKey();",
   "if(!TRS.group){ toast('Pick the learner type · young learner, teen or adult'); const eg = $('trGrp'); if(eg) eg.scrollIntoView({ behavior: 'smooth', block: 'center' }); return; }\nconst ctx = Object.assign({}, TRC), body = { picks: TRS.picks.slice(), texts: TRS.texts.slice(), cefr: '', group: TRS.group || '' }, key = trKey();"]
]);
