// 1537 · PH Price picture sheet on the phone (28 Oct 2026, Misty 23:32, her 390-wide screenshot).
// 1. The learner banner + Copy button label (patch 34x "check this matches the learner before you copy") read the China learner
//    buttons by position, so the Philippine sheet said "KIDS & TEENS · 4–17" / "Copy picture · Kids & teens". In the Philippine sheet
//    they now name the PH programme: "ADULT ENGLISH 1:1 · price" / "IELTS 1:1 · price" and "Copy picture · Adult English" / "· IELTS"
//    (teal). China sheet: unchanged.
// 2. PH sheet only: the Learner and Recommend chips wrap (no rounded track cutting "Mastery ·" at the right edge); the Copy picture /
//    Share / save / Copy message buttons get their own rows (Copy picture full width, the other two side by side), no clipping.
// 3. "Payment with" (China helper) is replaced in PH by the UnionBank line since 1533 (same batch).
const fs = require('fs'), file = process.argv[2], R = String.raw;
require('../tools/lib.js')(file, [
  [`'<div class="small" style="margin-top:12px"><b>Learner</b></div><div class="seg" id="ppAd" style="flex-wrap:wrap">'`,
   `'<div class="small" style="margin-top:12px"><b>Learner</b></div><div class="seg' + (PP.m === 'ph' ? ' pp37-w' : '') + '" id="ppAd" style="flex-wrap:wrap">'`],
  [`'<div class="small" style="margin-top:12px"><b>Recommend</b></div><div class="seg" id="ppRec">'`,
   `'<div class="small" style="margin-top:12px"><b>Recommend</b></div><div class="seg' + (PP.m === 'ph' ? ' pp37-w' : '') + '" id="ppRec">'`],
  [`'<div class="row" style="gap:8px;margin-top:12px"><button class="btn teal grow" id="ppC" onclick="ppCopy()">Copy picture</button>`,
   `'<div class="row' + (PP.m === 'ph' ? ' pp37-b' : '') + '" style="gap:8px;margin-top:12px"><button class="btn teal grow" id="ppC" onclick="ppCopy()">Copy picture</button>`],
  [`    if(/^Price picture/i.test(h1.textContent) && (seg = document.getElementById('ppAd'))){ const B = [...seg.querySelectorAll('button')]`,
   `    let phl = ''; if(/^Price picture/i.test(h1.textContent) && (seg = document.getElementById('ppAd')) && seg.classList.contains('pp37-w')){ const on = seg.querySelector('button.on'); phl = on ? on.textContent.trim() : 'Philippines'; k = 'p'; what = 'price'; }
    else if(/^Price picture/i.test(h1.textContent) && (seg = document.getElementById('ppAd'))){ const B = [...seg.querySelectorAll('button')]`],
  [`    if(!k) return; const g = G[k], sig = k + what;`,
   `    if(!k) return; const g = k === 'p' ? ['#00737B', '#E3F6F6', phl.toUpperCase()] : G[k], sig = k + what + phl;`],
  [`const lab = k === 'a' ? 'Adults' : k === 'k' ? 'Kids & teens' : 'Exam';`,
   `const lab = k === 'p' ? phl.replace(/\\s*1:1$/, '') : k === 'a' ? 'Adults' : k === 'k' ? 'Kids & teens' : 'Exam';`]
]);
let s = fs.readFileSync(file, 'utf8');
const i = s.lastIndexOf('</body>');
s = s.slice(0, i) + R`<style id="pp37">
#sheet .seg.pp37-w{display:flex!important;flex-wrap:wrap!important;gap:8px;width:auto!important;max-width:100%;overflow:visible!important;background:transparent!important;border:0!important;padding:0!important;box-shadow:none!important;border-radius:0!important;margin:8px 0 4px!important}
#sheet .seg.pp37-w button{flex:0 1 auto;max-width:100%;min-width:0;height:auto!important;min-height:40px;padding:8px 14px!important;border:1px solid #DDE6E8!important;border-radius:14px!important;background:#fff!important;color:#2B2253!important;white-space:normal!important;text-align:left;box-shadow:none!important;transform:none!important;line-height:1.25}
#sheet .seg.pp37-w button.on{background:#E3F6F6!important;border-color:#00737B!important;color:#00585E!important}
#sheet .seg.pp37-w button:empty{display:none!important}
#sheet .row.pp37-b{flex-wrap:wrap}
#sheet .row.pp37-b>button{flex:1 1 calc(50% - 4px);min-width:0;height:auto;min-height:44px;white-space:normal;line-height:1.2}
#sheet .row.pp37-b>#ppC{flex-basis:100%}
</style>
` + s.slice(i);
fs.writeFileSync(file, s);
console.log('1537 PH price sheet: programme banner + phone layout');
