// Checks that every inline <script> in app.html is valid JavaScript, then writes version.txt.
const fs = require('fs'), vm = require('vm');
const file = process.argv[2], s = fs.readFileSync(file, 'utf8');
if (s.indexOf('COE_API') < 0 || s.length < 200000) { console.error('app.html looks incomplete'); process.exit(1); }
const re = /<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g; let m, n = 0, bad = 0;
while ((m = re.exec(s))) { n++; try { new vm.Script(m[1], { filename: 'script-' + n + '.js' }); } catch (e) { bad++; console.error('Script ' + n + ': ' + e.message); } }
if (bad) process.exit(1);
const v = (s.match(/const COE_V = (\d+);/) || [])[1];
if (!v) { console.error('COE_V not found'); process.exit(1); }
fs.writeFileSync('version.txt', v + '\n');
console.log('OK · ' + n + ' scripts checked · version ' + v);
