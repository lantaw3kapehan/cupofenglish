// 16 Oct · books rule: asked once per teacher (any device); afterwards a slim one-line reminder only.
const fs = require('fs'), path = require('path'), file = process.argv[2], s = fs.readFileSync(file, 'utf8');
const inc = fs.readFileSync(path.join(__dirname, '254-books-rule-once.inc'), 'utf8');
const a = s.indexOf('/* 16 Oct · 248 · Books: for CupOfEnglish classes only'), z = s.indexOf('</script>', a);
if (a < 0 || z < 0) { console.error('248 block not found'); process.exit(1); }
const blk = s.slice(a, z); let nb = blk;
const rep = (x, y, n) => { const c = nb.split(x).length - 1; if (c !== n) { console.error('expected ' + n + ', found ' + c + ': ' + x); process.exit(1); } nb = nb.split(x).join(y); };
rep("window.bkRuleHtml = box;", "window.bkRuleHtml = box;\n  const slim = () => `<div class=\"bk-rule slim\">${ICO}<span>For CupOfEnglish classes only · not for sharing, other classes or personal use</span></div>`;\n  const rule = () => (D && !D.mgr && ok()) ? slim() : box();", 1);
rep("h.insertAdjacentHTML('afterend', box())", "h.insertAdjacentHTML('afterend', rule())", 1);
rep("createContextualFragment(box())", "createContextualFragment(rule())", 1);
require('../tools/lib.js')(file, [
[blk, nb],
["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"],
]);
