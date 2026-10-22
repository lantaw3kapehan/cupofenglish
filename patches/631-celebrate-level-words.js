// 631: CEFR in plain words for parents — level name + the Cambridge exam Chinese families know (e.g. A2 Elementary (Flyers / KET) · 欧标A2 初级（剑少三级 / KET）).
require('../tools/lib.js')(process.argv[2], [
[
"  const cefrOf = v =>",
"  /* plain words for parents: level name + the Cambridge exam Chinese families know (剑少 Starters/Movers/Flyers, KET, PET, FCE…) */\n  const LVN = { 'PRE-A1': ['Starter', '启蒙级', 'YLE Starters', '剑少一级'], A1: ['Beginner', '入门级', 'YLE Movers', '剑少二级'], A2: ['Elementary', '初级', 'Flyers / KET', '剑少三级 / KET'],\n    B1: ['Intermediate', '中级', 'PET', 'PET'], B2: ['Upper intermediate', '中高级', 'FCE', 'FCE'], C1: ['Advanced', '高级', 'CAE', 'CAE'], C2: ['Proficient', '精通级', 'CPE', 'CPE'] };\n  const lvEn = l => LVN[l] ? l + ' ' + LVN[l][0] + ' (' + LVN[l][2] + ')' : l, lvZh = l => LVN[l] ? '欧标' + l + ' ' + LVN[l][1] + '（' + LVN[l][3] + '）' : '欧标' + l;\n  const cefrOf = v =>"
],
[
"x.cefr ? ['English level · 英语水平', 'CEFR ' + x.cefr, '欧标 ' + x.cefr] : null;",
"cefrOf(x.cefr) ? ['English level · 英语水平', lvEn(cefrOf(x.cefr)), lvZh(cefrOf(x.cefr))] : null;"
],
[
"x.kind === 'level' ? ['Level up · 级别提升', x.from + ' → ' + x.to, '欧标 ' + x.from + ' → ' + x.to]",
"x.kind === 'level' ? ['Level up · 级别提升', x.from + ' → ' + x.to + ' ' + (LVN[x.to] ? LVN[x.to][0] : ''), (LVN[x.from] ? LVN[x.from][1] : x.from) + ' → ' + (LVN[x.to] ? LVN[x.to][1] + '（' + LVN[x.to][3] + '）' : x.to)]"
],
[
"Your English level has moved up from CEFR ${x.from} to ${x.to}. Your English is getting better and better.",
"Your English level has moved up from ${lvEn(x.from)} to ${lvEn(x.to)}. Your English is getting better and better."
],
[
"英语水平从欧标${x.from}提升到${x.to}，你的英语越来越棒了！",
"英语水平从${lvZh(x.from)}提升到${lvZh(x.to)}，你的英语越来越棒了！"
]
]);
