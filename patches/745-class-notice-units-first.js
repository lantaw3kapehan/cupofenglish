// 745: (Misty) free lessons are sold as +3 / +8 UNITS — the breakdown now uses units (as on the receipt), classes in brackets.
//   🕒 Lessons 课时
//   Paid 购买 30 + Free 赠送 3 + Carried 结转 2
//   = 35 units（70 classes 节 × 25 min）
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const rep = (a, b) => { if (s.split(a).length !== 2) { console.error('not unique: ' + a.slice(0, 90)); process.exit(1); } s = s.replace(a, b); };
rep("const parts = ['Paid 购买 ' + fm((u - (f > 0 && f < u ? f : 0)) * 2)].concat(f > 0 && f < u ? ['Free 赠送 ' + fm(f * 2)] : []).concat(c > 0 ? ['Carried 结转 ' + fm(c * 2)] : []);",
    "const parts = ['Paid 购买 ' + fm(u - (f > 0 && f < u ? f : 0))].concat(f > 0 && f < u ? ['Free 赠送 ' + fm(f)] : []).concat(c > 0 ? ['Carried 结转 ' + fm(c)] : []);");
rep("+ fm(tot * 2) + ' classes 节 × 25 min（' + fm(tot) + (tot === 1 ? ' unit' : ' units') + '）' +",
    "+ fm(tot) + (tot === 1 ? ' unit' : ' units') + '（' + fm(tot * 2) + ' classes 节 × 25 min）' +");
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
