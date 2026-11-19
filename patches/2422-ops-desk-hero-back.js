// 2422 · fix for 2420: the Ops Desk summary card is navy with white numbers; the shared white card hid them. Keep it navy
//   (same corners/padding as the rest), and keep the "Your tasks" title on one line on narrow screens.
const file = process.argv[2];
const CSS = [
  '#v-mtoday #od2341>.c:first-of-type{background:#2B2253!important;border:0!important;color:#fff}',
  '#v-mtoday #od2341>.c:first-of-type h3{color:#fff!important}',
  '#v-mtoday #myTask2418>div:first-child{flex-wrap:wrap}',
  '#v-mtoday #myTask2418>div:first-child>b{white-space:nowrap}',
  '#v-mtoday #myTask2418>div:first-child>.small{flex:1 1 220px;text-align:right}'
].join('\n');
require('../tools/lib.js')(file, [['</style>\n<script id="b2278">', '</style>\n<style id="u2422">\n' + CSS + '\n</style>\n<script id="b2278">']]);
