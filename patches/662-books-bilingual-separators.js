// 662: (Misty) bilingual text uses the standard " / " (English / 中文), not the middle dot; the picture shows the student and the book
// title on their own lines. Applies to the Books to buy screen and picture (656).
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const G = [['Books to buy · 教材购买', 'Books to buy / 教材购买', 2], ['Student Book · 学生用书', 'Student Book / 学生用书', 3], ['Workbook · 练习册', 'Workbook / 练习册', 2],
  ['淘宝搜索 · Search on Taobao', '淘宝搜索 / Search on Taobao', 1], ['也可用「拍立淘」拍封面搜索 · or photo-search the cover', '也可用「拍立淘」拍封面搜索 / Or photo-search the cover', 1],
  ['请认准封面和版本 · Please check the cover and the edition', '请认准封面和版本 / Please check the cover and the edition', 1], ['Taobao search words · 淘宝搜索', 'Taobao search words / 淘宝搜索', 1]];
G.push(['Books to buy / 教材购买', 'Course books / 课程教材', 2], ['Books to buy · all books', 'Course books · all books', 1]);   // 662 · Misty: "Books to buy" sounds forced · neutral title
for (const [a, b, n] of G) { const k = s.split(a).length - 1; if (k !== n) { console.error('Expected ' + n + ', found ' + k + ' for: ' + a); process.exit(1); } s = s.split(a).join(b); }
s = s.split('Books to buy').join('Course books');
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, [
[
"    c.fillStyle = MUTE; c.font = '400 30px ' + F; const who = (CUR.en ? 'For ' + CUR.en + (CUR.cn ? ' ' + CUR.cn : '') + ' · ' : '') + (r.title || ''); let w2 = who; while(c.measureText(w2).width > W - 140 && w2.length > 10) w2 = w2.slice(0, -2); c.fillText(w2 === who ? who : w2 + '…', W / 2, 272);",
"    const fit = (t, f, w) => { c.font = f; let x = t; while(c.measureText(x).width > w && x.length > 6) x = x.slice(0, -1); return x === t ? t : x + '…'; };\n    if(CUR.en){ c.fillStyle = MUTE; c.fillText(fit('For ' + CUR.en + (CUR.cn ? ' ' + CUR.cn : ''), '400 28px ' + F, W - 140), W / 2, 266); }\n    c.fillStyle = NAVY; c.fillText(fit(r.title || '', '700 32px ' + F, W - 140), W / 2, CUR.en ? 310 : 280);"
],
[
"const top = 310, put",
"const top = 340, put"
],
[
"c.fillText('请认准封面和版本 / Please check the cover and the edition', W / 2, y);",
"c.fillText('请认准封面和版本 / Please check the cover and the edition', W / 2, y); c.fillStyle = MUTE; c.font = '400 24px ' + F; c.fillText('纸质版或电子版均可 / Print or digital edition, whichever suits you', W / 2, y + 42);"
],
[
"const H = 360 + CH + 400;",
"const H = 390 + CH + 440;"
]
]);
