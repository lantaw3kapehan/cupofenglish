// 910: (Misty, 25 Oct — phase 2 design pass, group D1 "Today") Overview, Monitor (+ Time-ins), To do, Schedule and Messages
//      restyled to the Finance Overview look (patch 823 / shared tokens from 900). CSS only, scoped to these views and to the
//      dialogs opened from them. No renderer, handler, count or wording changed.
// · Page titles: Fredoka One 26px ink (22px on phones); everything else the system sans stack (--ui-font), tabular numerals.
// · Cards: white, 1px line, 14px radius, no shadow, no coloured side stripes (To do sections, Overview cards, Schedule cards,
//   Messages list, Monitor board/feed, Time-ins cards). Card titles 15px/700, header links 13px/700 teal.
// · KPI-like tiles (Overview top tiles and Business tiles, To do summary tiles, Schedule day summary) become the Finance KPI
//   strip: one bordered strip, divided cells, 11.5px uppercase muted label, 22px/700 figure, 12px note.
// · Tabs and filters: Monitor tab bar / Today·Yesterday / teacher chips, Schedule mode switch, Messages filter chips → 34px
//   controls, 13px/700; selected = ink. Messages filters wrap on laptop instead of scrolling out of view (still scroll on phones).
// · Buttons inside these screens: 34px, 13px/700. Status chips: 11px/700 pills.
// · Typography (Misty 15:05 update): every size uses the central --fs-* tokens with px fallbacks (body/table 15px, small 13–14px,
//   labels and pills 12px, card titles 16px, KPI 22px, page title 26px); nothing under 12px; on phones every control here is ≥44px tall.
//   On phones the Overview profit chart scrolls sideways inside its card (12 months × 46 px) so the 12px month labels never overlap.
// · Dialogs opened while one of these screens is showing get class "d1s" on #sheet: title 22px brand, sub text 13px, buttons
//   38px/13.5px, inner boxes 12px radius without shadow. Removed again when the sheet closes or another screen opens it.
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8'); const i = s.lastIndexOf('</body>');
s = s.slice(0, i) + String.raw`<script>
/* 910 · D1 Today screens in the Finance Overview look */
(function(){ if(window.__910) return; window.__910 = 1;
  var V = ['#v-home', '#v-monitor', '#v-team', '#v-mtoday', '#v-schedule', '#v-msgs'];
  var all = function(sel){ return V.map(function(v){ return sel.split(',').map(function(x){ return v + ' ' + x.trim(); }).join(','); }).join(','); };
  var card = 'background:#fff!important;border:1px solid var(--ui-line)!important;border-radius:var(--ui-r)!important;box-shadow:none!important';
  var css = [
    V.join(',') + '{font-family:var(--ui-font);font-variant-numeric:tabular-nums}',
    /* page titles */
    '#v-monitor .mo-h h1,#v-team>.mo-h h1,#v-mtoday .lead h1,#v-schedule .lead h1,#v-msgs .lead h1{font-family:var(--ui-brand)!important;font-weight:400!important;font-size:var(--fs-h1,26px)!important;line-height:1.2;color:var(--ui-ink)!important;margin:0}',
    all('.lead .mute.small,.lead>div>.mute.small') + '{font-size:var(--fs-small,14px)!important;color:var(--ui-mute)!important}',
    /* buttons, chips */
    all('.btn.sm') + '{min-height:var(--ui-ctl);height:auto;padding:0 14px;font-size:var(--fs-small,14px)!important;font-weight:700}',
    all('.chip:not(button)') + '{font:700 var(--fs-label,12px)/1.6 var(--ui-font)!important;border-radius:999px;padding:1px 8px!important;letter-spacing:0}',
    /* ---------- Overview ---------- */
    '#v-home .ovc .x-top,#v-home .ovc section.ov-card,#v-home .ovc .x-c,#v-home .ovc .x-pay,#v-home details.g890-tr{' + card + '}',
    '#v-home .ovc section.ov-card,#v-home .ovc .x-c{padding:14px 16px!important;gap:10px}',
    '#v-home .ovc .x-top{padding:16px!important}',
    '#v-home .ovc .x-top h1{font-family:var(--ui-brand)!important;font-weight:400;font-size:var(--fs-h1,26px)!important;color:var(--ui-ink)}',
    '#v-home .ovc .x-top .d{font-size:var(--fs-small,14px);color:var(--ui-mute)}',
    /* top tiles → KPI strip */
    '#v-home .ovc .x-st{gap:0!important;border:1px solid var(--ui-line);border-radius:12px;overflow:hidden;background:#fff}',
    '#v-home .ovc .x-st a{border:0!important;border-left:1px solid var(--ui-line)!important;border-radius:0!important;box-shadow:none!important;padding:10px 14px!important;min-width:104px}',
    '#v-home .ovc .x-st a:first-child{border-left:0!important}',
    '#v-home .ovc .x-st a:hover{background:var(--ui-soft)}',
    '#v-home .ovc .x-st span,#v-home .bz2-k span{font:700 var(--fs-label,12px) var(--ui-font)!important;letter-spacing:.04em!important;text-transform:uppercase;color:var(--ui-mute)!important}',
    '#v-home .ovc .x-st b,#v-home .bz2-k b{font:700 var(--fs-kpi,22px)/1.25 var(--ui-font)!important;color:var(--ui-ink);font-variant-numeric:tabular-nums}',
    '#v-home .ovc .x-st small,#v-home .bz2-k em{font:400 var(--fs-small,13px)/1.35 var(--ui-font)!important;color:var(--ui-mute)}',
    '#v-home .bz2-k em.up{color:var(--ui-in)!important}#v-home .bz2-k em.dn{color:var(--ui-out)!important}',
    '#v-home .bz2-k{gap:0!important;border:1px solid var(--ui-line);border-radius:12px;overflow:hidden}',
    '#v-home .bz2-k>div{border:0!important;border-left:1px solid var(--ui-line)!important;border-radius:0!important;box-shadow:none!important;background:#fff!important;padding:12px 16px!important}',
    '#v-home .bz2-k>div:first-child{border-left:0!important}',
    /* card headers like Finance */
    '#v-home .ov-hd h2,#v-home .x-c .x-h b{font:700 var(--fs-h2,16px) var(--ui-font)!important;color:var(--ui-ink)!important}',
    '#v-home .ov-hd .lk{font:700 var(--fs-small,14px) var(--ui-font)!important;color:var(--ui-teal-d)!important}',
    '#v-home .x-c .x-h span,#v-home .ov-hd>span{font-size:var(--fs-small,13px)!important;color:var(--ui-mute)!important}',
    '#v-home .ov-mon .ov-mb button{border-radius:10px;padding:0 12px;min-height:var(--ui-ctl);font:700 var(--fs-small,14px) var(--ui-font);background:var(--ui-out-b);color:var(--ui-out)}',
    '#v-home .ov-mon .ov-mb button.ok{background:var(--ui-in-b);color:var(--ui-in)}',
    '#v-home .ovc .x-todo b{font:700 var(--fs-body,15px) var(--ui-font)!important;color:var(--ui-ink)}#v-home .ovc .x-todo span{font-size:var(--fs-small,14px)!important;color:var(--ui-mute)}',
    '#v-home .ovc .x-todo em{font:700 var(--fs-small,14px) var(--ui-font)!important;font-style:normal;color:var(--ui-teal-d)!important}',
    '#v-home details.g890-tr>summary{font-size:var(--fs-small,14px)}#v-home details.g890-tr>summary b,#v-home details.g890-tr>summary h2{font:700 var(--fs-h2,16px) var(--ui-font)!important;color:var(--ui-ink)}',
    '#v-home .c-foot{font-size:var(--fs-small,13px);color:var(--ui-mute)}#v-home .c-foot a{font-weight:700;color:var(--ui-teal-d)}',
    /* ---------- Monitor + Time-ins ---------- */
    '#v-monitor .mo-h,#v-team>.mo-h{margin:4px 0 12px!important}',
    '#v-monitor .mo-h .seg{background:#F1F0F6;border-radius:10px;padding:2px;height:var(--ui-ctl);box-sizing:border-box;display:inline-flex}',
    '#v-monitor .mo-h .seg button{height:30px;border:0;border-radius:8px;padding:0 12px;font:700 var(--fs-small,14px) var(--ui-font);color:var(--ui-mute);background:none;box-shadow:none}',
    '#v-monitor .mo-h .seg button.on{background:#fff;color:var(--ui-ink);box-shadow:0 1px 2px rgba(47,39,82,.12)}',
    '#v-monitor .mo-tabs,#v-team .mo-tabs{gap:4px!important;padding:0 0 8px!important;margin-bottom:12px!important}',
    '#v-monitor .mo-tabs button,#v-team .mo-tabs button{height:var(--ui-ctl);padding:0 12px!important;font:600 var(--fs-body,15px) var(--ui-font)!important;border-radius:10px!important;color:var(--ui-ink)}',
    '#v-monitor .mo-tabs button.on,#v-team .mo-tabs button.on{background:var(--ui-ink)!important;color:#fff!important}',
    '#v-monitor .mo-who{gap:6px!important;margin:0 0 10px!important}',
    '#v-monitor .mo-who button{height:30px;padding:0 12px!important;border-radius:10px!important;font:700 var(--fs-small,14px) var(--ui-font)!important;color:var(--ui-mute)!important;border:1px solid var(--ui-line)!important;background:#fff!important}',
    '#v-monitor .mo-who button.on{background:var(--ui-ink)!important;border-color:var(--ui-ink)!important;color:#fff!important}',
    '#v-monitor .mo-att button{border-radius:10px!important;min-height:var(--ui-ctl);padding:0 12px!important;font:700 var(--fs-small,14px) var(--ui-font)!important;background:var(--ui-out-b)!important;color:var(--ui-out)!important}',
    '#v-monitor .mo-att button.ok{background:var(--ui-in-b)!important;color:var(--ui-in)!important}#v-monitor .mo-att button.on{outline:2px solid var(--ui-out);outline-offset:1px}',
    '#v-monitor .mo-b{' + card + '}',
    '#v-monitor .mo-r{font-size:var(--fs-body,15px)!important;padding:9px 16px!important}',
    '#v-monitor .mo-r.hd{font:700 var(--fs-label,12px) var(--ui-font)!important;letter-spacing:.04em!important;color:var(--ui-mute)!important;background:#fff!important;border-bottom:1px solid var(--ui-line)}',
    '#v-monitor .mo-r:not(.hd):hover{background:var(--ui-soft)}',
    '#v-monitor .mo-r .ok{color:var(--ui-in)!important}#v-monitor .mo-r .bad{color:var(--ui-out)!important}',
    '#v-monitor .mo-k{font:700 var(--fs-label,12px)/1.6 var(--ui-font)!important;padding:1px 8px!important;background:var(--ui-in-b)!important;color:var(--ui-in)!important}',
    '#v-monitor .mo-k.no{background:var(--ui-out-b)!important;color:var(--ui-out)!important}#v-monitor .mo-k.wait{background:#F1F0F6!important;color:#5E5A75!important}',
    '#v-monitor .mo-f{' + card + ';padding:14px 16px!important;margin-top:12px!important}',
    '#v-monitor .mo-f>h2{font:700 var(--fs-h2,16px) var(--ui-font)!important;color:var(--ui-ink);margin:0 0 8px!important}',
    '#v-monitor .mo-it{font-size:var(--fs-body,15px)!important;padding:7px 0!important}',
    '#v-monitor .mo-it .kd{font:700 var(--fs-label,12px)/1.6 var(--ui-font)!important;letter-spacing:.02em!important;padding:1px 8px!important;color:#5E5A75!important}',
    '#v-team .t11,#v-team .tl11,#v-team .tin,#v-team details.tgrp,#v-team>.card,#v-team .card{' + card + '}',
    '#v-team .lead h1{font:700 var(--fs-h2,17px) var(--ui-font)!important;color:var(--ui-ink)!important;margin:6px 0 0!important}',
    '#v-team .lead .mute,#v-team .lead .small{font-size:var(--fs-small,14px)!important;color:var(--ui-mute)!important}',
    '#v-team .tl11 .hd b,#v-team details.tgrp>summary b,#v-team details.tgrp>summary h2{font:700 var(--fs-h2,16px) var(--ui-font)!important;color:var(--ui-ink)}',
    '#v-team .t11h{font:700 var(--fs-label,12px) var(--ui-font)!important;letter-spacing:.04em;text-transform:uppercase;color:var(--ui-mute)!important}',
    /* ---------- To do ---------- */
    '#v-mtoday #tdFocus,#v-mtoday .sec,#v-mtoday details.tdx{' + card + ';background-image:none!important}',
    '#v-mtoday section.sec[id^="td-"],#v-mtoday details.sec[id^="td-"],#v-mtoday .sec{box-shadow:none!important;padding:14px 16px!important}',
    '#v-mtoday #tdFocus h2,#v-mtoday .sec>h2,#v-mtoday details.tdx>summary h2{font:700 var(--fs-h2,16px) var(--ui-font)!important;color:var(--ui-ink)!important}',
    '#v-mtoday h2 .c{font:400 var(--fs-small,14px) var(--ui-font)!important;color:var(--ui-mute)!important}',
    '#v-mtoday #tdFocus .li{padding:8px 6px!important;border-radius:10px!important}',
    '#v-mtoday #tdFocus .li .grow{font-size:var(--fs-body,15px)!important;color:#2A2540}',
    '#v-mtoday .td2-n{width:24px!important;height:24px!important;font:700 var(--fs-small,13px) var(--ui-font)!important;background:#F1F0F6!important;color:var(--ui-ink)!important}',
    /* To do summary tiles → KPI strip */
    '#v-mtoday .tdsum{gap:0!important;background:#fff;border:1px solid var(--ui-line);border-radius:var(--ui-r);overflow:hidden;margin:12px 0!important}',
    '#v-mtoday .tdsum a{position:relative;display:block!important;border:0!important;border-left:1px solid var(--ui-line)!important;border-radius:0!important;box-shadow:none!important;padding:12px 16px!important;transform:none!important}',
    '#v-mtoday .tdsum a:first-child{border-left:0!important}#v-mtoday .tdsum a:hover{background:var(--ui-soft)}',
    '#v-mtoday .tdsum a b{display:block;font:700 var(--fs-kpi,22px)/1.2 var(--ui-font)!important;color:var(--ui-ink)!important;margin-top:4px}',
    '#v-mtoday .tdsum a::before{display:none!important}',
    '#v-mtoday .tdsum a span{display:block;font:700 var(--fs-label,12px) var(--ui-font)!important;letter-spacing:.04em;text-transform:uppercase;color:var(--ui-mute)!important}',
    '#v-mtoday .tdsum a{display:flex!important;flex-direction:column;align-items:flex-start!important;gap:0!important}',
    '#v-mtoday .tdsum a small{font:400 var(--fs-small,13px) var(--ui-font)!important;text-transform:none;letter-spacing:0;color:var(--ui-mute)!important;margin-top:2px}',
    '#v-mtoday .tdsum a.hot small:not(.nc){color:var(--ui-out)!important}',
    '#v-mtoday .tdsum a.hot:after{position:static!important;display:inline-block;margin-top:6px;font:700 var(--fs-label,12px)/1.6 var(--ui-font)!important;letter-spacing:0!important;text-transform:none!important;padding:1px 8px!important;background:var(--ui-ac-b)!important;color:var(--ui-ac)!important;content:"Needs you"!important}',
    '#v-mtoday .ic90{background:#F1F0F6!important;color:var(--ui-ink)!important}',
    /* ---------- Schedule ---------- */
    '#v-schedule .sch-s input.search,#v-schedule #scQ{height:40px!important;border:1px solid var(--ui-line)!important;border-radius:10px!important;box-shadow:none!important;font:13.5px var(--ui-font)!important}',
    '#v-schedule .s2-d{border:1px solid var(--ui-line)!important;border-radius:12px!important;box-shadow:none!important}',
    '#v-schedule .s2-d.on{background:var(--ui-ink)!important;border-color:var(--ui-ink)!important}',
    '#v-schedule .s2-ar{border:1px solid var(--ui-line)!important;border-radius:10px!important;box-shadow:none!important;background:#fff!important}',
    '#v-schedule .s2-sum,#v-schedule .dg16,#v-schedule details.fin20{' + card + '}',
    '#v-schedule .s2-sum{padding:10px 16px!important;font-size:var(--fs-small,14px)!important;color:var(--ui-mute)!important}',
    '#v-schedule .s2-sum b{font:700 var(--fs-kpi,22px) var(--ui-font)!important;color:var(--ui-ink)!important}#v-schedule .s2-sum b.minus{color:var(--ui-out)!important}',
    '#v-schedule .s2-sum .nx{font:700 var(--fs-small,14px) var(--ui-font)!important;color:var(--ui-teal-d)!important}',
    '#v-schedule .dg16 .h b,#v-schedule details.fin20>summary b{font:700 var(--fs-h2,16px) var(--ui-font)!important;color:var(--ui-ink)!important}',
    '#v-schedule .lb20{font:700 var(--fs-label,12px) var(--ui-font)!important;letter-spacing:.04em;text-transform:uppercase;color:var(--ui-mute)!important}',
    '#v-schedule .sctb .seg{background:#F1F0F6;border-radius:10px;padding:2px;height:var(--ui-ctl);box-sizing:border-box}',
    '#v-schedule .sctb .seg button{height:30px;border:0!important;border-radius:8px!important;padding:0 12px!important;font:700 var(--fs-small,14px) var(--ui-font)!important;color:var(--ui-mute)!important;background:none!important;box-shadow:none!important}',
    '#v-schedule .sctb .seg button.on{background:#fff!important;color:var(--ui-ink)!important;box-shadow:0 1px 2px rgba(47,39,82,.12)!important}',
    '#v-schedule .scsel{height:var(--ui-ctl)!important;border:1px solid var(--ui-line)!important;border-radius:10px!important;box-shadow:none!important;font:700 var(--fs-small,14px) var(--ui-font)!important}',
    '#v-schedule .hh16 b{font:700 var(--fs-h2,16px) var(--ui-font)!important;color:var(--ui-ink)}#v-schedule .hh16 span{font-size:var(--fs-small,13px)!important;color:var(--ui-mute)}',
    '#v-schedule .cls .nm{font:700 var(--fs-body,15px) var(--ui-font)!important;color:var(--ui-ink)}#v-schedule .cls .t b{font:700 var(--fs-body,15px) var(--ui-font)!important}',
    '#v-schedule .cls .small{font-size:var(--fs-small,13px)!important}',
    '#v-schedule .ok20{border-radius:10px!important;font:600 var(--fs-small,13px) var(--ui-font)!important;box-shadow:none!important}',
    /* ---------- Messages ---------- */
    '#v-msgs .tb22{gap:6px!important;margin-top:4px!important}',
    '@media(min-width:900px){#v-msgs .tb22{flex-wrap:wrap!important;overflow:visible!important}}',
    '#v-msgs .tb22 button{height:var(--ui-ctl);min-height:0!important;border-radius:10px!important;padding:0 10px 0 12px!important;font:700 var(--fs-small,14px) var(--ui-font)!important;border:1px solid var(--ui-line)!important;background:#fff!important;color:var(--ui-mute)!important;box-shadow:none!important;display:inline-flex;align-items:center;gap:6px}',
    '#v-msgs .tb22 button.teal{background:var(--ui-ink)!important;border-color:var(--ui-ink)!important;color:#fff!important}',
    '#v-msgs .tb22 button b{font:700 var(--fs-label,12px)/1.6 var(--ui-font)!important}',
    '#v-msgs .ib22{' + card + ';padding:4px 8px!important;margin-top:12px!important}',
    '#v-msgs .dh22{font:700 var(--fs-label,12px) var(--ui-font)!important;letter-spacing:.04em!important;text-transform:uppercase;color:var(--ui-mute)!important}',
    '#v-msgs .ib22 .li .grow>b{font:700 var(--fs-body,15px) var(--ui-font)!important;color:var(--ui-ink)}',
    '#v-msgs .ib22 .li .small{font-size:var(--fs-small,14px)!important}',
    '#v-msgs .ib22 .li .av{width:36px!important;height:36px!important;border-radius:18px!important;font-size:var(--fs-small,13px)!important}',
    /* ---------- dialogs opened from these screens ---------- */
    '#sheet.d1s #sheetBody{font-family:var(--ui-font);font-variant-numeric:tabular-nums}',
    '#sheet.d1s #sheetBody>h1:first-child,#sheet.d1s #sheetBody>h2:first-child{font-family:var(--ui-brand)!important;font-weight:400!important;font-size:calc(var(--fs-h1,26px) * .85)!important;color:var(--ui-ink)!important}',
    '#sheet.d1s #sheetBody>h1:first-child+.mute.small,#sheet.d1s #sheetBody>h2:first-child+.mute.small{font-size:var(--fs-small,14px)!important;color:var(--ui-mute)!important}',
    '#sheet.d1s #sheetBody .btn{min-height:38px;font-size:var(--fs-body,15px)!important;font-weight:700;box-shadow:none!important}',
    '#sheet.d1s #sheetBody .btn.sm{min-height:var(--ui-ctl);font-size:var(--fs-small,14px)!important}',
    '#sheet.d1s #sheetBody .mon,#sheet.d1s #sheetBody .mon-g>div,#sheet.d1s #sheetBody .card{border-radius:12px!important;box-shadow:none!important}',
    '#sheet.d1s #sheetBody label,#sheet.d1s #sheetBody .lbl{font-size:var(--fs-small,14px)}',
    /* nothing under 12px (Misty 15:05): small chart / strip labels raised to the label size */
    '#v-home .bz2-c>b,#v-home .bz2-c>span,#v-home .ov-ring span,#v-home .x-mini em,#v-home .x-col b,#v-home .x-col span,#v-team .cols b.ln span,#v-team .p .ax span,#v-team .p .lg span,#v-team details>summary,#v-schedule .s2-d span,#v-schedule .s2-d em,#v-schedule .dg16 .c b,#v-schedule .dg16 .ax span,#v-schedule .vn-row,#v-schedule .cxby,#v-team .tl11 .ax i,#v-team .tl11 .r>em,#v-team .tl11 .lg span,#v-team .tl11 .hd span,#v-team .lb19,#v-team .tgrp-h,#v-team .ti-q,#v-team .h>span{font-size:var(--fs-label,12px)!important}',
    '#v-home .bz2-c>b{letter-spacing:-.02em;white-space:nowrap}#v-home .x-dn svg text{font-size:var(--fs-label,12px)}',
    /* ---------- phones ---------- */
    '@media(max-width:900px){#v-home .bz2-k{grid-template-columns:1fr 1fr!important}#v-home .bz2-k>div:nth-child(odd){border-left:0!important}#v-home .bz2-k>div:nth-child(n+3){border-top:1px solid var(--ui-line)!important}',
    '#v-mtoday .tdsum{display:grid!important;width:100%;box-sizing:border-box;grid-template-columns:1fr 1fr!important}#v-mtoday .tdsum a:nth-child(odd){border-left:0!important}#v-mtoday .tdsum a:nth-child(n+3){border-top:1px solid var(--ui-line)!important}}',
    '@media(max-width:640px){#v-home .bz2-ch{overflow-x:auto;overflow-y:hidden;-webkit-overflow-scrolling:touch;padding-right:8px}#v-home .bz2-ch>.bz2-c{min-width:46px;flex:none}',
    '#v-home .bz2-ch>.bz2-c.cur{min-width:64px}#v-monitor .mo-h h1,#v-team>.mo-h h1,#v-mtoday .lead h1,#v-schedule .lead h1,#v-msgs .lead h1,#v-home .ovc .x-top h1{font-size:calc(var(--fs-h1,26px) * .85)!important}',
    '#v-home .ovc .x-st{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))}#v-home .ovc .x-st a{min-width:0!important;padding:8px 10px!important}',
    '#v-home .ovc .x-st b,#v-home .bz2-k b,#v-mtoday .tdsum a b,#v-schedule .s2-sum b{font-size:calc(var(--fs-kpi,22px) * .82)!important}',
    '#v-mtoday .sec,#v-home .ovc section.ov-card,#v-home .ovc .x-c,#v-home .ovc .x-top,#v-monitor .mo-f{padding:12px!important}',
    '#v-home .ovc .x-st a,#v-home .ov-mon .ov-mb button,#v-home .ov-hd .lk,' + all('.btn.sm') + ',#v-monitor .mo-tabs button,#v-team .mo-tabs button,#v-monitor .mo-who button,#v-monitor .mo-att button,#v-monitor .mo-h .seg,#v-schedule .sctb .seg,#v-schedule .scsel,#v-schedule .s2-ar,#v-msgs .tb22 button,#v-mtoday .g891-t{min-height:44px!important}',
    '#v-mtoday a.nm{display:inline-block;padding:12px 0;margin:-12px 0}#v-monitor .mo-h .seg,#v-schedule .sctb .seg{padding:0!important;height:44px!important}#v-monitor .mo-h .seg button,#v-schedule .sctb .seg button{height:44px!important}#v-monitor .mo-r:not(.hd){min-height:44px}',
    '#v-home a.ov-ql,#v-home .c-foot a,#v-team button,#v-team details>summary,#v-team a.ti-loc,#v-team a.ti-pf,#v-team .ti-q[onclick],#v-team .ti-q[role=button],#v-schedule #scQ,#v-schedule .cxbtn,#v-schedule a.link,#v-schedule .s2-sum~div a{min-height:44px!important;box-sizing:border-box}',
    '#v-home .c-foot a,#v-team a.ti-loc,#v-team a.ti-pf,#v-schedule .cxbtn{display:inline-flex!important;align-items:center}#v-team details>summary{display:flex;align-items:center}#v-home .ov-hd .lk{display:inline-flex;align-items:center}',
    '#v-monitor .mo-r{padding:9px 10px!important}#sheet.d1s #sheetBody>h1:first-child,#sheet.d1s #sheetBody>h2:first-child{font-size:calc(var(--fs-h1,26px) * .8)!important}}'
  ].join('\n');
  var st = document.createElement('style'); st.id = 'd1s910'; st.textContent = css; document.head.appendChild(st);
  /* dialogs opened from a D1 screen get the D1 dialog look */
  var MINE = { home: 1, monitor: 1, team: 1, mtoday: 1, schedule: 1, msgs: 1 };
  var mark = function(){ try{ var sh = document.getElementById('sheet'); if(!sh) return; var on = sh.classList.contains('on'); sh.classList.toggle('d1s', on && typeof VIEW !== 'undefined' && !!MINE[VIEW]); }catch(e){} };
  var o0 = window.openSheet; if(typeof o0 === 'function') window.openSheet = function(){ var r = o0.apply(this, arguments); mark(); return r; };
  var c0 = window.closeSheet; if(typeof c0 === 'function') window.closeSheet = function(){ var r = c0.apply(this, arguments); setTimeout(mark, 300); return r; };
})();
</script>
` + s.slice(i);
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
