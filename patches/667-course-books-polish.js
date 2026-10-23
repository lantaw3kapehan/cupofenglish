// 667: (Misty) "the design here is okay, just refine or polish it" — back to the card design (undo 665's minimal layout), polished:
// even spacing, softer cover shadows with a hairline edge, roomier Taobao box, calmer edition note, footer tag evenly spaced.
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const A = "    const W = 1080, S = 2, B = '\"Fredoka One\",sans-serif'", Z = "    const blob = await new Promise(z => cv.toBlob(z, 'image/png')); if(PICB && PICB.url)";
const i = s.indexOf(A), j = s.indexOf(Z);
if (i < 0 || j < i || s.indexOf(A, i + 1) > -1) { console.error('drawing block not found once'); process.exit(1); }
const NEW = `    const W = 1080, S = 2, B = '"Fredoka One",sans-serif', F = 'Arvo,"PingFang SC","Microsoft YaHei",serif', NAVY = '#2B2253', TEAL = '#0E7C7B', MUTE = '#6B6880';
    const two = !!wb, CW = two ? 420 : 580, covH = i => Math.round(CW * i.height / i.width), CH = Math.min(two ? Math.max(covH(sb), covH(wb)) : covH(sb), two ? 580 : 780);
    const top = CUR.en ? 352 : 316, H = top + CH + 470; const cv = document.createElement('canvas'); cv.width = W * S; cv.height = H * S; const c = cv.getContext('2d'); c.scale(S, S);
    const rr = (x, y, w, h, q) => { c.beginPath(); c.moveTo(x + q, y); c.arcTo(x + w, y, x + w, y + h, q); c.arcTo(x + w, y + h, x, y + h, q); c.arcTo(x, y + h, x, y, q); c.arcTo(x, y, x + w, y, q); c.closePath(); };
    c.fillStyle = '#EEF2F6'; c.fillRect(0, 0, W, H); rr(30, 30, W - 60, H - 60, 40); c.fillStyle = '#fff'; c.fill(); c.textAlign = 'center';
    const fit = (t, f, w) => { c.font = f; let x = t; while(c.measureText(x).width > w && x.length > 6) x = x.slice(0, -1); return x === t ? t : x + '…'; };
    if(logo){ const lw = 220, lh = lw * logo.height / logo.width; c.drawImage(logo, (W - lw) / 2, 72, lw, lh); }
    c.fillStyle = NAVY; c.font = '400 50px ' + B; c.fillText('Course Books / 课程教材', W / 2, 226);
    if(CUR.en){ c.fillStyle = MUTE; c.fillText(fit('For ' + CUR.en + (CUR.cn ? ' ' + CUR.cn : ''), '400 26px ' + F, W - 180), W / 2, 274); }
    c.fillStyle = NAVY; c.fillText(fit(r.title || '', '700 32px ' + F, W - 180), W / 2, CUR.en ? 318 : 282);
    const put = (im, cx, lab) => { const h = Math.min(covH(im), CH), w = Math.round(h * im.width / im.height), x = cx - w / 2, y = top + (CH - h);
      c.save(); c.shadowColor = 'rgba(43,34,83,.16)'; c.shadowBlur = 20; c.shadowOffsetY = 6; c.fillStyle = '#fff'; c.fillRect(x, y, w, h); c.restore();
      c.drawImage(im, x, y, w, h); c.strokeStyle = 'rgba(43,34,83,.10)'; c.lineWidth = 1; c.strokeRect(x + .5, y + .5, w - 1, h - 1);
      c.fillStyle = NAVY; c.font = '700 26px ' + F; c.fillText(lab, cx, top + CH + 48); };
    if(two){ put(sb, W / 2 - 236, 'Student Book / 学生用书'); put(wb, W / 2 + 236, 'Workbook / 练习册'); } else put(sb, W / 2, 'Student Book / 学生用书');
    let y = top + CH + 92; rr(84, y, W - 168, 164, 26); c.fillStyle = '#EAF5F4'; c.fill();
    c.fillStyle = TEAL; c.font = '700 24px ' + F; c.fillText('淘宝搜索 / Search on Taobao', W / 2, y + 48);
    c.fillStyle = NAVY; c.fillText(fit(r.search_cn || r.title || '', '700 30px ' + F, W - 230), W / 2, y + 100);
    c.fillStyle = MUTE; c.font = '400 22px ' + F; c.fillText('也可用「拍立淘」拍封面搜索 / Or photo-search the cover', W / 2, y + 138);
    y += 222; c.fillStyle = '#9A4330'; c.font = '700 24px ' + F; c.fillText('请认准封面和版本 / Please check the cover and the edition', W / 2, y);
    c.fillStyle = MUTE; c.font = '400 22px ' + F; c.fillText('纸质版或电子版均可 / Print or digital edition, whichever suits you', W / 2, y + 40);
    if(tag){ const tw = 160, th = tw * tag.height / tag.width; c.drawImage(tag, W / 2 - tw / 2, H - 30 - 44 - th, tw, th); }
`;
s = s.slice(0, i) + NEW + s.slice(j); fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
