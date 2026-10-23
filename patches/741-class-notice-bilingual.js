// 741: (Misty) class notice lesson lines in English + Chinese so every parent reads exactly what they paid, got free, carried over and in total.
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const rep = (a, b) => { if (s.split(a).length !== 2) { console.error('not unique: ' + a.slice(0, 90)); process.exit(1); } s = s.replace(a, b); };
rep("'\\n🎫 Package: ' + (f > 0 && f < u ? fm(u - f) + ' units + ' + fm(f) + ' free = ' : '') + fm(u) + (u === 1 ? ' unit' : ' units') +",
    "'\\n🎫 Package 课程包: ' + (f > 0 && f < u ? fm(u - f) + ' paid 购买 + ' + fm(f) + ' free 赠送 = ' : '') + fm(u) + (u === 1 ? ' unit' : ' units') +");
rep("(c ? '\\n➕ Carried over: ' + fm(c) + (c === 1 ? ' unit' : ' units') : '') +", "(c ? '\\n➕ Carried over 上期结转: ' + fm(c) + (c === 1 ? ' unit' : ' units') : '') +");
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
