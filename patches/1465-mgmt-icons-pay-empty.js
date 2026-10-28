// 1465 · President QA 28 Oct (design rule: professional line icons in the app; emojis only as people's own words in chat).
//   Management screens still drew emojis as app icons: Monitor › Time-ins place chip "📍 town", Schedule reminder chips, cards and
//   buttons "🔔 Remind · copy message", To do "Celebrate 🎉", Trials "Enrolled 🎉". They now use the same line icons as 1411
//   (bell, map pin) or none. Messages copied to parents keep their wording; teacher screens are left to the teacher QA.
//   Finance › Payroll: the filters said "Nobody here" when empty. Now "Everyone is paid for September 2027" (To pay),
//   "No one is marked paid yet for …" (Paid), "No pay questions from teachers" (Questions) — so the empty list reads as a status.
//   Display only.
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const ALL = [[")\">🔔 Remind · copy message</button>", ")\">${window.li1465 ? li1465('bell') : ''}Remind · copy message</button>", 3]];
for (const [a, b, n] of ALL) { const k = s.split(a).length - 1; if (k !== n) { console.error('1465: expected ' + n + ', found ' + k + ' for ' + a); process.exit(1); } s = s.split(a).join(b); }
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, [
  ["title=\"${esc(x.place)}\">📍 ${esc(town || p)}", "title=\"${esc(x.place)}\">${window.li1465 ? li1465('place') : ''}${esc(town || p)}"],
  ["<span class=\"chip teal\">🔔 ${st === '10m'", "<span class=\"chip teal\">${window.li1465 ? li1465('bell') : ''}${st === '10m'"],
  ["margin-top:10px\">🔔 Checking which reminders were already sent…</div>", "margin-top:10px\">' + (window.li1465 ? li1465('bell') : '') + 'Checking which reminders were already sent…</div>"],
  ["margin-top:10px\">🔔 Reminders: ${sent", "margin-top:10px\">${window.li1465 ? li1465('bell') : ''}Reminders: ${sent"],
  ["<b>🔔 Reminders due · ${due.length}</b>", "<b>${window.li1465 ? li1465('bell') : ''}Reminders due · ${due.length}</b>"],
  ["<h2>Celebrate 🎉 <span", "<h2>Celebrate <span"],
  [": '') + ' 🎉' : fu ?", ": '') : fu ?"],
  ["'Nobody here'}</div>`;", "(PRF === 'topay' ? 'Everyone is paid for ' + esc(MO.payMonth || 'this month') : PRF === 'paid' ? 'No one is marked paid yet for ' + esc(MO.payMonth || 'this month') : PRF === 'q' ? 'No pay questions from teachers' : 'No teachers on this month’s payroll yet')}</div>`;   /* 1465 */"],
  ["\nconst API_URL = window.COE_API || '';\n",
   "\n/* 1465 · line icons for management app text (bell, map pin) — defined before the first screen is drawn */\n" +
   "window.li1465 = (function(){ var P = { bell: '<path d=\"M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9\"/><path d=\"M13.7 21a2 2 0 0 1-3.4 0\"/>', place: '<path d=\"M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z\"/><circle cx=\"12\" cy=\"9.5\" r=\"2.5\"/>' };\n" +
   "  return function(k){ return '<svg class=\"li1465\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\">' + (P[k] || '') + '</svg>'; }; })();\n" +
   "const API_URL = window.COE_API || '';\n"],
  ["</body>\n</html>",
   "<style id=\"css1465\">.li1465{display:inline-block;width:1.05em;height:1.05em;vertical-align:-.17em;flex:none;margin-right:.3em}</style>\n</body>\n</html>"],
]);
