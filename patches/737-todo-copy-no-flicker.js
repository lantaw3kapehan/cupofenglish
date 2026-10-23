// 737: (Misty) "Copy reminder" flickered in To do · Renewals. Each time the list redrew, the button first appeared plain, then a moment later got
// the class "tdp" — which is also the class of the month-pulse box (margin, padding, flex) — so it jumped and changed colour. Now the button
// is drawn with its final class right away, under its own name (tdgo), so nothing changes after it appears.
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const rep = (a, b) => { if (s.split(a).length !== 2) { console.error('not unique: ' + a.slice(0, 90)); process.exit(1); } s = s.replace(a, b); };
rep("<button class=\"btn ${x.lv==='now' || again ? 'teal' : 'ghost'} sm\" onclick=\"tdCopy(${i})\">", "<button class=\"btn ${x.lv==='now' || again ? 'teal' : 'ghost'} sm tdgo\" onclick=\"tdCopy(${i})\">");
rep("<button class=\"btn ${t.status === 'Ready' ? 'teal' : 'ghost'} sm\" onclick=\"tlOpen(${i})\">${t.status === 'Ready' ? 'Send' : 'Open'}</button>", "<button class=\"btn ${t.status === 'Ready' ? 'teal sm tdgo' : 'ghost sm'}\" onclick=\"tlOpen(${i})\">${t.status === 'Ready' ? 'Send' : 'Open'}</button>");
rep("#v-mtoday .tdb .btn.tdp{background:var(--cat)!important;color:#fff!important;border-color:var(--cat)!important}", "#v-mtoday .tdb .btn.tdgo{background:var(--cat)!important;color:#fff!important;border-color:var(--cat)!important}");
rep("if(b && !b.classList.contains('tdp')) b.classList.add('tdp');", "if(b && !b.classList.contains('tdgo')) b.classList.add('tdgo');");
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
