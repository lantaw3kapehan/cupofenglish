// 1545 · Philippine Young Learners 1:1 and Teens 1:1 (29 Oct 2026, Misty 02:56 / 03:19).
// Two more PH programmes in docs sys:pricing_ph (ids yle, teens): 15 / 30 / 60 lessons at ₱6,750 / ₱13,500 / ₱27,000 (₱450 per 50-minute
// lesson, no free lessons), 50-minute lessons that can be split into two 25-minute halves (0.5 each, as China), tracks Foundation /
// Consolidation / Advancement (China's kids stage names; track ids stay foundation / professional / mastery so saved records keep working).
// Young Learners: CEFR Pre-A1 Starters → A1 Movers → A2 Flyers. Teens: A2 → B1 → B2, "ready for KET / PET" on Advancement (as China says).
// Content mirrors China's kids / teens stages in parent-facing Philippine English; no exam-pass promises, no Chinese-market references.
// Everywhere PH programmes appear: the PH price sheet (Learner: Adult English · IELTS · Young Learners · Teens), the PH price list and roadmap
// pictures (same design: "EXPERT PREMIUM PROGRAM" / "Young Learners 1:1" / "Teens 1:1"), New enquiry "Interested in" (+ track chips),
// enquiry rows, Student access › Market (programme list from the doc; coe-student v25 accepts yle / teens), the portal, the English agreement.
// China: unchanged.
const fs = require('fs'), file = process.argv[2], R = String.raw;
require('../tools/lib.js')(file, [
  // the price sheet: the PH programme comes from PP.pid (Adult / IELTS as before)
  ["return D && (D.programs || []).find(x => x.id === (PP && PP.ad === 2 ? 'ielts' : 'adult')) || null; };",
   "return D && (D.programs || []).find(x => x.id === (PP && PP.pid ? PP.pid : PP && PP.ad === 2 ? 'ielts' : 'adult')) || null; };"],
  ["PP = { o: {}, m: 'ph', rec: o.rec ? ({ foundation: 'f', professional: 'c', mastery: 'a' })[o.rec] || 'c' : 'c', ad: o.ph === 'ielts' ? 2 : true }; return ppSheet(); }",
   "PP = { o: {}, m: 'ph', pid: o.ph === true ? 'adult' : String(o.ph), rec: o.rec ? ({ foundation: 'f', professional: 'c', mastery: 'a' })[o.rec] || 'c' : 'c', ad: o.ph === 'ielts' ? 2 : true }; return ppSheet(); }"],
  ["(PP.m === 'ph' ? [, 'Adult English 1:1', 'IELTS 1:1'] : ['Kids &amp; teens · 4–17', 'Adults · 18+', 'IELTS', 'PET', 'KET']).map((t, i) => '<button class=\"' + ((+PP.ad || 0) === i ? 'on' : '') + '\" onclick=\"ppAd(' + i + ')\">' + t + '</button>').join('')",
   "(PP.m === 'ph' ? phSeg1545(PP.pid) : ['Kids &amp; teens · 4–17', 'Adults · 18+', 'IELTS', 'PET', 'KET'].map((t, i) => '<button class=\"' + ((+PP.ad || 0) === i ? 'on' : '') + '\" onclick=\"ppAd(' + i + ')\">' + t + '</button>').join(''))"],
  ["const b = await phPricePic1539(PP.ad === true ? 'adult' : 'ielts', PP.rec);", "const b = await phPricePic1539(PP.pid || (PP.ad === true ? 'adult' : 'ielts'), PP.rec);"],
  ["const nm = () => 'CupOfEnglish-price' + (PP.m === 'ph' ? '-ph' : '') + (PP.ad === 4",
   "const nm = () => 'CupOfEnglish-price' + (PP.m === 'ph' ? '-ph' + (PP.pid && PP.pid !== 'adult' && PP.pid !== 'ielts' ? '-' + PP.pid : '') : '') + (PP.ad === 4"],
  // the PH pictures: headline + "who it is for" from the programme
  ["y = head(T, y + 4, 'EXPERT PREMIUM PROGRAM', band ? 'IELTS' : 'Adult English', '1:1', band ? 'One learner. One teacher. One clear goal.' : P.tagline || '');\n      y = band ? pathways(T, y) : chips(T, y, [['work', 'Work & career'], ['plane', 'Travel'], ['chat', 'Everyday conversations'], ['present', 'Presentations']]);",
   "y = head(T, y + 4, 'EXPERT PREMIUM PROGRAM', P.head || (band ? 'IELTS' : 'Adult English'), '1:1', band ? 'One learner. One teacher. One clear goal.' : P.tagline || '');\n      y = band ? pathways(T, y) : chips(T, y, P.forWhom || [['work', 'Work & career'], ['plane', 'Travel'], ['chat', 'Everyday conversations'], ['present', 'Presentations']]);"],
  ["y = notes(T, y, [{ t: P.small || '' }, { t: (P.method || '') + '.' }, { t: 'Please tell your teacher",
   "y = notes(T, y, [{ t: P.small || '' }].concat(P.halves ? [{ t: P.halves }] : []).concat([{ t: (P.method || '') + '.' }]).concat([{ t: 'Please tell your teacher"],
  ["hours before class if you need to cancel or move a lesson.', red: 1 }].concat(band ? [{ t: 'Target bands are a guide; official results come from the IELTS test.' }] : []));",
   "hours before class if you need to cancel or move a lesson.', red: 1 }]).concat(band ? [{ t: 'Target bands are a guide; official results come from the IELTS test.' }] : []));"],
  ["y = head(T, y + 4, 'EXPERT PREMIUM PROGRAM', band ? 'IELTS' : 'Adult English', '1:1', S.sub || P.tagline || '');",
   "y = head(T, y + 4, 'EXPERT PREMIUM PROGRAM', P.head || (band ? 'IELTS' : 'Adult English'), '1:1', S.sub || P.tagline || '');"],
  // the PH price message: parent-facing for Young Learners, both parents and teens for Teens
  ["your teacher will check your current level and suggest the right track.' + '",
   "' + (P.audience === 'kids' ? 'the teacher will check your child\\'s current level and suggest the right track.' : P.audience === 'teens' ? 'the teacher will check the current level and suggest the right track.' : 'your teacher will check your current level and suggest the right track.') + '"],
  ["RP = { pid: pid === 'ielts' ? 'ielts' : 'adult', tid: tid || '' }; rpSheet(); };", "RP = { pid: /^(ielts|yle|teens)$/.test(pid) ? pid : 'adult', tid: tid || '' }; rpSheet(); };"],
  // New enquiry + enquiry rows
  ["'PH Adult English 1:1', 'PH IELTS 1:1'], SRCS", "'PH Adult English 1:1', 'PH IELTS 1:1', 'PH Young Learners 1:1', 'PH Teens 1:1'], SRCS"],
  ["var t = (p.match(/(Foundation|Professional|Mastery)/i) || [])[1]; return { pid: /ielts/i.test(p) ? 'ielts' : 'adult', tid: t ? t.toLowerCase() : '' }; };",
   "var t = (p.match(/(Foundation|Professional|Mastery|Consolidation|Advancement)/i) || [])[1]; t = t ? ({ consolidation: 'professional', advancement: 'mastery' })[t.toLowerCase()] || t.toLowerCase() : ''; return { pid: /ielts/i.test(p) ? 'ielts' : /young/i.test(p) ? 'yle' : /teen/i.test(p) ? 'teens' : 'adult', tid: t }; };"],
  // the English agreement: the programme of a PH enquiry
  ["return e ? (/IELTS/.test(e.prog) ? 'ielts' : 'adult') : '';", "return e ? (/IELTS/.test(e.prog) ? 'ielts' : /Young/.test(e.prog) ? 'yle' : /Teen/.test(e.prog) ? 'teens' : 'adult') : '';"]
]);
let s = fs.readFileSync(file, 'utf8');
const i = s.lastIndexOf('</body>');
s = s.slice(0, i) + R`<script>
/* 1545 · PH price sheet: the programme list comes from sys:pricing_ph (Adult English · IELTS · Young Learners · Teens) */
(function(){
  if(window.__1545) return; window.__1545 = 1;
  var progs = function(){ var d = window.phPricing1530 ? phPricing1530() : null; return (d && d.programs) || []; };
  window.phSeg1545 = function(pid){ var cur = pid || 'adult'; return progs().map(function(p){ return '<button class="' + (p.id === cur ? 'on' : '') + '" onclick="phPid1545(\'' + p.id + '\')">' + esc(p.short) + '</button>'; }).join(''); };
  window.phPid1545 = function(id){ try{ pricePic({ ph: id, rec: '' }); }catch(e){} };
})();
</script>
` + s.slice(i);
fs.writeFileSync(file, s);
console.log('1545 PH Young Learners 1:1 + Teens 1:1');
