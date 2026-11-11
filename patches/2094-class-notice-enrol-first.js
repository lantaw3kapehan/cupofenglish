// 2094 (11 Nov 20:34, Misty: Anna ST-2026-137 · Class notice said "not in Packages yet · add the package first" with no way forward).
//   The payment was never saved in the app (no Enrolled · paid, no SALES row). The notice now says that in plain words and opens
//   Enrolled · paid for that student in one tap (name and teacher from her booked classes).
const lib = require("../tools/lib.js"), file = process.argv[2];
lib(file, [["if(!pk) return openSheet('<h1>Class notice</h1><div class=\"empty\">' + esc(code) + ' is not in Packages yet · add the package first, then try again.</div>');",
 "if(!pk){ const c0 = (Array.isArray(L) ? L : []).find(c => c && !c.cancelled) || {}, nm0 = String(c0.student || '').replace(/'/g, ''), tc0 = String(c0.teacher || '').replace(/'/g, '');   /* 2094 */\n" +
 "  return openSheet('<h1>Class notice</h1><div class=\"card\" style=\"margin-top:10px;background:#FFF8E6;border-color:#F3D48B\"><b>' + esc(nm0 || code) + ' (' + esc(code) + ') has no package saved yet.</b><div class=\"small\" style=\"margin-top:4px\">The payment is not in the app yet. Save it with Enrolled · paid, then open the class notice again.</div></div>' +\n" +
 "    (typeof enSheet === 'function' ? '<button class=\"btn teal block\" style=\"margin-top:14px\" onclick=\"enSheet(\\'' + esc(code) + '\\',\\'' + esc(nm0) + '\\',\\'' + esc(tc0) + '\\')\">Enrolled · paid for ' + esc(nm0 || code) + '</button>' : '')); }"]]);
