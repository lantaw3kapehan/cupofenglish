// 2421 (Misty 19 Nov 13:41: "everything should be organized … systematic") · To do always shows its boxes in one fixed order,
//   whatever loads first: title → Your tasks → Do next → Ops Desk → Fix these → Enquiries → Picture check → Class videos → summary → the rest.
//   Also the last two older boxes (Data to fix, Package deadlines) get the shared card.
const file = process.argv[2];
const CSS = [
  '#v-mtoday{display:flex!important;flex-direction:column}',
  '#v-mtoday>*{order:20}',
  '#v-mtoday>.lead{order:0}', '#v-mtoday>#myTask2418{order:1}', '#v-mtoday>#tdFocus{order:2}', '#v-mtoday>#od2341{order:3}',
  '#v-mtoday>#o91fix{order:4}', '#v-mtoday>#enqTd{order:5}', '#v-mtoday>#sr2320{order:6}', '#v-mtoday>#vid1882{order:7}', '#v-mtoday>.tdsum{order:8}',
  '#v-mtoday>[id^="td-"]:not(.tdsum){background:var(--u-card)!important;border:1px solid var(--u-line)!important;border-radius:var(--u-r)!important;padding:var(--u-pad)!important;box-shadow:var(--u-sh)!important}',
  '#v-mtoday>[id^="td-"]>h2{font-family:var(--ui-font)!important;font-size:17px!important;font-weight:700!important;color:var(--u-ink)!important}'
].join('\n');
require('../tools/lib.js')(file, [['</style>\n<script id="b2278">', '</style>\n<style id="u2421">\n' + CSS + '\n</style>\n<script id="b2278">']]);
