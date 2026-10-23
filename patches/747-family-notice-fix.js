// 747: 746 looked for the class notice at window.CN, but it is a page variable (CN) — the family part never ran. Fixed.
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const a = s.indexOf('/* 23 Oct · 746 ·'), b = s.indexOf('</script>', a);
if (a < 0 || b < 0) { console.error('746 not found'); process.exit(1); }
const blk = s.slice(a, b), fixed = blk.replace(/window\.CN\b/g, '(typeof CN !== "undefined" ? CN : null)').replace(/\bCN\.fam = /, 'CN.fam = ');
if (fixed === blk) { console.error('nothing changed'); process.exit(1); }
s = s.slice(0, a) + fixed + s.slice(b);
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
