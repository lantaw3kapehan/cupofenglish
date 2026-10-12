// Student profile: "New weekly schedule" picture + text for the parents' group (after stopping a day / adding a new one).
// The weekly pattern comes from the classes booked in the next 4 weeks (cancelled ones left out); same card style as the other proofs.
require('../tools/lib.js')(process.argv[2], [
[
"${up.length ? `<h3 class=\"sch\">Coming up</h3>",
"${D.mgr && wkSlots(L).slots.length ? `<button class=\"btn teal block noprint\" style=\"margin-top:10px\" onclick=\"wkPic()\">New weekly schedule · picture to send</button>` : ''}${up.length ? `<h3 class=\"sch\">Coming up</h3>"
],
[
"function stuSched(L){\n",
"function wkSlots(L){   /* the student's weekly pattern from the classes booked in the next 4 weeks (cancelled ones left out) */\nconst now = Date.now(), lim = now + 28 * 864e5, up = (L || []).filter(e => !e.cancelled && new Date(e.end) >= now && new Date(e.start) <= lim).sort((a, b) => a.start.localeCompare(b.start)), by = {};\nup.forEach(e => { const d = new Date(e.start), k = ((d.getDay() + 6) % 7) + '|' + tm(e.start) + '|' + tm(e.end) + '|' + (e.teacher || ''); (by[k] = by[k] || []).push(e); });\nconst many = up.length && (new Date(up[up.length - 1].start) - new Date(up[0].start)) > 8 * 864e5;\nconst W = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'], Z = '一二三四五六日';\nconst slots = Object.keys(by).filter(k => !many || by[k].length > 1 || Object.keys(by).length === 1).sort().map(k => { const [w, s, en, t] = k.split('|'); const m = Math.round((new Date(by[k][0].end) - new Date(by[k][0].start)) / 6e4); return { w: +w, s, e: en, t, m, first: by[k][0], en: W[w] + ' · ' + s + ' – ' + en + ' · ' + m + ' min', zh: '每周' + Z[w] + ' ' + s + '–' + en + ' · ' + m + '分钟' }; });\nreturn { slots, up }; }\nfunction wkPic(){\nif(!STU || !STU.cls) return; const K = wkSlots(STU.cls); if(!K.slots.length) return toast('No upcoming weekly classes on the calendar');\nconst f = K.slots.map(x => x.first).sort((a, b) => a.start.localeCompare(b.start))[0], tt = [...new Set(K.slots.map(x => x.t))];\nCXP = { kind: 'class', week: { slots: K.slots, from: f.start, multi: tt.length > 1 }, e: { student: STU.s.name || STU.code, code: STU.code, teacher: tt.join(', '), start: f.start, end: f.end, book: f.book || '', meet: (K.up.find(x => x.meet) || {}).meet || '', title: '' }, why: '', by: '', zh: '', cn: cxCnOf(STU.code), url: '' };\ncxSheet(); }\nfunction stuSched(L){\n"
],
[
"function cxText(){\n",
"function cxText(){\nif(CXP && CXP.week){ const K = CXP.week, e = CXP.e, fd = new Date(K.from); const t = 'CupOfEnglish · 新课表 New weekly schedule\\nStudent 学生: ' + e.student + (CXP.cn ? ' ' + CXP.cn : '') + (e.code ? ' (' + e.code + ')' : '') + '\\n' + K.slots.map(x => x.en + (K.multi ? ' · ' + tName(x.t) : '') + '\\n' + x.zh + (K.multi ? ' · ' + tZh(x.t) : '')).join('\\n') + (K.multi ? '' : '\\nTeacher 老师: ' + tName(e.teacher) + ' · ' + tZh(e.teacher)) + '\\nStarting 开始: ' + fd.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }) + ' · ' + (fd.getMonth() + 1) + '月' + fd.getDate() + '日' + (e.meet ? '\\n腾讯会议号 Meeting ID: ' + e.meet + '（每次同一个会议号 · same every class）' : '');\ntry{ navigator.clipboard.writeText(t); toast('Text copied'); }catch(x){ openSheet('<h1>Text</h1><p class=\"small\" style=\"white-space:pre-line\">' + esc(t) + '</p>'); } return; }\n"
],
[
"if(e.book){ const bp = String(e.book).split(/\\s*,\\s*/).filter(Boolean)",
"if(P.week){ const K = P.week, fd = new Date(K.from), tt = [...new Set(K.slots.map(x => x.t))]; rows.length = 0;\nrows.push(['Weekly classes', '每周上课时间', K.slots.map(x => x.en + (K.multi ? ' · ' + tName(x.t) : '')), K.slots.map(x => x.zh + (K.multi ? ' · ' + tZh(x.t) : ''))]);\nif(!K.multi) rows.push(['Teacher', '老师', [tName(tt[0])], [tZh(tt[0])]]);\nrows.push(['Starting', '开始日期', [dEn(fd)], [dZh(fd)]]); }\nif(e.book){ const bp = String(e.book).split(/\\s*,\\s*/).filter(Boolean)"
],
[
"const pill = bl ? (P.renew",
"const pill = P.week ? 'New weekly schedule · 新课表' : bl ? (P.renew"
]
]);
