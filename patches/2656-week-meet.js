// 2656 (Misty 21:34 / 21:41 "on SCHEDULE teachers still can't add a MEETING ID unless the class is today · raised before")
//   Cause: the teacher's Schedule opens on the week calendar (2201). Its class blocks could not be tapped and had no Meeting ID link;
//   the "+ Meeting ID" links of 2238 / 2289 are in the list under it, which the calendar hides (only the month view's day panel had them).
//   Now: every upcoming class block in the week calendar opens the Meeting ID sheet (same save as before: all upcoming classes with
//   that student); a class with no ID yet carries a small orange "+ ID" mark. Teachers only (management unchanged).
const f = "return '<div class=\"c01e ' + st + '\" style=\"top:' + top + 'px;height:' + ht + 'px;--c:' + cc + ';--t:' + tint(cc) + '\" title=\"'";
const r = "const ok56 = !(typeof D !== 'undefined' && D && D.mgr) && e.code && !e.cancelled && new Date(e.end || e.start) > now && typeof window.m38Sheet === 'function', mt56 = e.meet || (E0.find(x => x.code === e.code && x.meet) || {}).meet;   /* 2656 */\n        return '<div class=\"c01e ' + st + (ok56 ? ' c56' : '') + '\"' + (ok56 ? ' role=\"button\" tabindex=\"0\" onclick=\"m38Sheet(\\'' + E(e.code) + '\\')\"' : '') + ' style=\"top:' + top + 'px;height:' + ht + 'px;--c:' + cc + ';--t:' + tint(cc) + '\" title=\"' + (ok56 ? (mt56 ? 'Meeting ID ' + E(mt56) + ' · tap to edit · ' : 'No meeting ID · tap to add · ') : '') + ''";
const f2 = "+ (ht > 30 ? '<small>' + E(tm(e.start) + (e.book ? ' · ' + e.book : '')) + '</small>' : '') + '</div>'; }).join('');";
const r2 = "+ (ht > 30 ? '<small>' + E(tm(e.start) + (e.book ? ' · ' + e.book : '')) + '</small>' : '') + (ok56 && !mt56 ? '<u class=\"id56\">+ ID</u>' : '') + '</div>'; }).join('');";
const file = process.argv[2], fs = require('fs');
require('../tools/lib.js')(file, [
  [f, r], [f2, r2],
]);
let h = fs.readFileSync(file, 'utf8'); if (!h.includes('id="s2656"')) { const i = h.indexOf('</head>'); h = h.slice(0, i) + '<style id="s2656">#v-tsched .c01e.c56{cursor:pointer}#v-tsched .c01e.c56:hover{filter:brightness(.97)}#v-tsched .c01e u.id56{position:absolute;right:3px;bottom:2px;text-decoration:none;font:700 10px/1.3 Inter,system-ui,sans-serif;color:#B5531F;background:#FCEFE6;border-radius:6px;padding:0 4px}</style>\n' + h.slice(i); fs.writeFileSync(file, h); }
