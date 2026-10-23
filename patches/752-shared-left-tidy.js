// 752: tidy 751 (declare its variables properly).
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const rep = (a, b) => { if (s.split(a).length !== 2) { console.error('not unique: ' + a.slice(0, 90)); process.exit(1); } s = s.replace(a, b); };
rep("const C = {}; AT.cols.forEach((c, i) => C[c] = i), me = up(STU.code), f = window.wxFam ? wxFam(me) : null; if(!f) return r;",
    "const C = {}; AT.cols.forEach((c, i) => C[c] = i); const me = up(STU.code), f = window.wxFam ? wxFam(me) : null; if(!f) return r;");
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
