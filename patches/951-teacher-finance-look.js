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
//      · Typography update (15:05): sizes use the central --fs-* tokens (px fallbacks); nothing under 12px; teacher screens on phones
//        use the 16px body size (small text 14px) and every button / filter / list row is at least 44px tall. Any visible text
//        under 12px in a teacher view is raised to 12px after each paint (icon glyphs and timeline block names excepted).
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
    at('.lead h1') + '{font-family:var(--ui-brand,"Fredoka One",sans-serif);font-weight:400;font-size:var(--fs-h1,26px);line-height:1.2;color:#2f2752;letter-spacing:0}',
    at('.lead > .mute.small,.lead > div > .mute.small,.lead .gline') + '{font-size:var(--fs-small,14px);color:#6B6782}',
    at(CARD) + '{border-radius:14px!important;box-shadow:none!important;border:1px solid #E9E7F0!important;background-image:none!important;background-color:#fff}',
    at(TINT) + '{border-radius:14px!important;box-shadow:none!important}',
    at('.cls.now,.cls.now.f93') + '{background:#fff!important;border-color:#01b0bf!important;box-shadow:inset 3px 0 0 #01b0bf!important}',
    'body.role-t #v-today #vcBox.sec{border:0!important;padding:0!important;background:transparent!important}body.role-t #v-today #vcBox > div{border-radius:14px!important}',
    top('h2::before') + '{display:none!important}',
    at('.stat') + '{border-radius:14px!important;box-shadow:none!important;border:1px solid #E9E7F0!important;background:#fff!important}',
    at('.stat > b.num') + '{font-size:var(--fs-kpi,22px)!important;font-weight:700;font-variant-numeric:tabular-nums}',
    at('.st508 > a') + '{box-shadow:none!important;border:1px solid #E9E7F0!important;border-radius:14px!important;background-image:none!important}',
    at('.cls.x,.cls.cx') + '{background-color:#FAFAFD}',
    at('.hw') + '{box-shadow:none!important;border-radius:12px}',
    at('.sec h2,.card h2,.h6 h2,.tx-card h2,.box h2,.gr-hero h2,.yd92 h2,.ps92 h2,#vidMine h2') + '{font-size:var(--fs-h2,16px)!important;font-weight:700!important;color:#2f2752;letter-spacing:0;text-transform:none}',
    at('.sec h2::before,.card h2::before,.tx-card h2::before,.box h2::before,.yd92 h2::before,.ps92 h2::before,#vidMine h2::before') + '{display:none!important}',
    top('h2') + '{font-size:var(--fs-h2,16px);font-weight:700;color:#2f2752;letter-spacing:0;text-transform:none;margin:22px 0 10px}',
    at('h2 .c') + '{font-size:var(--fs-small,14px);font-weight:400;color:#6B6782}',
    at('.btn') + '{box-shadow:none!important}',
    at('.btn.teal') + '{background:#00808B!important;border-color:#00808B!important;color:#fff!important}',
    at('.num,.big,table,.gr-ring') + '{font-variant-numeric:tabular-nums}',
    at('.search,input.in-t,.q508,.bl-q') + '{box-shadow:none!important;border:1px solid #E9E7F0!important;border-radius:10px!important}',
    /* Typography update (Misty 15:05): nothing under 12px, body ≈16px on phones, touch targets ≥ 44px on phones */
    at('.chip,.pill,.ui-pill,.dl,.tag,small,.lbl,.k') + '{font-size:max(12px,var(--fs-label,12px))}',
    '@media(max-width:640px){' + V.map(function(v){ return 'body.role-t #v-' + v; }).join(',') + '{font-size:var(--fs-body,16px)}'
      + at('.small,.mute.small,.sub') + '{font-size:var(--fs-small,14px)}'
      + at('.btn,.btn.sm,.seg button,.ui-seg button,.li,button.ck,button.sv,.tx-all,.jp510 > a,summary,.sec button[data-k],.vm-c') + '{min-height:44px!important;box-sizing:border-box}'
      + at('.jp510 > a,.vm-c,.sec button[data-k],.tx-all') + '{display:inline-flex!important;align-items:center}'
      + at('.btn.sm') + '{font-size:var(--fs-small,14px)}'
      + at('.lead h1') + '{font-size:var(--fs-h1-phone,24px)}}',
    '@media(max-width:899px){body.role-t nav button{min-height:44px}}'
  ].join('\n');
  var st = document.createElement('style'); st.id = 's951'; st.textContent = css; document.head.appendChild(st);
  /* nothing under 12px on teacher screens: many small labels are set by older patches with higher-priority rules, so after each
     paint any visible text under 12px in a teacher view is raised to the label size. Icon glyphs (✓ ! ▶) and the names written
     inside the day-timeline blocks (no room) are left as they are. */
  var isT = function(){ return typeof D !== 'undefined' && D && !D.mgr; }, T0 = 0;
  function minFont(){ T0 = 0; if(!isT()) return; try{ var el = document.getElementById('v-' + (typeof VIEW !== 'undefined' ? VIEW : '')); if(!el || V.indexOf(VIEW) < 0) return;
      el.querySelectorAll('*').forEach(function(e){ if(e.closest('svg,.bk') || !e.offsetParent) return; var own = '';
        for(var n = e.firstChild; n; n = n.nextSibling) if(n.nodeType === 3) own += n.textContent; own = own.trim(); if(!own || !/[A-Za-z0-9\u4e00-\u9fff]{2}/.test(own)) return;
        if(parseFloat(getComputedStyle(e).fontSize) < 12) e.style.setProperty('font-size', 'max(12px, var(--fs-label, 12px))', 'important'); }); }catch(x){} }
  function later(){ if(!T0) T0 = setTimeout(minFont, 250); }
  new MutationObserver(function(){ if(isT()) later(); }).observe(document.body, { childList: true, subtree: true, characterData: true }); later();
  var _go = window.go; if(typeof _go === 'function') window.go = function(){ var r = _go.apply(this, arguments); later(); return r; };
})();
</script>
` + s.slice(i);
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
