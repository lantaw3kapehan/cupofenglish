// 20 Oct · Payroll top card in the light style of the redesigned screens (white card, coloured label tiles).
require('../tools/lib.js')(process.argv[2], [["\n</script>\n\n</body>", "\n</script>\n<script>\n" + `/* 20 Oct · 461 · Misty: "this design can be improved to align with the screens we redesigned". Style only.
   The dark payroll card becomes a white card like Overview, Teachers and Trials: small grey label, big ink total, the three tiles with a
   coloured edge and label (last month green · pending amber · largest purple); the progress bar and key in the same calm colours. */
(function(){
  const css = document.createElement('style');
  css.textContent = \`
#v-payroll .py-hero{background:#fff!important;color:var(--ink)!important;border:1px solid var(--line);box-shadow:var(--sh1)!important;border-radius:var(--r-lg)!important;padding:16px 20px 14px!important}
#v-payroll .py-cup{display:none!important}
#v-payroll .py-hero .r1 span{color:#8A86A0!important;font-weight:400!important;letter-spacing:.08em!important}
#v-payroll .py-hero .big{font-size:34px!important;color:var(--ink)}
#v-payroll .py-hero .bs{color:#55526E!important}
#v-payroll .py-3{gap:10px!important;margin-top:12px!important}
#v-payroll .py-3>div{background:var(--bg61)!important;border:0!important;border-left:4px solid var(--c61)!important;border-radius:12px!important;padding:9px 14px!important}
#v-payroll .py-3>div:nth-child(1){--c61:#2E9E6F;--bg61:#EEF8F3}#v-payroll .py-3>div:nth-child(2){--c61:#D9962B;--bg61:#FCF6EA}#v-payroll .py-3>div:nth-child(3){--c61:#6C5FC7;--bg61:#F2F0FB}
#v-payroll .py-3 span{color:var(--c61)!important;letter-spacing:.08em!important}
#v-payroll .py-3 b{color:var(--ink)!important;font-size:21px!important}
#v-payroll .py-3 small{color:#55526E!important}
#v-payroll .py-bar{background:var(--soft)!important}
#v-payroll .py-key{color:#55526E!important}\`;
  document.head.appendChild(css);
})();
` + "</script>\n\n</body>"]]);
