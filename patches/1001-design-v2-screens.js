// 1001: (Misty, 25 Oct 20:13) "apply this direction across the remaining screens and deploy it" — design v2 (1000) rules
// extended to every screen and tab, still through the shared layer only:
// · section headings everywhere: the 14×3 px gradient dash (global h2::before) becomes the same slim vertical teal bar as Overview;
// · table headers (thead): small upper-case muted labels, figures tabular and right-aligned (991 marks amount columns);
// · panels (.sec) inside dialogs and screens: the same card border/radius; sparse panels lose the extra padding;
// · stat chips (.stats .stat) and KPI rows (.kpis): number semibold ink, label muted;
// · lists (.li): a hover tint and keyboard focus ring;
// · Teachers today: chips and "updated" on one line on laptops.
// Documents (#printArea, .docprint, .paper, .memo, .sd, .ivp, .ivq, .tr-page, #rfNote, [data-doc]) are excluded.
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const i = s.lastIndexOf('</body>');
const D = ':not(:where(#printArea,.docprint,.paper,.memo,.sd,.ivp,.ivq,.tr-page,#rfNote,[data-doc]) *)';
const css = [
  ':is(#app,#sheet) h2' + D + '::before{width:4px;height:18px;border-radius:2px;background:var(--d-teal,#01B0BF)}',
  ':is(#app,#sheet) table' + D + ' thead th{font-size:.75rem;font-weight:600;letter-spacing:.05em;text-transform:uppercase;color:var(--d-mute,#5E5A76)}',
  ':is(#app,#sheet) table' + D + ' :is(td,th){font-variant-numeric:tabular-nums}',
  ':is(#app,#sheet) .sec' + D + '{border-color:var(--d-line,#E7E5EE)!important;border-radius:var(--d-r,14px)!important}',
  ':is(#app,#sheet) .stats .stat' + D + '{background:var(--d-sunk,#F7F7FA)!important;border:1px solid var(--d-line2,#F0EEF5)!important}',
  ':is(#app,#sheet) .stats .stat b' + D + '{font-weight:600;color:var(--d-ink,#2B2450)}',
  ':is(#app,#sheet) .stats .stat span' + D + '{color:var(--d-mute,#5E5A76)}',
  ':is(#app,#sheet) .kpis b' + D + '{font-weight:600}',
  ':is(#app,#sheet) .kpis span' + D + '{color:var(--d-mute,#5E5A76)}',
  ':is(#app,#sheet) .li[onclick]:hover' + D + '{background:#FAFAFD}',
  ':is(#app,#sheet) .li[tabindex]:focus-visible{outline:3px solid rgba(1,176,191,.45);outline-offset:-3px}',
  /* selected tab / filter: beat screen-specific dark "on" fills (text would be dark on dark) */
  ':is(#app,#sheet) :is(.mo-tabs,.stu-tabs)>button.on:not(#z1001):not(#y1001){background:transparent!important;color:var(--d-ink,#2B2450)!important}',
  ':is(#app,#sheet) .seg>button.on:not(#z1001):not(#y1001){background:var(--d-tint,#EAF7F8)!important;color:var(--d-teal-d,#00707A)!important}',
  '@media(min-width:641px){#v-home #ovMon{display:grid!important;grid-template-columns:auto 1fr;align-items:center;column-gap:14px}#v-home #ovMon>.ov-hd{grid-column:1/-1}#v-home #ovMon>.ov-mb{display:flex!important;margin:0!important}#v-home #ovMon>.small{display:block!important;margin:0!important}}'
].join('\n');
s = s.slice(0, i) + '<style id="d1001">/* 1001 · design v2 across screens */\n' + css + '\n</style>\n' + s.slice(i);
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
