// 1481 · Teacher QA (28 Oct 2026): role-appropriate words, one status name, readable dates
// 1. No "President" title on teacher screens: My Contract step "Countersigned by management" for teachers (the leave sheet,
//    leave status, Message management and the other contract lines were already changed by the President QA release 1460–1466).
// 2. Notices & requests: a notice that needs Got it reads "Needs acknowledgement" (Today already says "needs your acknowledgement");
//    the tile reads "to acknowledge".
// 3. Dates (message times were already made day-first by 1471): trial report / peer review / class note rows, Trials & sub classes,
//    the monthly feedback and trial report headers show "24 Oct" (were 2026-10-24 / 10-24).
// 4. Teacher forms: Chinese-only labels next to English headings (学员类型, 听力 …) are hidden on teacher screens (English only);
//    the parent report's Chinese version is unchanged.
// Display only.
const fs = require('fs'), file = process.argv[2];
const D1 = x => "(window.d1481 ? d1481(" + x + ") : " + x + ")";
require('../tools/lib.js')(file, [
  ["Countersigned by the President</b>", "Countersigned by ' + (isMgmt() ? 'the President' : 'management') + '</b>"],
  ["'<span class=\"pl wt\">! Reply needed</span>'", "'<span class=\"pl wt\">! Needs acknowledgement</span>'"],
  ["tile('reply', nW, 'waiting for your reply', '!', '#D4705A')", "tile('reply', nW, 'to acknowledge', '!', '#D4705A')"],
  ["TIF.f === 'reply' ? '✓ Nothing waiting for your reply'", "TIF.f === 'reply' ? '✓ Nothing to acknowledge'"],
  ["${esc(x.student)} · ${esc(x.date)}</div>", "${esc(x.student)} · ${esc(" + D1('x.date') + ")}</div>"],
  ["with '+esc(x.student):''} · ${esc(x.date)}", "with '+esc(x.student):''} · ${esc(" + D1('x.date') + ")}"],
  ["\\'s class · ' + esc(x.date) + '</div>", "\\'s class · ' + esc(" + D1('x.date') + ") + '</div>"],
  ["<span class=\"d\">${esc(String(t.date || '').slice(5))}</span>", "<span class=\"d\">${esc(window.d1481 ? d1481(t.date, 1) : String(t.date || '').slice(5))}</span>"],
  ["${esc(fbFL(FBF))} · due ${esc(FBF.due)}", "${esc(fbFL(FBF))} · due ${esc(" + D1('FBF.due') + ")}"],
  ["${TRC.code?' · '+esc(TRC.code):''} · ${esc(TRC.date)}", "${TRC.code?' · '+esc(TRC.code):''} · ${esc(" + D1('TRC.date') + ")}"]
]);
let s = fs.readFileSync(file, 'utf8');
const early = (code) => { const A = 'const msgAt = s => {'; if (s.split(A).length !== 2) { console.error('msgAt anchor not found once'); process.exit(1); } s = s.replace(A, () => code + '\n' + A); };
early(String.raw`window.d1481 = function(x, short){ var t = String(x == null ? '' : x), m = t.match(/^(\d{4})-(\d{2})-(\d{2})/); if(!m) return t; var M = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'], y = +m[1], cy = new Date().getFullYear(); return (+m[3]) + ' ' + M[+m[2] - 1] + (short || y === cy ? '' : ' ' + y); };   /* 1481 · defined early: screens drawn from the saved copy use it */`);
const i = s.lastIndexOf('</body>');
s = s.slice(0, i) + String.raw`<script>
/* 1481 · English-only teacher forms (d1481 date helper is defined early, next to msgAt) */
(function(){
  if(window.__1481) return; window.__1481 = 1;
  var CJK = /^[\s　-〿一-鿿＀-￯·()（）]+$/;
  function run(){ try{ if(typeof D === 'undefined' || !D || D.mgr) return; var sh = document.getElementById('sheetBody'); if(!sh) return;
    [].forEach.call(sh.querySelectorAll('h2 > .c, h3 > .c, label > .c'), function(c){ if(!c.hidden && CJK.test(c.textContent) && /[一-鿿]/.test(c.textContent)) c.hidden = true; }); }catch(e){} }
  var q = 0; var mo = new MutationObserver(function(){ if(!q){ q = 1; Promise.resolve().then(function(){ q = 0; run(); }); } });
  (function hook(){ var el = document.getElementById('sheet'); if(el){ mo.observe(el, { childList: true, subtree: true }); run(); } else setTimeout(hook, 1000); })();
})();
</script>
` + s.slice(i);
fs.writeFileSync(file, s);
