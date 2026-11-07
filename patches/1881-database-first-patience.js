// 1881: (Misty 7 Nov 22:27 "let us do all now" · build 1: the slow management screens)
//   Renewals, Visit coverage, Performance, the class lists, My visits, Active, the time-in screens already read the DATABASE first,
//   but gave up after 8 s and then asked Google (20–40 s when Google was busy, as on 7 Nov 21:45). Now the database gets 15 s:
//   it normally answers in under 1 s, so Google is only asked when the database is really down.
//   The live pulse's background Google check (for actions only Google sees) runs every 15 minutes instead of 5 (less Google load).
const fs = require('fs'), file = process.argv[2]; let s = fs.readFileSync(file, 'utf8');
const a = "const ac = window.AbortController ? new AbortController() : null, tid = ac ? setTimeout(() => ac.abort(), 8000) : 0;";
const n = s.split(a).length - 1; if (n !== 8) throw new Error('timeouts: ' + n);
s = s.split(a).join("const ac = window.AbortController ? new AbortController() : null, tid = ac ? setTimeout(() => ac.abort(), 15000) : 0;   /* 1881 */");
const b = "const wantG = Date.now() - gAt > 5 * 6e4;";
if (s.split(b).length !== 2) throw new Error('pulse');
s = s.replace(b, "const wantG = Date.now() - gAt > 15 * 6e4;   /* 1881 */");
const v = s.match(/const COE_V = (\d+);/); if (!v) throw new Error('COE_V'); s = s.replace(v[0], 'const COE_V = ' + (+v[1] + 1) + ';');
fs.writeFileSync(file, s); console.log('1881 applied · COE_V ' + (v ? +v[1] + 1 : '?'));
