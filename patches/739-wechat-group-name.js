// 739: (Misty) WeChat group name standard 一杯英语 Amy (ST-2026-021): shown when a reminder is copied, and on student cards with Copy.
const fs = require('fs'), path = require('path'), file = process.argv[2];
const inc = fs.readFileSync(path.join(__dirname, '739-wechat-group-name.inc.txt'), 'utf8');
let s = fs.readFileSync(file, 'utf8');
const rep = (a, b) => { if (s.split(a).length !== 2) { console.error('not unique: ' + a.slice(0, 90)); process.exit(1); } s = s.replace(a, b); };
rep("const renRow = x => { const r = x.r, i = TDC.push(x.rem) - 1,", "const renRow = x => { const r = x.r, i = TDC.push(x.rem) - 1, _gn = ((window.TDN = window.TDN || [])[i] = [r[0], r[1]]),");
const i = s.lastIndexOf('</body>'); if (i < 0) { console.error('no body'); process.exit(1); }
s = s.slice(0, i) + inc + '\n' + s.slice(i);
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
