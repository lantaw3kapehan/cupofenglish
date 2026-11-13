// 2182 (13 Nov · QA of 2180 with Celine's real rows): "on time" is only marked from 8 Nov 2026 (her contract late rule starts then; the
// October days at 13:00–14:23 were not judged and must not read "on time"); rest days (Wednesday, an empty day or DAYOFF) show "rest day"
// and "—" instead of "DAYOFF"; the 6-month summary counts only days with a real time-in (database).
const lib = require("../tools/lib.js"), file = process.argv[2];
lib(file, [
  ["    else if(isC && wd === 3) ch = '<span class=\"ch rest\">rest day</span>';", "    else if(isC && (wd === 3 || !/^\\d/.test(tin))) ch = '<span class=\"ch rest\">' + (/leave/i.test(tin) ? 'on leave' : 'rest day') + '</span>';"],
  ["    else if(tin && isC && /^\\d{1,2}:\\d{2}$/.test(tin)) ch = '<span class=\"ch ok\">on time</span>';", "    else if(tin && isC && x.day >= '2026-11-08' && /^\\d{1,2}:\\d{2}$/.test(tin)) ch = '<span class=\"ch ok\">on time</span>';"],
  ["'</td><td class=\"n\">' + E(tin || '—') + '</td>", "'</td><td class=\"n\">' + E(/^\\d/.test(tin) ? tin : '—') + '</td>"],
]);
