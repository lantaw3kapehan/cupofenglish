// 1468 · President QA follow-up (D13). Teachers › Team map: the chart is an SVG drawn on a 1000-wide viewBox and scaled to its card, so
//   its 35 labels (axis 11, teacher names 11.5, quadrant names 12 user units) rendered at 11–12 px on a wide laptop, about 7.5 px at
//   1024 px and about 4 px on a phone. Now pure CSS (container queries, applied at first paint — nothing is resized afterwards, so nothing
//   moves): the label size is chosen from the chart's own width so every label renders at 12 px or more. Below 680 px of chart width the
//   chart keeps a 680 px minimum and scrolls sideways inside its card (the page itself never scrolls sideways); labels may use the card's
//   padding (overflow visible) so "100%" is not clipped. Also the teacher rows' units column (D19, below). Display only.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["</body>\n</html>",
   "<style id=\"css1468\">\n/* 1468 · Team map labels ≥ 12 px rendered (user units = 12 px ÷ chart scale) */\n" +
   "#v-teachers .mp43{container-type:inline-size;overflow-x:auto}\n" +
   "#v-teachers .mp43 svg{min-width:680px;overflow:visible}\n" +
   "#v-teachers .mp43 svg text{font-size:17.7px}\n" +
   "@container (min-width:700px){#v-teachers .mp43 svg text{font-size:17.2px}}\n" +
   "@container (min-width:760px){#v-teachers .mp43 svg text{font-size:16px}}\n" +
   "@container (min-width:860px){#v-teachers .mp43 svg text{font-size:14px}}\n" +
   "@container (min-width:1000px){#v-teachers .mp43 svg text{font-size:12px}}\n" +
   "/* 1468 · teacher rows (≥ 760 px): the five columns' minimums added up to the whole card at 1024 px and the last one was a fixed 76 px,\n" +
   "   so \"105.5 units\" was cut off at the right edge. The columns may now shrink and the units column is 120 px (fits 999.5 units, same for every row so columns stay aligned). */\n" +
   "@media (min-width:760px){body #v-teachers .tc2{grid-template-columns:38px minmax(0,1.3fr) minmax(0,1fr) minmax(0,1.3fr) 120px}}\n" +
   "</style>\n</body>\n</html>"],
]);
