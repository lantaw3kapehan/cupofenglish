// 1704: (Misty, 2 Nov 10:37, Becky's adult Learning plan) "for adult CEFR I click Pre-A1 but it's showing A1 here?" · the adult
//   plan had one "Pre-A1 / A1" button and the picture always printed "A1". Now there are separate Pre-A1 and A1 buttons (same
//   suggested books), the one matching the trial report is picked at first (Becky: Pre-A1 · 9/36), and the picture shows what is picked.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["seg('cpBa', BANDS.map(b => [b, b === 'A1' ? 'Pre-A1 / A1' : b === 'B2' ? 'B2+' : b]), CP.band, 'cpBand')",
   "seg('cpBa', [['PA1', 'Pre-A1']].concat(BANDS.map(b => [b, b === 'B2' ? 'B2+' : b])), CP.band === 'A1' && CP.pre ? 'PA1' : CP.band, 'cpBand')"],
  ["window.coursePlan = function(o){ o = o || {}; CP = { o: o, bk: (o.student && CPB[o.student]) || sugg(o), ad: !!o.adult, goal: o.goal && AG[o.goal] ? o.goal : 'daily', band: bandOf(o.cefr) }; cpSheet(); };",
   "window.coursePlan = function(o){ o = o || {}; CP = { o: o, bk: (o.student && CPB[o.student]) || sugg(o), ad: !!o.adult, goal: o.goal && AG[o.goal] ? o.goal : 'daily', band: bandOf(o.cefr), pre: /^pre/i.test(String(o.cefr || '')) ? 1 : 0 }; cpSheet(); };"],
  ["window.cpBand = function(b){ CP.band = b; cpSheet(); };",
   "window.cpBand = function(b){ if(b === 'PA1'){ CP.band = 'A1'; CP.pre = 1; } else { CP.band = b; CP.pre = 0; } cpSheet(); };   /* 1704 */"],
  ["y = coeHero(T, CP.band === 'B2' ? 'B2+' : CP.band, G.en,",
   "y = coeHero(T, CP.band === 'B2' ? 'B2+' : CP.band === 'A1' && CP.pre ? 'Pre-A1' : CP.band, G.en,"]
]);
