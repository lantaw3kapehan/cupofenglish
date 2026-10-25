// 951 (D5 · Teacher role): every teacher screen in the Finance Overview look (patch 823 / 900 tokens), CSS only.
//      Scope: body.role-t (set by 950 for teachers only) × the teacher views — Today, Schedule, Students, Books, Messages,
//      Activity log, Growth, QA feedback, Trainings, Pay, My Contract, More. Management screens are not touched
//      (Trainings `#v-train` is shared, so it is styled only when a teacher is signed in).
//      · Page titles: Fredoka One 26px ink (22px on phones), subtitle 13px muted — as Finance Overview.
//      · Cards: one radius (14px), 1px #E9E7F0 border, white, no drop shadows, no gradient backgrounds. Cards that carry a
//        status keep their tint (to-fix, notice of breach, contract to sign, late time-in, homework due, cancelled).
//        The class happening now is marked with a teal edge instead of a gradient.
//      · Card / section titles: 15px / 700 ink (was 18px / 600 with a decorative gradient dash).
//      · Buttons: flat (no glow), primary teal #00808B (the same colour the gradient ended on; 4.6:1 with white text).
//      · Figures: tabular numerals.
//      Nothing in the markup, data, calculations or actions changes.
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8'); const i = s.lastIndexOf('</body>');
s = s.slice(0, i) + String.raw`<script>
/* 951 · teacher screens in the Finance Overview look (CSS only, teachers only) */
(function(){ if(window.__951) return; window.__951 = 1;
  var V = ['today', 'tsched', 'students', 'books', 'tinbox', 'act', 'growth', 'qa', 'train', 'pay', 'contract', 'more'];
  var at = function(sel){ return sel.split(',').map(function(x){ return V.map(function(v){ return 'body.role-t #v-' + v + ' ' + x.trim(); }).join(','); }).join(','); };
  var top = function(sel){ return V.map(function(v){ return 'body.role-t #v-' + v + ' > ' + sel; }).join(','); };
  var CARD = '.sec,.card,.cls,.tin,.sm501,.dy501,.lvbar,.sm504,.c504,.tr504,.ls508,.al,.gr-mini,.gr-hero,.h6,.tx-card,.bd509,.box,.yd92,.ps92,#vidMine,.gj59,#txGrow,.remcard';
  var TINT = '.ct-ban,.lt-bn,#ftBox,#mustBox,.vdn,.nt-ban,#ffBox';
  var css = [
    at('.lead h1') + '{font-family:var(--ui-brand,"Fredoka One",sans-serif);font-weight:400;font-size:26px;line-height:1.2;color:#2f2752;letter-spacing:0}',
    at('.lead > .mute.small,.lead > div > .mute.small,.lead .gline') + '{font-size:13px;color:#6B6782}',
    at(CARD) + '{border-radius:14px!important;box-shadow:none!important;border:1px solid #E9E7F0!important;background-image:none!important;background-color:#fff}',
    at(TINT) + '{border-radius:14px!important;box-shadow:none!important}',
    at('.cls.now') + '{border-color:#01b0bf!important;box-shadow:inset 3px 0 0 #01b0bf!important}',
    at('.cls.x,.cls.cx') + '{background-color:#FAFAFD}',
    at('.hw') + '{box-shadow:none!important;border-radius:12px}',
    at('.sec h2,.card h2,.h6 h2,.tx-card h2,.box h2,.gr-hero h2,.yd92 h2,.ps92 h2,#vidMine h2') + '{font-size:15px!important;font-weight:700!important;color:#2f2752;letter-spacing:0;text-transform:none}',
    at('.sec h2::before,.card h2::before,.tx-card h2::before,.box h2::before,.yd92 h2::before,.ps92 h2::before,#vidMine h2::before') + '{display:none!important}',
    top('h2') + '{font-size:15px;font-weight:700;color:#2f2752;letter-spacing:0;text-transform:none;margin:22px 0 10px}',
    at('h2 .c') + '{font-size:13px;font-weight:400;color:#6B6782}',
    at('.btn') + '{box-shadow:none!important}',
    at('.btn.teal') + '{background:#00808B!important;border-color:#00808B!important;color:#fff!important}',
    at('.num,.big,table,.gr-ring') + '{font-variant-numeric:tabular-nums}',
    at('.search,input.in-t,.q508,.bl-q') + '{box-shadow:none!important;border:1px solid #E9E7F0!important;border-radius:10px!important}',
    '@media(max-width:640px){' + at('.lead h1') + '{font-size:22px}}'
  ].join('\n');
  var st = document.createElement('style'); st.id = 's951'; st.textContent = css; document.head.appendChild(st);
})();
</script>
` + s.slice(i);
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
