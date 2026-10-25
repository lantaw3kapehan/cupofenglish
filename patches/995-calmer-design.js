// 995: (Misty, 25 Oct 19:42) "let us do this now": calmer sidebar · clearer cards · more breathing room, simpler section titles.
// · Sidebar (laptop/tablet): menu text 15px, tighter rows, quieter group labels; the screen you're on gets a solid soft-teal
//   background, a teal bar on the left and semibold text; hover is a light grey.
// · Cards (KPI tiles on Overview, Finance and the shared .ui-k tiles): label 12px semibold upper-case muted, number 26px
//   semibold on one line (₱ and ≈ stay with the number), note 14px muted under it, full text kept.
// · Breathing room: 24px between Overview sections, roomier card padding; section titles plain (no teal dash before them).
// Only presentation (CSS); nothing moves, no data or action changes. Documents untouched (all rules are inside #app).
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const i = s.lastIndexOf('</body>');
const css = [
  /* sidebar */
  '@media(min-width:641px){',
  '#navIn .ng{font-size:.75rem!important;letter-spacing:.08em;font-weight:600;color:#7A7690;margin:18px 0 4px 12px!important;padding:0!important}',
  '#navIn .ng:first-child{margin-top:4px!important}',
  '#navIn button[data-v]{font-size:.9375rem!important;min-height:36px;padding:6px 10px!important;margin:1px 0!important;border-radius:10px!important;gap:10px;color:#4A4664;background:transparent!important;box-shadow:none!important;font-weight:500!important}',
  '#navIn button[data-v] svg{width:18px!important;height:18px!important;opacity:.8}',
  '#navIn button[data-v]:hover{background:#F3F2F8!important}',
  '#navIn button[data-v].on,#navIn button[data-v][aria-current=page]{background:#E3F5F6!important;color:#00636B!important;font-weight:600!important;box-shadow:inset 3px 0 0 #01B0BF!important}',
  '#navIn button[data-v].on svg,#navIn button[data-v][aria-current=page] svg{opacity:1}',
  '}',
  /* section titles: plain, no teal dash */
  '#app main :is(h2,h3)::before{content:none!important;display:none!important}',
  '#app main .ov-hd h2,#app main .x-h b,#app main .ui-h h2{margin-left:0!important;padding-left:0!important}',
  /* breathing room */
  '#v-home .ovc{gap:24px!important}',
  '#v-home .ov-card,#v-home .x-top{padding:22px 24px!important}',
  '#v-home .ov-two{gap:24px!important}',
  /* KPI tiles */
  '#app :is(.bz2-k>div,.x-st>a,.fx-k>*,.ui-k>*){padding:14px 18px!important;display:flex;flex-direction:column;gap:4px}',
  '#app :is(.bz2-k>div,.x-st>a,.fx-k>*,.ui-k>*)>span:first-child{font-size:.75rem!important;font-weight:600!important;letter-spacing:.06em;text-transform:uppercase;color:#6B6782!important;line-height:1.3}',
  '#app :is(.bz2-k>div,.x-st>a,.fx-k>*,.ui-k>*)>b{font-size:1.625rem!important;font-weight:600!important;line-height:1.15;white-space:nowrap;font-variant-numeric:tabular-nums;letter-spacing:-.01em}',
  '#app :is(.bz2-k>div,.x-st>a,.fx-k>*,.ui-k>*)>:is(em,small,i:not(:empty)){font-size:.875rem!important;font-style:normal;color:#6B6782;line-height:1.4}',
  '#app :is(.bz2-k>div,.x-st>a,.fx-k>*,.ui-k>*)>em.up{color:#2E7D5B}',
  '@media(max-width:640px){#app :is(.bz2-k>div,.x-st>a,.fx-k>*,.ui-k>*)>b{font-size:1.375rem!important;white-space:normal}#v-home .ov-card,#v-home .x-top{padding:16px!important}#v-home .ovc{gap:16px!important}}'
].join('\n');
s = s.slice(0, i) + '<style id="s995">/* 995 · calmer sidebar, clearer cards, breathing room */\n' + css + '\n</style>\n' + s.slice(i);
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
