// 668: (Misty) office Time in button in the header (pulses until timed in, then "In 09:02" → time out).
const fs = require('fs'), path = require('path'), file = process.argv[2];
const inc = fs.readFileSync(path.join(__dirname, '668-timein-header.inc.txt'), 'utf8');
let s = fs.readFileSync(file, 'utf8'); const i = s.lastIndexOf('</body>');
if(i < 0 || s.indexOf('668 · (Misty) Office time-in') >= 0){ console.error('cannot insert'); process.exit(1); }
fs.writeFileSync(file, s.slice(0, i) + inc + '\n' + s.slice(i));
require('../tools/lib.js')(file, []);
