// 1190: (Misty, 26 Oct 17:00) "check distorted texts too" — app-wide scan (laptop 2000/1440/1366/1093, phone 390) for text drawn
//      over other text, boxes their own text spills out of, and short labels cut off. Fixes (presentation only):
// · Finance › Overview: the sparkline boxes ("5 of 11 months reached it", "sales so far · light = one-off…") were 16 px tall —
//   they share the class "sk" with the grey loading placeholder, so they also got its height and shimmer; the caption then sat on
//   top of the next card. The boxes now take their own height (same kind of class collision as 1143).
// · Performance › QA by domain: "3.2 · weakest" wrapped out of its 26-px row onto the card edge; long domain names were cut.
// · Students list (laptop): "46.5 left · shared" ran into "1 class a week · 50 min", and "2 classes a week · 25 min" into the
//   deadline column — the columns now fit their content.
// · Leave › Days of leave: names cut to "Teacher Bru…" → full names. Overview › teachers bars: names cut at 62 px → 86 px.
// · Trainings matrix rank chip "Newly Qualified" cut → wraps. Enquiries funnel step label ("REACHED TRIAL") cut → wraps.
// · Finance "₱207,661 / month" and Payroll teacher names cut at 125% zoom → wrap.
// · Teacher phone: Today card student name ("Ben Te…") and Students list names cut → wrap; Trainings roadmap labels on phones
//   no longer run into the step below (max three lines, smaller text).
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const css = [
  '.x73 .sk{height:auto!important;background:none!important;animation:none!important;border-radius:0!important;width:auto!important}',
  '#v-perf .dm52 .r{height:auto!important;min-height:26px;grid-template-columns:minmax(150px,240px) minmax(0,1fr) auto!important}',
  '#v-perf .dm52 .r>:last-child{white-space:nowrap}',
  '@media(min-width:900px){#v-astudents .sa-h,#v-astudents .li.sa{grid-template-columns:minmax(0,1fr) 72px 132px 196px 116px!important}#v-astudents .li.sa .sa-r>.num{white-space:normal;line-height:1.25}}',
  '@media(min-width:900px) and (max-width:1279px){#v-astudents .sa-h,#v-astudents .li.sa{grid-template-columns:minmax(0,1fr) 60px 112px 150px 100px!important;column-gap:10px!important}#v-astudents .sa-w b,#v-astudents .sa-w small{white-space:normal}}',
  '@media(max-width:640px){#v-db .row>b.ell{white-space:normal!important;overflow:visible!important}}',
  '#v-leave .lv3-bars{grid-template-columns:repeat(auto-fill,minmax(270px,1fr))!important}',
  '#v-leave .lv3-bar{grid-template-columns:minmax(110px,max-content) minmax(40px,1fr) auto!important}',
  '#v-leave .lv3-bar>b.ell{overflow:visible!important;text-overflow:clip!important}',
  '.ovc .x-tb div{grid-template-columns:86px minmax(0,1fr) 22px!important}',
  '.tq-rk span{white-space:normal!important;overflow:visible!important;line-height:1.2}',
  '#v-enquiry .fn31 .st em{white-space:normal!important;overflow:visible!important}',
  '#v-money .t-w>b{white-space:normal!important;overflow:visible!important}',
  '.py-n b{white-space:normal!important;overflow:visible!important;text-overflow:clip!important;overflow-wrap:anywhere}',
  '@media(max-width:640px){#v-today .cls .row{flex-wrap:wrap}#v-today .cls .row>.nm.ell{white-space:normal!important;overflow:visible!important;text-overflow:clip!important;min-width:0}',
  '#v-students .c504 .nm b{white-space:normal!important;overflow:visible!important}',
  '.rq-rl{font-size:10.5px!important;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}.rq-rl small{display:none}.rq-rp{white-space:normal!important;max-width:34%;font-size:11px!important;padding:6px 8px!important}.rq-rp small{white-space:normal}}'
].join('\n');
const i = s.lastIndexOf('</body>');
s = s.slice(0, i) + '<style id="d1190">/* 1190 · distorted text sweep */\n' + css + '\n</style>\n' + s.slice(i);
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
