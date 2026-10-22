// 635: the level in plain words on parent pictures and messages — learning plan (kids: Cambridge level; adults: IELTS band), trial result message, Day 3 follow-up; Celebrate uses the CEFR chart's Chinese level names.
require('../tools/lib.js')(process.argv[2], [
[
"window.cefrZh = c => { const l = LV.find(z => z.k === lvOf(c)); return l ? l.k + '（' + l.zh + '）' : String(c || ''); };",
"window.cefrZh = c => { const l = LV.find(z => z.k === lvOf(c)); return l ? l.k + '（' + l.zh + '）' : String(c || ''); };\n/* 635 · the level in plain words for parents (Misty's partner: some parents don't know CEFR). Kids: the Cambridge exam level Chinese families know;\n   adults: the IELTS band. The same words as the Celebrate pictures. */\nconst LV_EN = { 'Pre-A1': 'Starter', A1: 'Beginner', A2: 'Elementary', B1: 'Intermediate', B2: 'Upper intermediate', C1: 'Advanced', C2: 'Proficient' };\nconst LV_EX = { 'Pre-A1': ['Cambridge YLE Starters', '剑桥少儿英语一级'], A1: ['Cambridge YLE Movers', '剑桥少儿英语二级'], A2: ['Cambridge YLE Flyers and KET', '剑桥少儿英语三级和KET'], B1: ['Cambridge PET', '剑桥PET'], B2: ['Cambridge FCE', '剑桥FCE'], C1: ['Cambridge CAE', '剑桥CAE'], C2: ['Cambridge CPE', '剑桥CPE'] };\nwindow.cefrPlain = (c, adult) => { const l = LV.find(z => z.k === lvOf(c)); if(!l) return null; const k = l.k, ie = String(l.ie || '').trim(), n = (ie.match(/[\\d.]+(?:–[\\d.]+)?/) || [''])[0];\n  if(adult){ if(!/\\d/.test(ie) || /^</.test(ie)) return { en: k + ' is below IELTS 3.5.', zh: '欧标' + k + ' 低于雅思3.5分。', ten: 'below IELTS 3.5', tzh: '低于雅思3.5分', name: LV_EN[k], zhn: l.zh };\n    return { en: k + ' is about IELTS ' + n + '.', zh: '欧标' + k + ' 约相当于雅思' + n + '分。', ten: 'about IELTS ' + n, tzh: '约相当于雅思' + n + '分', name: LV_EN[k], zhn: l.zh }; }\n  const X = LV_EX[k]; return { en: k + ' is the level of ' + X[0] + '.', zh: '欧标' + k + ' 相当于' + X[1] + '水平。', ten: 'the level of ' + X[0], tzh: '相当于' + X[1] + '水平', name: LV_EN[k], zhn: l.zh }; };\nwindow.cefrSay = (c, adult, zh) => { const p = window.cefrPlain(c, adult); if(!p) return String(c || ''); const k = lvOf(c); return zh ? k + '（' + p.zhn + '），' + p.tzh : k + ' ' + p.name + ', ' + p.ten; };"
],
[
"if(o.cefr){ T.label('Trial result', '试听评估', y); T.text('CEFR ' + (window.cefrZh ? cefrZh(o.cefr) : o.cefr), T.CX, y + 46, '400 34px ' + T.F, T.NAVY); y += 104; }\nif(o.student) y = coeTeacher(T, o.teacher, y);\nT.label('Learning path', '学习路线 · ' + G.f, y); y += 22;\nlet pb ",
"if(o.cefr){ T.label('Trial result', '试听评估', y); T.text('CEFR ' + (window.cefrZh ? cefrZh(o.cefr) : o.cefr), T.CX, y + 46, '400 34px ' + T.F, T.NAVY); const pl = window.cefrPlain && cefrPlain(o.cefr, true); if(pl){ T.text(pl.en, T.CX, y + 84, '400 22px ' + T.F, T.SUB); T.text(pl.zh, T.CX, y + 114, '400 22px ' + T.F, T.SUB); y += 66; } y += 104; }\nif(o.student) y = coeTeacher(T, o.teacher, y);\nT.label('Learning path', '学习路线 · ' + G.f, y); y += 22;\nlet pb "
],
[
"if(o.cefr){ T.label('Trial result', '试听评估', y); T.text('CEFR ' + (window.cefrZh ? cefrZh(o.cefr) : o.cefr), T.CX, y + 46, '400 34px ' + T.F, T.NAVY); y += 104; }\nif(o.student) y = coeTeacher(T, o.teacher, y);\nT.label('Learning path', '学习路线', y); y += 22;\nsteps.forEach((k",
"if(o.cefr){ T.label('Trial result', '试听评估', y); T.text('CEFR ' + (window.cefrZh ? cefrZh(o.cefr) : o.cefr), T.CX, y + 46, '400 34px ' + T.F, T.NAVY); const pl = window.cefrPlain && cefrPlain(o.cefr, false); if(pl){ T.text(pl.en, T.CX, y + 84, '400 22px ' + T.F, T.SUB); T.text(pl.zh, T.CX, y + 114, '400 22px ' + T.F, T.SUB); y += 66; } y += 104; }\nif(o.student) y = coeTeacher(T, o.teacher, y);\nT.label('Learning path', '学习路线', y); y += 22;\nsteps.forEach((k"
],
[
"'根据老师的评估，孩子目前的英语水平为 CEFR ' + (window.cefrZh ? cefrZh(o.cefr) : o.cefr) + '。'",
"'根据老师的评估，孩子目前的英语水平为 CEFR ' + (window.cefrSay ? cefrSay(o.cefr, false, true) : o.cefr) + '。'"
],
[
"x.cefr ? ` ${kid}'s level is ${x.cefr}.` : ''",
"x.cefr ? ` ${kid}'s level is ${window.cefrSay ? cefrSay(x.cefr) : x.cefr}.` : ''"
],
[
"x.cefr ? `${kid}目前的英语水平是${x.cefr}。` : ''",
"x.cefr ? `${kid}目前的英语水平是${window.cefrSay ? cefrSay(x.cefr, false, true) : x.cefr}。` : ''"
],
[
"x.cefr ? ` Your level is ${x.cefr}.` : ''",
"x.cefr ? ` Your level is ${window.cefrSay ? cefrSay(x.cefr, true) : x.cefr}.` : ''"
],
[
"x.cefr ? `您目前的英语水平是${x.cefr}。` : ''",
"x.cefr ? `您目前的英语水平是${window.cefrSay ? cefrSay(x.cefr, true, true) : x.cefr}。` : ''"
],
[
"const LVN = { 'PRE-A1': ['Starter', '启蒙级', 'YLE Starters', '剑少一级'], A1: ['Beginner', '入门级', 'YLE Movers', '剑少二级'],",
"const LVN = { 'PRE-A1': ['Starter', '启蒙', 'YLE Starters', '剑少一级'], A1: ['Beginner', '入门', 'YLE Movers', '剑少二级'],"
],
[
"C2: ['Proficient', '精通级', 'CPE', 'CPE'] };",
"C2: ['Proficient', '精通', 'CPE', 'CPE'] };"
]
]);
