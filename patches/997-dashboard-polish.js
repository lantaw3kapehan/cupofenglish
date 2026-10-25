// 997: (Misty, 25 Oct 19:44) "improve card hierarchy, wrapping, and the active navigation highlight. Keep sidebar text comfortably
//      readable; tighten excessive spacing before reducing font size. Use spacing selectively — compact sparse panels such as
//      'Teachers today'. Keep restrained teal/purple brand accents. The teal dash can be simplified, but removing it alone will
//      not address the flat appearance. Clearer priorities, polished dashboard, preserve typography and functionality.
//      Show laptop and phone previews before deploying."   (replaces 995, which was undone by 996)
// · Sidebar (laptop/tablet): menu text stays 16px; rows and group gaps tighter; group labels quieter; the screen you're on:
//   solid soft-teal background, 3px teal bar on the left, teal-dark semibold text; hover light grey.
// · Overview cards: a hairline border + soft shadow so cards stand off the page; the card header is separated by a thin rule;
//   the gradient dash before section titles becomes a slim vertical teal bar.
// · Priorities: the "things need you" line becomes an amber-edged strip; the expected-net tile (the one that is still
//   moving) is tinted teal; KPI tiles become separate soft tiles with label (small caps) › number (semibold) › note.
// · Wrapping: numbers never break (₱/≈ stay with the figure); notes wrap under them in full.
// · "Teachers today" is compacted: the chips and "updated" sit on one line.
// Presentation only (CSS), Overview + sidebar. Finance Overview keeps its look. Typography (991) unchanged. Documents untouched.
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const i = s.lastIndexOf('</body>');
const H = '#v-home';
const css = [
  /* sidebar */
  '@media(min-width:641px){',
  '#navIn .ng{font-size:.75rem!important;letter-spacing:.08em;font-weight:600;color:#7A7690;margin:14px 0 2px 12px!important;padding:0!important}',
  '#navIn .ng:first-child{margin-top:2px!important}',
  '#navIn button[data-v]{min-height:36px;padding:6px 10px!important;margin:1px 0!important;border-radius:10px!important;gap:10px;color:#3F3A5C;background:transparent!important;box-shadow:none!important}',
  '#navIn button[data-v] svg{opacity:.75}',
  '#navIn button[data-v]:hover{background:#F3F2F8!important}',
  '#navIn button[data-v]:is(.on,[aria-current=page]){background:#E2F4F5!important;color:#00636B!important;font-weight:600!important;box-shadow:inset 3px 0 0 #01B0BF!important}',
  '#navIn button[data-v]:is(.on,[aria-current=page]) svg{opacity:1}',
  '}',
  /* cards: depth */
  H + ' :is(.ov-card,.x-top){background:#fff;border:1px solid #ECEAF2!important;border-radius:16px!important;box-shadow:0 1px 2px rgba(47,39,82,.04),0 8px 20px -12px rgba(47,39,82,.14)!important}',
  H + ' .ov-hd{padding-bottom:12px;margin-bottom:14px;border-bottom:1px solid #F0EEF5;align-items:center}',
  /* simplified accent: slim vertical teal bar */
  H + ' .ov-hd h2{display:flex;align-items:center;gap:10px}',
  H + ' .ov-hd h2::before{width:4px!important;height:18px!important;border-radius:2px!important;background:#01B0BF!important;margin:0!important;position:static!important;flex:none}',
  /* priorities: needs-you strip */
  H + ' .x-todo{border-radius:12px!important;padding:10px 14px!important;margin-top:14px}',
  H + ' .x-todo.warm{background:#FFF7EA!important;box-shadow:inset 3px 0 0 #E3A13B!important;border-top:0!important}',
  /* KPI tiles: separate soft tiles, clear hierarchy */
  H + ' :is(.bz2-k,.x-st){gap:10px!important;border:0!important;background:transparent!important}',
  H + ' :is(.bz2-k>div,.x-st>a){background:#F8F8FB!important;border:1px solid #EEECF3!important;border-radius:12px!important;padding:12px 16px!important;display:flex;flex-direction:column;gap:3px;min-width:0}',
  H + ' :is(.bz2-k>div,.x-st>a)>span:first-child{font-size:.75rem!important;font-weight:600!important;letter-spacing:.06em;text-transform:uppercase;color:#6B6782!important;line-height:1.3}',
  H + ' :is(.bz2-k>div,.x-st>a)>b{font-weight:600!important;line-height:1.15;white-space:nowrap;font-variant-numeric:tabular-nums;color:#2F2752}',
  H + ' :is(.bz2-k>div,.x-st>a)>:is(em,small){font-style:normal;color:#6B6782;line-height:1.4;font-size:.875rem!important}',
  H + ' .bz2-k>div>em.up{color:#2E7D5B!important}',
  H + ' .bz2-k>div.now{background:#EEF8F9!important;border-color:#CDEBEE!important}',
  H + ' .bz2-k>div.now>b{color:#00636B}',
  /* compact sparse panel: Teachers today */
  H + ' #ovMon{padding:16px 20px!important}',
  H + ' #ovMon>.ov-hd{margin-bottom:10px}',
  H + ' #ovMon>.ov-mb{display:inline-flex!important;flex-wrap:wrap;gap:8px;margin:0 12px 0 0!important;vertical-align:middle}',
  H + ' #ovMon>.small{display:inline!important;margin:0!important;vertical-align:middle}',
  /* phones */
  '@media(max-width:640px){' + H + ' :is(.bz2-k>div,.x-st>a)>b{white-space:normal}' + H + ' :is(.ov-card,.x-top){border-radius:14px!important}}'
].join('\n');
s = s.slice(0, i) + '<style id="s997">/* 997 · dashboard polish */\n' + css + '\n</style>\n' + s.slice(i);
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
