// CupOfEnglish screen change helper: exact find-and-replace on app.html.
// Every "find" text must appear exactly once, or nothing is changed and the run stops.
// Each change also raises the app version (COE_V) by 1 so phones pick it up.
const fs = require('fs');
module.exports = function (file, edits) {
  let s = fs.readFileSync(file, 'utf8');
  for (const [a, b] of edits) {
    const n = s.split(a).length - 1;
    if (n !== 1) { console.error('Expected 1 match, found ' + n + ' for: ' + a.slice(0, 120)); process.exit(1); }
    s = s.replace(a, () => b);
  }
  const m = s.match(/const COE_V = (\d+);/);
  if (!m) { console.error('COE_V not found'); process.exit(1); }
  s = s.replace(m[0], 'const COE_V = ' + (+m[1] + 1) + ';');
  fs.writeFileSync(file, s);
  console.log('Applied ' + edits.length + ' change(s) · COE_V ' + m[1] + ' → ' + (+m[1] + 1));
};
