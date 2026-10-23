// 670: (Misty) Course Books picture — the child's name highlighted (teal pill, bold) so it feels made for them; more room so the
// footer tag no longer touches the "Print or digital" line.
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const rep = (a, b) => { const i = s.indexOf(a); if (i < 0 || s.indexOf(a, i + 1) > -1) { console.error('not unique: ' + a.slice(0, 90)); process.exit(1); } s = s.replace(a, b); };
rep("const top = CUR.en ? 352 : 316, H = top + CH + 470;", "const top = CUR.en ? 366 : 316, H = top + CH + 540;");
rep("    if(CUR.en){ c.fillStyle = MUTE; c.fillText(fit('For ' + CUR.en + (CUR.cn ? ' ' + CUR.cn : ''), '400 26px ' + F, W - 180), W / 2, 274); }\n    c.fillStyle = NAVY; c.fillText(fit(r.title || '', '700 32px ' + F, W - 180), W / 2, CUR.en ? 318 : 282);",
    "    if(CUR.en){ const nm = fit(CUR.en + (CUR.cn ? ' ' + CUR.cn : ''), '700 30px ' + F, W - 300); c.font = '400 26px ' + F; const fw = c.measureText('For ').width; c.font = '700 30px ' + F; const nw = c.measureText(nm).width;\n      const px = 22, tot = fw + nw + px * 2, x0 = (W - tot) / 2; rr(x0 + fw, 248, nw + px * 2, 48, 24); c.fillStyle = '#E3F4F2'; c.fill();\n      c.textAlign = 'left'; c.fillStyle = MUTE; c.font = '400 26px ' + F; c.fillText('For ', x0, 282); c.fillStyle = TEAL; c.font = '700 30px ' + F; c.fillText(nm, x0 + fw + px, 283); c.textAlign = 'center'; }\n    c.fillStyle = NAVY; c.fillText(fit(r.title || '', '700 32px ' + F, W - 180), W / 2, CUR.en ? 336 : 282);");
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
