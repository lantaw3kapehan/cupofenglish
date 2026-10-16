// 16 Oct · Books notice: "protects the institution and you" (was "the school").
const fs = require('fs'), file = process.argv[2], s = fs.readFileSync(file, 'utf8');
const a = s.indexOf('/* 16 Oct · 248 · Books: for CupOfEnglish classes only'), z = s.indexOf('</script>', a);
if (a < 0 || z < 0) { console.error('248 block not found'); process.exit(1); }
const blk = s.slice(a, z); if (blk.split('protects the school and you').length !== 3) { console.error('expected 2 in 248'); process.exit(1); }
require('../tools/lib.js')(file, [[blk, blk.split('protects the school and you').join('protects the institution and you')]]);
