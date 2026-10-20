/* 20 Oct · 436 · Trials, tighter (Misty: "the spaces are too big from each other"). Style only.
   · Cards 12 px apart; smaller paddings; the four 45-day tiles are slimmer.
   · Charts: teacher rows 22 px; the levels chart sits right above its two figures (no empty gap).
   · Rows: level and score on one line on the right ("A2 · 20/36" with the bar under), so each trial is two short lines. */
(function(){
  const css = document.createElement('style');
  css.textContent = `
#v-trials .lead{margin-bottom:0!important}
#v-trials .lead h1{margin-bottom:2px!important}
#v-trials #tpQ{padding-top:10px!important;padding-bottom:10px!important}
#v-trials>div[style*="margin-top:14px"]{margin-top:10px!important}
#v-trials #tpBk{margin-top:12px!important;padding:12px 16px!important}
#v-trials #tpBk h2{margin-bottom:2px!important;font-size:16px!important}
#v-trials #tpBk .tpb{padding:6px 8px!important;gap:12px!important}
#v-trials #tpBk .tpb-d{width:44px!important;padding:4px 0!important}
#v-trials #tpBk .tpb-d b{font-size:17px!important}
#v-trials .tp2{margin-top:12px!important;padding:12px 16px 12px!important}
#v-trials .tp3h{margin-bottom:6px!important}
#v-trials .tp3t{gap:8px!important}
#v-trials .tp3t button{padding:8px 12px!important}
#v-trials .tp3t b{font-size:22px!important}
#v-trials .tp3t span{margin-top:2px!important;font-size:12.5px!important}
#v-trials .tp3b{margin-top:10px!important;height:6px!important}
#v-trials .ti33{margin-top:10px!important;gap:10px!important}
#v-trials .ti33>div{padding:10px 12px 8px!important}
#v-trials .ti33 .h{margin-bottom:4px!important}
#v-trials .ti33 .r{height:22px;padding:0 4px!important}
#v-trials .ti33 .r>em{font-size:11.5px!important}
#v-trials .ti33 .r>em b{font-size:13px}
#v-trials .ti33 .lg{margin-top:4px!important}
#v-trials .ti33 .lv35{justify-content:flex-start!important;gap:8px!important}
#v-trials .ti33 .lv35 .cs{height:92px!important;padding-top:14px!important}
#v-trials .ti33 .lv35 .kp div{padding:6px 10px!important}
#v-trials .ti33 .lv35 .kp b{font-size:18px!important}
#v-trials #tpTabs>.seg{margin-top:12px!important;padding:10px 16px 4px!important}
#v-trials #tpTabs>.sk2{padding:4px 16px 10px!important}
#v-trials #tpTabs .seg button,#v-trials #tpTabs .sk2 button{padding:5px 12px!important;font-size:13px!important}
#v-trials #tpTabs:not(:has(>.sk2))>.seg{padding-bottom:10px!important}
#v-trials #tpList{padding:6px 10px!important}
#v-trials #tpList .rp-row.t33{padding:6px 10px!important;gap:12px!important}
#v-trials #tpList .rp-row.t33 .av{width:34px!important;height:34px!important;font-size:14px!important}
#v-trials #tpList .rp-row.t33>div[style*="text-align:right"]{display:grid!important;grid-template-columns:auto auto;align-items:center;column-gap:8px;row-gap:3px;justify-items:end;min-width:120px}
#v-trials #tpList .rp-row.t33>div[style*="text-align:right"]>.small.num{margin:0!important;display:contents}
#v-trials #tpList .rp-row.t33 .sc33{grid-column:1/-1;margin:0!important;width:100%!important}
#v-trials #tpList .rp-row.t33>div[style*="text-align:right"]>b.num{font-size:12px!important;font-family:inherit!important;font-weight:700!important;padding:2px 9px!important;line-height:1.5}
#v-trials #tpAt{margin-top:4px!important}`;
  document.head.appendChild(css);
})();
