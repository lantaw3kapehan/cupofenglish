// 1789: (Misty, 6 Nov 10:03) Report "Return to teacher" sent with no report key.
// Celine returned a report twice on 5 Nov (13:26, 14:01). Both saves went out with key "" and stayed "busy":
// the database had no report to match, Google never finished, but the app showed "Returned".
// Cause: reports opened from the "Just in" list (feedback arrived, no report file yet) were built with key m.key || ''.
// Fix: build the key the same way the database does — CODE||TEACHER (upper case)||MONTH (237/237 keys follow it) —
//      and never send a Return or Sent save without a key; show a clear message instead.
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
function rep(a, b, n){ const c = s.split(a).length - 1; if(c !== (n || 1)) throw new Error('1789: expected ' + (n || 1) + ' match(es), found ' + c + ' for: ' + a.slice(0, 80)); s = s.split(a).join(b); }

// 1. "Just in" reports get their real key (both copies of rpAppOpen)
rep("RPD = { report: { key: m.key || '', code: m.code,",
    "RPD = { report: { key: m.key || rpKey1789(m.code, m.teacher, RP.month), code: m.code,", 2);

// 2. Return: refuse to send without a key
rep("const x = RPD.report, note = $('rpNote').value.trim(); if(note.length < 5) return toast('Write what to fix');",
    "const x = RPD.report, note = $('rpNote').value.trim(); if(note.length < 5) return toast('Write what to fix');\n" +
    "if(!x.key) x.key = rpKey1789(x.code, x.teacher, x.month); if(!x.key) return toast('This report could not be found. Close it, refresh Reports and try again.');");

// 3. Mark as sent: same guard
rep("const x = RPD.report, prev = { status: x.status, at: x.at, by: x.by };",
    "const x = RPD.report, prev = { status: x.status, at: x.at, by: x.by };\n" +
    "if(!x.key) x.key = rpKey1789(x.code, x.teacher, x.month); if(!x.key) return toast('This report could not be found. Close it, refresh Reports and try again.');");

// helper (global, defined before any use at click time)
const i = s.lastIndexOf('</body>');
s = s.slice(0, i) + "<script>/* 1789 */function rpKey1789(code, teacher, month){ code = String(code || '').trim().toUpperCase(); teacher = String(teacher || '').trim().toUpperCase(); month = String(month || '').trim();\n" +
  "return (/^ST-\\d{4}-\\d{3}$/.test(code) && teacher && /^\\d{4}-\\d{2}$/.test(month)) ? code + '||' + teacher + '||' + month : ''; }</script>\n" + s.slice(i);
fs.writeFileSync(file, s);
console.log('1789 applied');
