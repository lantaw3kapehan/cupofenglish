// 628: Celebrate picture · no label pill (the title already says it), logo centred, signature clear of the bottom line, Chinese birthday date with the weekday.
require('../tools/lib.js')(process.argv[2], [
[
"if(logo){ const lw = 230, lh = lw * logo.height / logo.width; c.drawImage(logo, CX, 46, lw, lh); }\n    const PL = x.kind === 'bday' ? 'Happy Birthday · 生日快乐' : x.kind === 'book' ? 'New book · 新教材' : 'Milestone · 里程碑';\n    c.font = '700 20px ' + F; const pw = c.measureText(PL).width + 40; rr(CW - CX - pw, 60, pw, 44, 22); c.fillStyle = K[3]; c.fill(); c.fillStyle = K[2]; c.textBaseline = 'middle'; c.fillText(PL, CW - CX - pw + 20, 83); c.textBaseline = 'alphabetic';",
"if(logo){ const lw = 250, lh = lw * logo.height / logo.width; c.drawImage(logo, MX - lw / 2, 44 + (90 - lh) / 2, lw, lh); }"
],
[
"(x.when.getMonth() + 1) + '月' + x.when.getDate() + '日'] : x.cefr ?",
"(x.when.getMonth() + 1) + '月' + x.when.getDate() + '日（周' + '日一二三四五六'[x.when.getDay()] + '）'] : x.cefr ?"
],
[
"let wy = 828; wrap(WI[0], IW - 60).forEach(l => { c.fillText(l, MX, wy); wy += 38; });",
"let wy = 812; wrap(WI[0], IW - 60).forEach(l => { c.fillText(l, MX, wy); wy += 36; });"
],
[
"c.fillText('A cup of cheers from your teachers at CupOfEnglish!', MX, wy + 58); c.fillText('一杯英语全体老师为你喝彩！', MX, wy + 90);",
"c.fillText('A cup of cheers from your teachers at CupOfEnglish!', MX, wy + 52); c.fillText('一杯英语全体老师为你喝彩！', MX, wy + 82);"
],
[
"c.fillStyle = '#EEF0F4'; c.fillRect(CX, 990, IW, 2);\n    if(tag){ const tw = 180, th = tw * tag.height / tag.width; c.drawImage(tag, MX - tw / 2, 1000 + (58 - th) / 2, tw, th); }",
"c.fillStyle = '#EEF0F4'; c.fillRect(CX, 994, IW, 2);\n    if(tag){ const tw = 170, th = tw * tag.height / tag.width; c.drawImage(tag, MX - tw / 2, 1002 + (52 - th) / 2, tw, th); }"
]
]);
