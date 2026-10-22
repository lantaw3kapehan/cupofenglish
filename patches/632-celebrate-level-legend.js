// 632: level column short (A1 Beginner / 欧标A1 入门级) + one explaining line under the row (A1 is the level of Cambridge YLE Movers. / 欧标A1 相当于剑桥少儿英语二级水平。); a level in the book field is not shown as a book.
require('../tools/lib.js')(process.argv[2], [
[
"base.cur = bk.length ? bookName(bk[bk.length - 1]) : String(s.book || '').split(/[,;]/)[0].trim();",
"base.cur = bk.length ? bookName(bk[bk.length - 1]) : (b0 => cefrOf(b0) && b0.replace(/[\\s-]/g, '').length <= 6 ? '' : b0)(String(s.book || '').split(/[,;]/)[0].trim());"
],
[
"  const cefrOf = v =>",
"  const LVX = { 'PRE-A1': ['Cambridge YLE Starters', '剑桥少儿英语一级'], A1: ['Cambridge YLE Movers', '剑桥少儿英语二级'], A2: ['Cambridge YLE Flyers and KET', '剑桥少儿英语三级和KET'], B1: ['Cambridge PET', '剑桥PET'], B2: ['Cambridge FCE', '剑桥FCE'], C1: ['Cambridge CAE', '剑桥CAE'], C2: ['Cambridge CPE', '剑桥CPE'] };\n  const cefrOf = v =>"
],
[
"cefrOf(x.cefr) ? ['English level · 英语水平', lvEn(cefrOf(x.cefr)), lvZh(cefrOf(x.cefr))] : null;",
"cefrOf(x.cefr) ? ['English level · 英语水平', (l => l + ' ' + (LVN[l] ? LVN[l][0] : ''))(cefrOf(x.cefr)), (l => '欧标' + l + ' ' + (LVN[l] ? LVN[l][1] : ''))(cefrOf(x.cefr))] : null;"
],
[
"(LVN[x.from] ? LVN[x.from][1] : x.from) + ' → ' + (LVN[x.to] ? LVN[x.to][1] + '（' + LVN[x.to][3] + '）' : x.to)]",
"(LVN[x.from] ? LVN[x.from][1] : x.from) + ' → ' + (LVN[x.to] ? LVN[x.to][1] : x.to)]"
],
[
"LS.forEach((L, k) => { col(CX + cw * k + cw / 2, L, cw - 24); if(k){ c.fillStyle = '#EEF0F4'; c.fillRect(CX + cw * k - 1, 640, 2, 124); } });",
"LS.forEach((L, k) => { col(CX + cw * k + cw / 2, L, cw - 24); if(k){ c.fillStyle = '#EEF0F4'; c.fillRect(CX + cw * k - 1, 640, 2, 124); } });\n    { const l = x.kind === 'level' ? x.to : x.kind !== 'bday' ? cefrOf(x.cefr) : ''; if(l && LVX[l]){ c.fillStyle = MUTE; fit(l + ' is the level of ' + LVX[l][0] + '.', 18, F, IW); c.fillText(l + ' is the level of ' + LVX[l][0] + '.', MX, 790); fit('欧标' + l + ' 相当于' + LVX[l][1] + '水平。', 18, F, IW); c.fillText('欧标' + l + ' 相当于' + LVX[l][1] + '水平。', MX, 814); }\n      else if(x.kind !== 'bday'){} }"
],
[
"let wy = 812; wrapB(WI[0], IW - 60)",
"let wy = (x.kind !== 'bday' && (x.kind === 'level' || cefrOf(x.cefr))) ? 862 : 812; wrapB(WI[0], IW - 60)"
]
]);
