// 924 (D2 · design): Students, Parent reports, Database sheet, Trials, Enquiries, the student page and the dialogs opened
// from these screens, brought to the Finance › Overview look (patch 823 / tokens in 900). CSS only + one attribute:
// · Page titles 26px (were 34px), sub text 13px muted; cards: 1px line, 14px radius, no shadow, 14px 16px padding;
//   card titles 15px/700. Filter buttons (.seg) = Finance pills: 34px, 10px radius, white with line; selected = ink.
// · Search boxes 40px (16px text on phones so iOS does not zoom), 10px radius, no shadow.
// · Parent reports: the three separate shadowed tiles with coloured tops become one KPI strip (22px/700 figures).
// · Student page: header, action bar, section tabs and section cards lose shadows and use the 14px radius; the small
//   "SEND TO PARENT / MANAGE" labels become muted 11px caps (were 10.5px teal); figures use tabular numerals.
// · Dialogs opened while on one of these screens get #sheet[data-d2] (set on open, cleared on close) so their cards,
//   titles and filter pills follow the same rules. Form logic is not touched (birthdate save is patch 960–969's).
// · Phone (390 px): the student page's section tabs wrap (Profile was cut off and the card scrolled sideways), long
//   chips (book names, "Sent: Trial invitation …") wrap instead of widening the page. These overflows existed before.
// · Type sizes use the central --fs-* tokens (px fallbacks = the Finance Overview sizes; nothing under 12px);
//   on phones every button / pill / tab in these screens is at least 44px high.
// Every button, handler, label text and count is unchanged.
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8'); const i = s.lastIndexOf('</body>');
s = s.slice(0, i) + String.raw`<script>
/* 924 · Students / Reports / Database / Trials / Enquiries · Finance Overview look */
(function(){ if(window.__924) return; window.__924 = 1;
  var V = ['#v-astudents', '#v-reports', '#v-db', '#v-trials', '#v-enquiry'];
  var P = ':is(' + V.join(',') + ')';
  var D = '#sheet[data-d2]';
  var css = [
    P + '{font-family:var(--ui-font)}',
    P + ' .lead h1{font-size:var(--fs-h1,26px);line-height:1.2;margin:4px 0 2px}',
    P + ' .lead > .mute.small{font-size:var(--fs-small,13px);line-height:1.5;color:var(--ui-mute)}',
    P + ' section.sec,' + P + ' > div:not([class]):has(> .sk2),#v-db > div:not([class]){border:1px solid var(--ui-line)!important;border-radius:var(--ui-r)!important;box-shadow:none!important}',
    P + ' section.sec{padding:14px 16px}',
    P + ' section.sec h2,' + P + ' section.sec > .row > h2{font-family:var(--ui-font);font-size:var(--fs-h2,15px);font-weight:700;color:var(--ui-ink)}',
    P + ' .seg{gap:6px}',
    P + ' .seg button,' + D + ' #sheetBody .seg button{min-height:var(--ui-ctl);padding:0 12px;border-radius:10px!important;border:1px solid var(--ui-line);background:#fff;color:var(--ui-mute);font-family:var(--ui-font);font-size:var(--fs-small,13px);font-weight:700;box-shadow:none!important}',
    P + ' .seg button.on,' + D + ' #sheetBody .seg button.on{background:var(--ui-ink);border-color:var(--ui-ink);color:#fff}',
    P + ' .seg button:focus-visible{outline:2px solid var(--ui-teal-d);outline-offset:2px}',
    P + ' input.search,#tpQ{height:40px!important;padding-top:0!important;padding-bottom:0!important;border:1px solid var(--ui-line)!important;border-radius:10px!important;box-shadow:none!important;font-size:var(--fs-body,15px)!important}',
    P + ' .sk2 button{box-shadow:none!important;border-radius:10px!important;min-height:30px}',
    P + ' .lk{border-radius:10px}',
    P + ' .btn{box-shadow:none}',
    P + ' .empty{font-size:var(--fs-body,15px);color:var(--ui-mute)}',
    /* Parent reports: one KPI strip */
    '#v-reports > .stats{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr));gap:0!important;background:#fff;border:1px solid var(--ui-line);border-radius:var(--ui-r);overflow:hidden;margin:12px 0 8px!important}',
    '#v-reports > .stats > .stat{border:0!important;border-left:1px solid var(--ui-line)!important;border-radius:0!important;box-shadow:none!important;background:none!important;padding:12px 16px!important;min-width:0}',
    '#v-reports > .stats > .stat:first-child{border-left:0!important}',
    '#v-reports > .stats > .stat::before,#v-reports > .stats > .stat::after{display:none!important}',
    '#v-reports > .stats > .stat b{font-family:var(--ui-font);font-size:var(--fs-kpi,22px);font-weight:700;font-variant-numeric:tabular-nums;color:var(--ui-ink)}',
    '#v-reports > .stats > .stat span{font-size:var(--fs-small,13px);color:var(--ui-mute)}',
    '#v-reports > .fbbar{height:6px!important;border-radius:3px!important;background:var(--ui-tint)!important;margin-bottom:10px}',
    '#v-reports .rp-row{font-size:var(--fs-table,15px)}',
    /* student page */
    '#sheet #sheetBody .shero{border-radius:var(--ui-r)!important;border-color:var(--ui-line)!important;box-shadow:none!important}',
    '#sheetBody .shero .kpis{border:1px solid var(--ui-line);border-radius:12px;background:var(--ui-soft)}',
    '#sheetBody .shero .kpis b{font-family:var(--ui-font);font-weight:700;font-variant-numeric:tabular-nums}',
    '#sheetBody .stu-bar{border-radius:var(--ui-r)!important;border-color:var(--ui-line)!important;box-shadow:none!important}',
    '#sheetBody .stu-bar .grp > span{font-family:var(--ui-font);font-size:var(--fs-label,12px);font-weight:700;letter-spacing:.04em;text-transform:uppercase;color:var(--ui-mute)}',
    '#sheetBody .stu-bar .btn{min-height:var(--ui-ctl);height:auto;font-size:var(--fs-small,13px);box-shadow:none}',
    '#sheetBody .stu-tabs{box-shadow:none!important;flex-wrap:wrap;row-gap:6px}',
    /* phone: long chips / book codes no longer push the page sideways (seen at 390 px before this patch too) */
    '#sheet:has(.shero) #sheetBody .chip,#v-enquiry .tags .chip{max-width:100%;white-space:normal;overflow-wrap:anywhere}',
    '#sheet:has(.shero) #sheetBody small{overflow-wrap:anywhere}',
    '#sheetBody .stu-tabs button{min-height:var(--ui-ctl);border-radius:10px!important;box-shadow:none!important;border-color:var(--ui-line);font-family:var(--ui-font);font-size:var(--fs-small,13px);font-weight:700}',
    '#sheetBody .stu-tabs button.on{background:var(--ui-ink);border-color:var(--ui-ink);color:#fff}',
    '#sheet:has(.shero) #sheetBody section.sec{border-radius:var(--ui-r)!important;border-color:var(--ui-line)!important;box-shadow:none!important}',
    '#sheet:has(.shero) #sheetBody section.sec h2{font-family:var(--ui-font);font-size:var(--fs-h2,15px);font-weight:700;color:var(--ui-ink)}',
    '#sheet:has(.shero) #sheetBody .fb.card{border-radius:var(--ui-r);box-shadow:none;border:1px solid var(--ui-line)}',
    '#sheet:has(.shero) #sheetBody .btn{box-shadow:none}',
    /* dialogs opened from these screens */
    D + ' #sheetBody > h1{font-size:var(--fs-h1,24px);line-height:1.2}',
    D + ' #sheetBody > .mute.small{font-size:var(--fs-small,13px);color:var(--ui-mute)}',
    D + ' #sheetBody > h2{font-family:var(--ui-font);font-size:var(--fs-h2,15px);font-weight:700;color:var(--ui-ink)}',
    D + ' #sheetBody .card{border-radius:var(--ui-r);box-shadow:none;border:1px solid var(--ui-line)}',
    D + ' #sheetBody .btn{box-shadow:none}',
    '@media(max-width:640px){' + P + ' .lead h1{font-size:var(--fs-h1,22px)}' + P + ' input.search,#tpQ{font-size:max(16px,var(--fs-body,16px))!important;height:44px!important}#v-reports > .stats > .stat{padding:10px 10px!important}#v-reports > .stats > .stat b{font-size:var(--fs-kpi,18px)}' + D + ' #sheetBody > h1{font-size:var(--fs-h1,21px)}' +
      /* touch targets ≥44px on phones */
      P + ' .seg button,' + P + ' .sk2 button,' + P + ' .btn,' + P + ' .lk,#sheetBody .stu-tabs button,#sheetBody .stu-bar .btn,' + D + ' #sheetBody .seg button,' + D + ' #sheetBody .btn,#sheetBody .sbk{min-height:44px}}'
  ].join('\n');
  var st = document.createElement('style'); st.id = 'ui924'; st.textContent = css; document.head.appendChild(st);
  var MINE = { astudents: 1, reports: 1, db: 1, trials: 1, enquiry: 1, active: 1 };
  function tag(){ try{ var sh = document.getElementById('sheet'); if(!sh) return; if(sh.classList.contains('on') && typeof VIEW !== 'undefined' && MINE[VIEW]) sh.setAttribute('data-d2', VIEW); else if(!sh.classList.contains('on')) sh.removeAttribute('data-d2'); }catch(e){} }
  var o0 = window.openSheet; if(typeof o0 === 'function') window.openSheet = function(){ var r = o0.apply(this, arguments); tag(); return r; };
  var c0 = window.closeSheet; if(typeof c0 === 'function') window.closeSheet = function(){ var r = c0.apply(this, arguments); setTimeout(tag, 300); return r; };
})();
</script>
` + s.slice(i);
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
