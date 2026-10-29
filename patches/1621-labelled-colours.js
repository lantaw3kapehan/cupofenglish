// 1621: design system · step 2: one meaning per colour (server/DESIGN-SYSTEM-2026-10-29.md › Colour meanings).
//   red = a problem, late, missed or needs action now · amber = waiting or to check · green = done / OK
//   teal = brand / neutral info / selected · purple = management. Every status chip keeps its words (and the 1101 ✓ ! ◷ mark).
// Fixed (colour only, same words, same clicks):
// · "Trial" chip was red on teacher class rows, teacher trial lists and the Students database list → teal (a trial is not a problem;
//   management rows already showed it teal).
// · Teacher class row "Cancelled" was grey while management showed it red → red everywhere.
// · Notices & requests: "Private · management only" was red → purple (management); "From the teacher" was red → teal info.
// · QA results: the chip colour now follows the words — Exceeds / Meets Standard green, Developing amber, Needs improvement /
//   Does not meet red (was by score band, so the same "Meets Standards" showed green on one teacher and blue on another).
//   Performance counts: Meets green (was blue), Developing amber (was red).
// · Performance domain scores: 4–5 green, 3 amber (was red), 1–2 red.
// · To fix (Monitor / teacher Growth): every kind of miss (no I'm in, late time-in, no note, video late, no homework) is red
//   (was red / amber / purple / blue / teal by kind — the words already say which kind).
// · Teacher "Needs your action": "Unread · needs your acknowledgement" was blue → amber (waiting for you), like "Read · not
//   acknowledged yet".
// · Students list "lessons left": a soon-to-renew count had a red background with amber text (two meanings at once) → amber.
// · Monitor activity tags: sentence case, neutral (were all-caps; they are labels, not statuses).
const fs = require('fs'), lib = require('../tools/lib.js'), file = process.argv[2];
// anchors that appear more than once: replace all, with the exact count checked first
let s = fs.readFileSync(file, 'utf8');
for (const [a, b, n] of [
  ['chip coral">Trial</span>', 'chip teal">Trial</span>', 3],
  ["e.pct>=80?'green':e.pct>=70?'teal':'coral'", "/^(Exceeds|Meets)/i.test(e.decision)?'green':/^Developing/i.test(e.decision)?'amber':'red'", 3],
]) { const c = s.split(a).length - 1; if (c !== n) { console.error('Expected ' + n + ' matches, found ' + c + ' for: ' + a); process.exit(1); } s = s.split(a).join(b); }
fs.writeFileSync(file, s);
const CSS = `<style id="ds1621">/* 1621 · colour meanings (server/DESIGN-SYSTEM-2026-10-29.md) */
:is(#app,#sheet,body>[id$="M"]) .chip.mgmt:not(#z1101):not(#y1101){background:var(--coe-mgmt-bg)!important;color:var(--coe-mgmt-fg)!important}
#app .mo-it .kd{text-transform:none!important;letter-spacing:0!important;font-weight:600!important;background:var(--coe-neutral-bg)!important;color:var(--coe-neutral-fg)!important}
.pf-doms i.hi{background:var(--coe-ok-bg)!important;color:var(--coe-ok-fg)!important}
.pf-doms i.mid{background:var(--coe-warn-bg)!important;color:var(--coe-warn-fg)!important}
.pf-doms i.lo{background:var(--coe-bad-bg)!important;color:var(--coe-bad-fg)!important}
:is(#app,#sheet,body>[id$="M"]) .sa-l.soon:not(.now):not(#z1101):not(#y1101):not(#x1621){background:var(--coe-warn-bg)!important;color:var(--coe-warn-fg)!important}
</style>`;
lib(file, [
  ["'<span class=\"chip coral\">Trial '+", "'<span class=\"chip teal\">Trial '+"],
  ["'<span class=\"chip\">Cancelled</span>'", "'<span class=\"chip red\">Cancelled</span>'"],
  ["'<span class=\"chip coral\">' + (r.to === 'President' ? 'Private · management only' : 'From the teacher') + '</span>'",
   "'<span class=\"chip ' + (r.to === 'President' ? 'mgmt' : 'teal') + '\">' + (r.to === 'President' ? 'Private · management only' : 'From the teacher') + '</span>'"],
  ["chip teal\">Meets ${cnt('Meets')}</span><span class=\"chip coral\">Developing", "chip green\">Meets ${cnt('Meets')}</span><span class=\"chip amber\">Developing"],
  ["const KC = t => /I.m in|time-in/i.test(t) ? (/Late/i.test(t) ? ['#B07A10', '#FCF1DC'] : ['#C0563F', '#FDF1EE']) : /note/i.test(t) ? ['#6C5FC7', '#F2F0FB'] : /video/i.test(t) ? ['#3B82B5', '#EEF4FA'] : /homework/i.test(t) ? ['#00808A', '#E8F6F7'] : ['#55526E', '#F1F0F6'];",
   "const KC = t => /I.m in|time-in|note|video|homework|late|miss|no /i.test(t) ? ['#B42318', '#FDECEA'] : ['#4C4868', '#F1F0F6'];   /* 1621: every miss = red (the words say which kind) */"],
  ["#v-today .q1106 .qr .st.un{background:#E8F1FB;color:#1D5FA8}", "#v-today .q1106 .qr .st.un{background:var(--coe-warn-bg);color:var(--coe-warn-fg)}"],
  ['<script>/* 1111 · finish screens before they are painted (no flicker) */', CSS + '<script>/* 1111 · finish screens before they are painted (no flicker) */'],
]);
