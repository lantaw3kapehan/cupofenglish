// Checks that every inline <script> in app.html is valid JavaScript, then writes version.txt.
const fs = require('fs'), vm = require('vm');
const file = process.argv[2], s = fs.readFileSync(file, 'utf8');
if (s.indexOf('COE_API') < 0 || s.length < 200000) { console.error('app.html looks incomplete'); process.exit(1); }
const re = /<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g; let m, n = 0, bad = 0;
while ((m = re.exec(s))) { n++; try { new vm.Script(m[1], { filename: 'script-' + n + '.js' }); } catch (e) { bad++; console.error('Script ' + n + ': ' + e.message); } }
if (bad) process.exit(1);
// 1540 · the renewal rules (server/RULES-renewals.md) are tested on every release: a change that breaks one fails here
Promise.resolve(require('./renewal-suite.js')(file)).then((failed) => {   // 1546: the suite also runs async portal-hold cases
  if (failed) { console.error('Renewal test suite failed · see above'); process.exit(1); }
  if (require('./test-profit-label.js')(file)) { console.error('Profit label checks failed · see above'); process.exit(1); }   // 1995
  return Promise.resolve(require('./test-weekly-same-id.js')(file)).then((wk) => {   // 2052: an "I'm in" only on its own day (10 Nov, Jimmy)
    if (wk) { console.error('Weekly class check failed · an "I\'m in" shows on another day · see above'); process.exit(1); }
    if (require('./test-no-repeats.js')(file)) { console.error('No-repeats check failed · a removed repeat came back · see above'); process.exit(1); }   // 2055
    return require('./test-arrangers.js')(file);   // 2025: no screen may keep rearranging itself (9 Nov freeze)
  });
}).then((loop) => {
  if (loop) { console.error('Loop check failed · a screen keeps rearranging itself · see above'); process.exit(1); }
  const v = (s.match(/const COE_V = (\d+);/) || [])[1];
  if (!v) { console.error('COE_V not found'); process.exit(1); }
  fs.writeFileSync('version.txt', v + '\n');
  console.log('OK · ' + n + ' scripts checked · version ' + v);
}, (e) => { console.error('Renewal test suite crashed: ' + (e && e.message)); process.exit(1); });
