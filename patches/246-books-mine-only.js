// 16 Oct · a teacher opens only the books of their own students (checked by the server); the library maps books ↔ students; calendar book colours.
const fs = require('fs'), path = require('path'), file = process.argv[2];
const inc = fs.readFileSync(path.join(__dirname, '246-books-mine-only.inc'), 'utf8');
const s = fs.readFileSync(file, 'utf8');
// the 244 block (its own copy of the book list code; 243 has an older copy with the same lines)
const a = s.indexOf('/* 16 Oct · 244 · Course books, three places'), z = s.indexOf('</script>', a);
if (a < 0 || z < 0) { console.error('244 block not found'); process.exit(1); }
const blk = s.slice(a, z);
let nb = blk;
const rep = (x, y) => { const n = nb.split(x).length - 1; if (n < 1) { console.error('not in 244: ' + x.slice(0, 80)); process.exit(1); } nb = nb.split(x).join(y); };
rep("const o = { b: r.book, t: Date.now() };", "const o = { b: r.book, t: Date.now(), locked: !!r.locked };");
rep("'coe.bk.' + k", "'coe.bk2.' + k");
rep("store('get', 'coe.bklib')", "store('get', 'coe.bklib2')");
rep("store('set', 'coe.bklib', JSON.stringify({ l: LIB, t: Date.now() }))", "store('set', 'coe.bklib2', JSON.stringify({ l: LIB, t: Date.now(), o: window._bkOthers || 0 }))");
rep("if(c && c.l){ LIB = c.l;", "if(c && c.l){ LIB = c.l; window._bkOthers = c.o || 0;");
rep("if(r && r.ok){ LIB = r.list || [];", "if(r && r.ok){ LIB = r.list || []; window._bkOthers = r.others || 0;");
rep("No book file for this code yet · management can add it in Drive › COURSEWARE.", "${(cached(k) || {}).locked ? 'This book opens when one of your students uses it.' : 'No book file for this code yet · management can add it in Drive › COURSEWARE.'}");
require('../tools/lib.js')(file, [
[blk, nb],
["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"],
]);
