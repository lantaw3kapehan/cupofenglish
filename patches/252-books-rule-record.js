// 16 Oct · books rule v2: consequence line, each "I understand" saved (who, when, version), management sees who agreed.
const fs = require('fs'), path = require('path'), file = process.argv[2], s = fs.readFileSync(file, 'utf8');
const inc = fs.readFileSync(path.join(__dirname, '252-books-rule-record.inc'), 'utf8');
const a = s.indexOf('/* 16 Oct · 248 · Books: for CupOfEnglish classes only'), z = s.indexOf('</script>', a);
if (a < 0 || z < 0) { console.error('248 block not found'); process.exit(1); }
const blk = s.slice(a, z); let nb = blk;
const rep = (x, y, n) => { const c = nb.split(x).length - 1; if (c !== n) { console.error('expected ' + n + ', found ' + c + ': ' + x); process.exit(1); } nb = nb.split(x).join(y); };
rep("other classes, private tutoring or personal use.';", "other classes, private tutoring or personal use. Sharing or using them outside CupOfEnglish breaks your teacher agreement, and your access to the books will be removed.';", 1);
rep("store('get', 'coe.bkok.' +", "store('get', 'coe.bkok2.' +", 1);
rep("store('set', 'coe.bkok.' +", "(window.bkRec && bkRec()), store('set', 'coe.bkok2.' +", 2);
require('../tools/lib.js')(file, [
[blk, nb],
["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"],
]);
