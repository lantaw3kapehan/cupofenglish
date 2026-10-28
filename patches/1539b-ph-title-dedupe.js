// 1539b · PH Enquiries tidy-up (29 Oct 2026, Misty 02:51–02:54). China: unchanged (same sheet HTML, message and pictures).
// 1. PH price list + roadmap title area without repeats: headline stays "Adult English 1:1" / "IELTS 1:1"; eyebrow "EXPERT PREMIUM
//    PROGRAM"; top-right chip "Price list" / "Learning roadmap" (so the roadmap eyebrow does not repeat the chip).
// 2. PH price picture sheet: the payment box ("Add the enrolment and payment lines to the message" + the UnionBank line) is gone and the
//    PH price message has no payment lines. Payment lives in Enquiries › Philippines › 2 Enrolling › Payment QR · UnionBank (QR, payment
//    message, Payment details editing). China keeps its box.
// 3. Enquiries › Philippines: the "Original flyers" card is removed (the generated pictures replace it). Hosted flyer files stay.
const fs = require('fs'), file = process.argv[2];
const s0 = fs.readFileSync(file, 'utf8');
const a = s0.indexOf(`'<div class="card" style="margin-top:10px;padding:10px 12px"><label class="check" for="ppPayOn"`), b = s0.indexOf(`'<div id="ppImg"`, a);
const SEG = s0.slice(a, b); if (a < 0 || !/'<\/div>' \+\n$/.test(SEG) || SEG.length > 900) { console.error('1539b payment box anchor'); process.exit(1); }
const f0 = s0.indexOf("\n      + C(4, 'Original flyers'"), f1 = s0.indexOf('\n', f0 + 5), FLY = s0.slice(f0, f1);
if (f0 < 0 || !/phFlyers\(\)'\)$/.test(FLY)) { console.error('1539b flyers anchor'); process.exit(1); }
require('../tools/lib.js')(file, [
  ["return coeCard(band ? 'IELTS price list' : 'Adult English price list', function(T, y){\n      y = head(T, y + 4, band ? 'EXPERT IELTS · 1:1 PREMIUM PROGRAM' : 'EXPERT ADULT ENGLISH · 1:1 PREMIUM PROGRAM',",
   "return coeCard('Price list', function(T, y){\n      y = head(T, y + 4, 'EXPERT PREMIUM PROGRAM',"],
  ["return coeCard(band ? 'IELTS learning roadmap' : 'Learning roadmap', function(T, y){\n      y = head(T, y + 4, (band ? 'EXPERT IELTS' : 'EXPERT ADULT ENGLISH') + ' · LEARNING ROADMAP',",
   "return coeCard('Learning roadmap', function(T, y){\n      y = head(T, y + 4, 'EXPERT PREMIUM PROGRAM',"],
  [SEG, "(PP.m === 'ph' ? '' : " + SEG.replace(/ \+\n$/, '') + ") +\n"],
  ["if(PP.m === 'ph'){ const P = phPrg() || {}, ex = phPayText1533();", "if(PP.m === 'ph'){ const P = phPrg() || {}, ex = '';"],
  [FLY, '']
]);
console.log('1539b PH titles · no payment box in the PH price sheet · no Original flyers card');
