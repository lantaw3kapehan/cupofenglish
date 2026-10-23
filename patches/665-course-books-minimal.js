// 665: (Misty) Course Books picture — minimal design with everything needed: white page, logo, title, child, book, both covers,
// Taobao search words + photo search, one short note (edition / print or digital). No grey frame, no coloured box, no footer tagline.
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const A = "    const W = 1080, S = 2, B = '\"Fredoka One\",sans-serif'", Z = "    const blob = await new Promise(z => cv.toBlob(z, 'image/png')); if(PICB && PICB.url)";
const i = s.indexOf(A), j = s.indexOf(Z);
if (i < 0 || j < i || s.indexOf(A, i + 1) > -1) { console.error('drawing block not found once'); process.exit(1); }
const NEW = `    const W = 1080, S = 2, B = '"Fredoka One",sans-serif', F = 'Arvo,"PingFang SC","Microsoft YaHei",serif', NAVY = '#2B2253', MUTE = '#7A7790', LINE = '#E9E7F0';
    const two = !!wb, CW = two ? 430 : 560, covH = i => Math.round(CW * i.height / i.width), CH = Math.min(two ? Math.max(covH(sb), covH(wb)) : covH(sb), two ? 560 : 740);
    const top = CUR.en ? 330 : 290, H = top + CH + 340; const cv = document.createElement('canvas'); cv.width = W * S; cv.height = H * S; const c = cv.getContext('2d'); c.scale(S, S);
    c.fillStyle = '#fff'; c.fillRect(0, 0, W, H); c.textAlign = 'center';
    const fit = (t, f, w) => { c.font = f; let x = t; while(c.measureText(x).width > w && x.length > 6) x = x.slice(0, -1); return x === t ? t : x + '…'; };
    if(logo){ const lw = 200, lh = lw * logo.height / logo.width; c.drawImage(logo, (W - lw) / 2, 64, lw, lh); }
    c.fillStyle = NAVY; c.font = '400 44px ' + B; c.fillText('Course Books / 课程教材', W / 2, 200);
    if(CUR.en){ c.fillStyle = MUTE; c.fillText(fit(CUR.en + (CUR.cn ? ' ' + CUR.cn : ''), '400 26px ' + F, W - 160), W / 2, 248); }
    c.fillStyle = NAVY; c.fillText(fit(r.title || '', '700 30px ' + F, W - 160), W / 2, CUR.en ? 292 : 252);
    const put = (im, cx, lab) => { const h = Math.min(covH(im), CH), w = Math.round(h * im.width / im.height); c.save(); c.shadowColor = 'rgba(43,34,83,.14)'; c.shadowBlur = 16; c.shadowOffsetY = 6; c.drawImage(im, cx - w / 2, top + (CH - h), w, h); c.restore();
      c.fillStyle = MUTE; c.font = '400 24px ' + F; c.fillText(lab, cx, top + CH + 40); };
    if(two){ put(sb, W / 2 - 240, 'Student Book / 学生用书'); put(wb, W / 2 + 240, 'Workbook / 练习册'); } else put(sb, W / 2, 'Student Book / 学生用书');
    let y = top + CH + 110; c.fillStyle = LINE; c.fillRect(160, y - 40, W - 320, 2);
    c.fillStyle = MUTE; c.font = '400 22px ' + F; c.fillText('淘宝搜索 / Taobao search', W / 2, y);
    c.fillStyle = NAVY; c.fillText(fit(r.search_cn || r.title || '', '700 28px ' + F, W - 180), W / 2, y + 44);
    c.fillStyle = MUTE; c.font = '400 21px ' + F; c.fillText('也可用「拍立淘」拍封面搜索 / Or photo-search the cover', W / 2, y + 82);
    c.fillText('请认准封面和版本，纸质版或电子版均可', W / 2, y + 140); c.fillText('Check the cover and edition. Print or digital is fine.', W / 2, y + 172);
`;
s = s.slice(0, i) + NEW + s.slice(j); fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
