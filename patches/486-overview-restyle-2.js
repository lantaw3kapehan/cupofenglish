// 20 Oct · Overview, the top and the cards in the same look: coloured tile edges and labels, Levels as a light→dark teal scale, Student flow tiles coloured by meaning.
require('../tools/lib.js')(process.argv[2], [["\n</script>\n\n</body>", "\n</script>\n<script>\n" + `/* 20 Oct · 486 · Misty: "and this parts?" — the rest of Overview in the Sales & costs look. Style only.
   · Today tiles (Classes · On time · Next): coloured edge, tint and label (teal · green · violet).
   · Levels: one teal scale, light for Pre-A1 to dark for C2 (a level is a step up, not a different kind).
   · Students per teacher: the soft violet of the other charts.
   · Student flow tiles coloured by what they count: trials teal · trial → enrolled green · renewals violet · stopped coral
     (the same colours as the bars beside them). */
(function(){
  const css = document.createElement('style');
  css.textContent = \`
.ovc .x-st a{border:0!important;border-left:4px solid var(--c86)!important;background:var(--b86)!important;border-radius:12px!important}
.ovc .x-st a:nth-child(1){--c86:#00A3AD;--b86:#EEF8F9} .ovc .x-st a:nth-child(2){--c86:#2E9E6F;--b86:#EEF8F3} .ovc .x-st a:nth-child(3){--c86:#9A8FD8;--b86:#F4F2FB}
.ovc .x-st span{color:var(--c86)!important;filter:brightness(.8);font-weight:700}
.ovc .x-col>div:nth-child(1) i{background:#BFE5E7!important} .ovc .x-col>div:nth-child(2) i{background:#8FD0D4!important} .ovc .x-col>div:nth-child(3) i{background:#5FB8BE!important}
.ovc .x-col>div:nth-child(4) i{background:#2FA0A8!important} .ovc .x-col>div:nth-child(5) i{background:#16858D!important} .ovc .x-col>div:nth-child(6) i{background:#0D6B72!important} .ovc .x-col>div:nth-child(7) i{background:#08535A!important}
.ovc .x-col i{border-radius:5px 5px 0 0!important}
.ovc .x-tb div p i{background:#A39BE0!important;border-radius:3px!important}
.ovc .sf24 .sfi{border-left:4px solid var(--c86)!important;background:var(--b86)!important}
.ovc .sf24 .sft .sfi:nth-child(1){--c86:#5FB8BE;--b86:#EEF8F9} .ovc .sf24 .sft .sfi:nth-child(2){--c86:#2E9E6F;--b86:#EEF8F3}
.ovc .sf24 .sft .sfi:nth-child(3){--c86:#A39BE0;--b86:#F4F2FB} .ovc .sf24 .sft .sfi:nth-child(4){--c86:#EDA593;--b86:#FCF1EE}
.ovc .sf24 .sfi span{color:var(--c86)!important;filter:brightness(.75);font-weight:700}\`;
  document.head.appendChild(css);
})();
` + "</script>\n\n</body>"]]);
