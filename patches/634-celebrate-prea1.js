// 634: show Pre-A1 (not PRE-A1) on Celebrate pictures and messages.
require('../tools/lib.js')(process.argv[2], [
[
"  const lvEn = l => LVN[l] ? l + ' ' +",
"  const LD = l => l === 'PRE-A1' ? 'Pre-A1' : l;\n  const lvEn = l => LVN[l] ? LD(l) + ' ' +"
],
[
"lvZh = l => LVN[l] ? '欧标' + l + ' ' + LVN[l][1] + '（' + LVN[l][3] + '）' : '欧标' + l;",
"lvZh = l => LVN[l] ? '欧标' + LD(l) + ' ' + LVN[l][1] + '（' + LVN[l][3] + '）' : '欧标' + LD(l);"
],
[
"(l => l + ' ' + (LVN[l] ? LVN[l][0] : ''))(cefrOf(x.cefr)), (l => '欧标' + l + ' ' + (LVN[l] ? LVN[l][1] : ''))(cefrOf(x.cefr))]",
"(l => LD(l) + ' ' + (LVN[l] ? LVN[l][0] : ''))(cefrOf(x.cefr)), (l => '欧标' + LD(l) + ' ' + (LVN[l] ? LVN[l][1] : ''))(cefrOf(x.cefr))]"
],
[
"fit(l + ' is the level of ' + LVX[l][0] + '.', 18, F, IW); c.fillText(l + ' is the level of ' + LVX[l][0] + '.', MX, 754); fit('欧标' + l + ' 相当于' + LVX[l][1] + '水平。', 18, F, IW); c.fillText('欧标' + l + ' 相当于' + LVX[l][1] + '水平。', MX, 778);",
"fit(LD(l) + ' is the level of ' + LVX[l][0] + '.', 18, F, IW); c.fillText(LD(l) + ' is the level of ' + LVX[l][0] + '.', MX, 754); fit('欧标' + LD(l) + ' 相当于' + LVX[l][1] + '水平。', 18, F, IW); c.fillText('欧标' + LD(l) + ' 相当于' + LVX[l][1] + '水平。', MX, 778);"
],
[
"['Level up · 级别提升', x.from + ' → ' + x.to + ' '",
"['Level up · 级别提升', LD(x.from) + ' → ' + LD(x.to) + ' '"
]
]);
