// 931: (Misty, 25 Oct · phase 2 design) Teachers area — Teachers · Performance · Trainings · Leave · Cases — in the Finance
// Overview look (patch 823 / shared tokens of 900). CSS scoped to these five views only; renderers are untouched.
//  · Page header: title 26px (brand font from 900), subtitle 13px muted, header buttons 34px high without shadows.
//    Trainings: one filled primary button (+ Coaching, teal); "+ Schedule" becomes a plain outline button like "Videos & quizzes".
//  · Cards: one radius (14px), 1px line, no shadows (team strip, team map, teacher list, QA cards, ladder, matrix, leave
//    timeline, leave rows, case summary). Card headers read like Finance card titles (15px bold ink, muted note on the right).
//  · Teachers: the five team figures sit in white outlined tiles (Finance "Payroll" tiles) instead of grey blocks.
//  · Leave: the whole page was drawn as one big card (a global `.wrap div:has(> .li + .li)` rule matched the page itself) —
//    now only the lists are cards. The three counts are one KPI strip (Finance style); "waiting for your approval" / "to check"
//    shows its number in amber when it is not 0. On a phone, leave rows wrap: the "Picture for parents" button drops below
//    instead of squeezing the name and reason to "Pers…"; the timeline header wraps instead of overlapping.
//  · Cases: summary tiles white with coloured figures; the "Not completed" tile is no longer squashed into a 28 px circle
//    (a global `.o` badge class matched it); the person filter gets a name for screen readers ("Show cases for").
//  · Leave history: one card with rows instead of cards inside a card.
//  · Performance: teacher rows form one list (rows separated by lines) instead of 15 separate shadowed cards.
//  · Subtitles in plain words instead of sheet names: Leave "… saved in T-LEAVE" (the steps are already shown under the counts),
//    Cases "Live from ACTIONS", Teachers "live from the TEACHERS sheet".
// Not changed: any number, rule, permission, button action, sort or filter; the shared tab bar and sheets (lead's 900 / 882).
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8'); const i = s.lastIndexOf('</body>');
if (i < 0) { console.error('no </body>'); process.exit(1); }
s = s.slice(0, i) + String.raw`<script>
/* 931 · Teachers area in the Finance Overview look */
(function(){ if(window.__931) return; window.__931 = 1;
  var V = ['#v-teachers', '#v-perf', '#v-train', '#v-leave', '#v-actions'];
  var all = function(sel){ return V.map(function(v){ return sel.split(',').map(function(x){ return v + ' ' + x.trim(); }).join(','); }).join(','); };
  var css = [
    /* header */
    all('.lead') + '{gap:8px 10px;align-items:center;margin:4px 0 12px}',
    all('.lead h1') + '{font-size:26px;line-height:1.2;margin:0}',
    all('.lead .mute.small,.lead .small.mute') + '{font-size:13px;color:var(--ui-mute,#6B6782);margin-top:2px}',
    all('.lead .btn') + '{height:34px;min-height:34px;padding:0 14px;font-size:13px;font-weight:700;box-shadow:none}',
    all('.btn.sm') + '{box-shadow:none}',
    '#v-train .lead .btn:not(.teal):not(.ghost){background:#fff!important;color:var(--ui-ink,#2f2752)!important;border:1px solid var(--ui-line,#E9E7F0)!important}',
    /* section titles outside cards */
    V.map(function(v){ return v + ' > h2'; }).join(',') + '{font-size:15px;font-weight:700;color:var(--ui-ink,#2f2752);margin:18px 0 8px}',
    /* cards: one radius, flat */
    '#v-teachers .tm41,#v-teachers .mp43,#v-teachers .tc2-g,#v-perf section.card,#v-perf .gr-hero,#v-perf .dm52,#v-perf section.sec,' +
    '#v-train .tq-l,#v-train .tq-rt,#v-train .tx-card,#v-leave .lc55,#v-leave .li,#v-actions .cs524,#v-actions .wh524' +
    '{border-radius:var(--ui-r,14px)!important;box-shadow:none!important;border:1px solid var(--ui-line,#E9E7F0)}',
    /* card headers like Finance card titles */
    '#v-teachers .tm41 .h,#v-teachers .mp43 .h,#v-leave .lc55 .h,#v-perf .dm52 .h{font-size:12.5px;letter-spacing:0;text-transform:none;color:var(--ui-mute,#6B6782);flex-wrap:wrap;gap:2px 12px;margin-bottom:10px}',
    '#v-teachers .tm41 .h>span:first-child,#v-teachers .mp43 .h>span:first-child,#v-leave .lc55 .h>span:first-child,#v-perf .dm52 .h>span:first-child{font-size:15px;font-weight:700;color:var(--ui-ink,#2f2752)}',
    '#v-train .tx-h b{font-size:15px;color:var(--ui-ink,#2f2752)}',
    /* Teachers · team figures as outlined tiles */
    '#v-teachers .tm41 .k>div{background:#fff;border:1px solid var(--ui-line,#E9E7F0);border-radius:12px}',
    '#v-teachers .tm41 .k b{font-variant-numeric:tabular-nums}',
    /* Leave · the page is not a card; counts as one KPI strip */
    '#v-leave{background:none!important;border:0!important;box-shadow:none!important;padding:0!important;margin-top:0!important}',
    '#v-leave .stats{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:0;background:#fff;border:1px solid var(--ui-line,#E9E7F0);border-radius:var(--ui-r,14px);overflow:hidden;margin:0 0 12px}',
    '#v-leave .stats .stat{border:0!important;border-left:1px solid var(--ui-line,#E9E7F0)!important;border-radius:0!important;box-shadow:none!important;background:none!important;padding:12px 16px!important;margin:0!important;min-width:0}',
    '#v-leave .stats .stat:first-child{border-left:0!important}',
    '#v-leave .stats .stat b.num{display:block;font-size:22px;font-weight:700;color:var(--ui-ink,#2f2752);font-variant-numeric:tabular-nums}',
    '#v-leave .stats .stat span{display:block;font-size:11.5px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;color:var(--ui-mute,#6B6782);margin-top:2px}',
    '#v-leave .stats .stat.d3-ac b.num{color:var(--ui-ac,#97600F)}',
    '#v-leave .li{margin-bottom:8px}',
    /* Leave history: one card with rows, not cards inside a card */
    '#v-leave div:has(> .li + .li){padding:0!important;overflow:hidden;border-radius:var(--ui-r,14px)!important;box-shadow:none!important;border:1px solid var(--ui-line,#E9E7F0)!important}',
    '#v-leave div:has(> .li + .li)>.li{border:0!important;border-top:1px solid var(--ui-line,#E9E7F0)!important;border-radius:0!important;margin:0!important}',
    '#v-leave div:has(> .li + .li)>.li:first-child{border-top:0!important}',
    /* Cases · summary tiles: white outlined tiles, colour only on the figure (Finance); the "Not completed" tile was a 28 px
       circle because a global .o badge rule matched its class */
    '#v-actions .cs524 .k>div{background:#fff!important;border:1px solid var(--ui-line,#E9E7F0);border-radius:12px!important;padding:10px 12px}',
    '#v-actions .cs524 .k>.o{display:block;width:auto;height:auto;place-items:normal;font-style:normal;font-weight:inherit;font-size:inherit}',
    '#v-actions .cs524 .k span,#v-actions .cs524 .t{font-size:11.5px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;color:var(--ui-mute,#6B6782)}',
    '#v-actions .cs524 .k b{font-size:22px;font-weight:700}',
    '#v-actions .wh524 .hd{font-size:12.5px;color:var(--ui-mute,#6B6782)}',
    /* Performance · card titles at the Finance card-title size */
    '#v-perf .pf3-rh b,#v-perf #pf3Hub section.card summary b,#v-perf #pf3Hub section.card b:first-of-type{font-size:15px}',
    '#v-perf .pf3-hubh{font-size:11.5px;font-weight:700;letter-spacing:.04em;color:var(--ui-mute,#6B6782)}',
    /* Performance · teacher rows as one list */
    '#v-perf .pf-row{border-radius:0!important;box-shadow:none!important;margin:0!important;border:1px solid var(--ui-line,#E9E7F0);border-top:0}',
    '#v-perf .pf-head + .pf-row{border-top:1px solid var(--ui-line,#E9E7F0);border-radius:var(--ui-r,14px) var(--ui-r,14px) 0 0!important}',
    '#v-perf .pf-row:not(:has(+ .pf-row)){border-radius:0 0 var(--ui-r,14px) var(--ui-r,14px)!important;margin-bottom:12px!important}',
    '#v-perf .pf-head + .pf-row:not(:has(+ .pf-row)){border-radius:var(--ui-r,14px)!important}',
    /* phone */
    '@media(max-width:640px){' +
      all('.lead h1') + '{font-size:22px}' +
      '#v-leave .stats .stat{padding:10px 12px!important}#v-leave .stats .stat b.num{font-size:18px}' +
      '#v-leave .li{flex-wrap:wrap}#v-leave .li>.grow{flex:1 1 160px;min-width:0}' +
      '#v-leave .li>.lvpB{order:9;margin-left:auto}' +
      '#v-leave .li .small.ell{white-space:normal}' +
    '}'
  ].join('\n');
  var st = document.createElement('style'); st.id = 'ui931'; st.textContent = css; document.head.appendChild(st);
  /* plain-words subtitles + amber "waiting" count, after every repaint */
  var SUB = [
    [/^Requests with proof · Operations checks · the President approves · saved in T-LEAVE$/, 'Who is away, what needs a decision, and the leave record'],
    [/^Live from ACTIONS · newest first$/, 'Bonuses, deductions and incidents · newest first'],
  ];
  function tidy(){
    V.forEach(function(v){ var el = document.querySelector(v); if(!el) return;
      var sub = el.querySelector('.lead .mute.small'); if(sub){ var t = sub.textContent.trim(); SUB.forEach(function(p){ if(p[0].test(t)) sub.textContent = p[1]; }); } });
    var fs = document.querySelector('#v-actions .fl524 select'); if(fs && !fs.getAttribute('aria-label')) fs.setAttribute('aria-label', 'Show cases for');
    var h = document.querySelector('#v-teachers h2.td42 .c'); if(h && /live from the TEACHERS sheet/.test(h.textContent)) h.textContent = 'pick a teacher';
    document.querySelectorAll('#v-leave .stats .stat').forEach(function(x){ var sp = x.querySelector('span'), n = x.querySelector('b.num');
      var w = sp && /waiting|to check/i.test(sp.textContent) && n && +n.textContent.trim() > 0; x.classList.toggle('d3-ac', !!w); });
  }
  var q = 0; var mo = new MutationObserver(function(){ if(q) return; q = requestAnimationFrame(function(){ q = 0; try{ tidy(); }catch(x){} }); });
  (function w(){ var ok = 0; V.forEach(function(v){ var el = document.querySelector(v); if(el){ mo.observe(el, { childList: true, subtree: true }); ok++; } });
    if(ok) tidy(); else setTimeout(w, 1500); })();
})();
</script>
` + s.slice(i);
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
