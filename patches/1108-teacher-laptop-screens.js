// 1108: (Misty, 26 Oct · stage G) per-screen laptop pass. Schedule, Students, student page, Growth, Pay, Time-ins,
//      Monthly feedback and Trainings were checked at 1440 / 1366 / 1280×720 / 125% and phone and already fit; this
//      fixes the one screen that wasted the laptop width:
// · Activity log (teacher's own page): on laptop the list uses the full width — what was saved and whether it saved
//   on the left, device / place / reference on the right — so a day fits on about half the scrolling. The
//   "Copy as proof" button is a normal-width button on laptop. Phones and the management pop-up are unchanged.
// Display only: nothing about what is logged, timed, copied or sent changes.
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const css = `
@media(min-width:1100px){
 .al-page{max-width:1120px}
 .al-page .al-it{gap:18px;padding:12px 0}
 .al-page .al-it>.grow{display:grid;grid-template-columns:minmax(0,1.25fr) minmax(0,1fr);column-gap:24px;grid-auto-flow:row dense;align-content:start}
 .al-page .al-it>.grow>*{grid-column:2;min-width:0}
 .al-page .al-it>.grow>b,.al-page .al-it>.grow>b+div{grid-column:1}
 .al-page .btn.teal.block{width:auto;display:inline-flex;padding-left:28px;padding-right:28px}
}`;
const i = s.lastIndexOf('</style>');
s = s.slice(0, i) + '/* d1108 */' + css + '\n' + s.slice(i);
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
