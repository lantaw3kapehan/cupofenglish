// 746: (Misty) siblings / shared packages — family WeChat group, and class notices with every child and their own schedule. See .inc.txt.
const fs = require('fs'), path = require('path'), file = process.argv[2];
const inc = fs.readFileSync(path.join(__dirname, '746-wechat-family.inc.txt'), 'utf8');
let s = fs.readFileSync(file, 'utf8');
const i = s.lastIndexOf('</body>'); if (i < 0 || s.indexOf('23 Oct · 746') > -1) { console.error('cannot insert'); process.exit(1); }
s = s.slice(0, i) + inc + '\n' + s.slice(i);
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
