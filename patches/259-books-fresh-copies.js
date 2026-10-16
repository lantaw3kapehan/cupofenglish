// 16 Oct · book lists refreshed: the big PDFs now open their app copies (opens in Drive's viewer); lists re-checked every 30 min.
const fs = require('fs'), file = process.argv[2], s = fs.readFileSync(file, 'utf8');
const a = s.indexOf('/* 16 Oct · 244 · Course books, three places'), z = s.indexOf('</script>', a);
if (a < 0 || z < 0) { console.error('244 block not found'); process.exit(1); }
const blk = s.slice(a, z); let nb = blk;
const rep = (x, y, n) => { const c = nb.split(x).length - 1; if (c !== n) { console.error('expected ' + n + ', found ' + c + ': ' + x); process.exit(1); } nb = nb.split(x).join(y); };
rep("'coe.bk2.' + bkU()", "'coe.bk3.' + bkU()", 2);
rep("if(c && Date.now() - c.t < 6 * 36e5) return c.b;", "if(c && Date.now() - c.t < 30 * 6e4) return c.b;", 1);
require('../tools/lib.js')(file, [[blk, nb]]);
