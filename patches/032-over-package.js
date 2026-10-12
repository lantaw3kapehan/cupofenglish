// Packages used beyond their lessons (Damon IELTS Writing: 33 done of 31): the lesson summary shows "Over the package +2 · 超出 2 课时" with the real
// package total (31) instead of 0 left / 33 total, and the lessons-left picture says "lessons over the package" with a renew line.
require('../tools/lib.js')(process.argv[2], [
[
"const left = o[C.available] === '' ? Math.max(0, n1(enrolled + carry - done)) : Math.max(0, n1(+o[C.available] + (G.extra || 0))), total = n1(done + left), pct = total ? Math.min(100, Math.round(done / total * 100)) : 0;",
"const left = o[C.available] === '' ? n1(enrolled + carry - done) : n1(+o[C.available] + (G.extra || 0)), over = left < 0 ? n1(-left) : 0, total = over ? n1(done - over) : n1(done + left), pct = total ? Math.min(100, Math.round(done / total * 100)) : 0;   /* over: more lessons taken than the package has (Damon 33 of 31) */"
],
[
"<td><div style=\"${L}\">Lessons Remaining 剩余课时</div><div style=\"font-weight:700;font-size:34px;color:#E0533D\">${left}</div><div style=\"font-size:11px\">Remaining in current package<br>当前课程包剩余课时</div></td></tr></table>",
"<td>${over ? `<div style=\"${L}\">Over the package 超出课时</div><div style=\"font-weight:700;font-size:34px;color:#E0533D\">+${over}</div><div style=\"font-size:11px\">${over} lesson${over === 1 ? '' : 's'} taken beyond the package<br>已超出课程包 ${over} 课时</div>` : `<div style=\"${L}\">Lessons Remaining 剩余课时</div><div style=\"font-weight:700;font-size:34px;color:#E0533D\">${left}</div><div style=\"font-size:11px\">Remaining in current package<br>当前课程包剩余课时</div>`}</td></tr></table>"
],
[
"CURRENT PACKAGE PROGRESS <span style=\"font-weight:400\">当前课程包进度</span></div>\n<div style=\"display:flex;align-items:center;gap:10px;margin:8px 0 12px\"><div style=\"flex:1;height:12px;border-radius:6px;background:#E6F4F4;overflow:hidden\"><div style=\"width:${pct}%;height:100%;background:#3FA7A8\"></div></div><div style=\"font-size:12px;color:#E0533D;font-weight:700\">Remaining · 剩余 ${100 - pct}%</div>",
"CURRENT PACKAGE PROGRESS <span style=\"font-weight:400\">当前课程包进度</span></div>\n<div style=\"display:flex;align-items:center;gap:10px;margin:8px 0 12px\"><div style=\"flex:1;height:12px;border-radius:6px;background:#E6F4F4;overflow:hidden\"><div style=\"width:${pct}%;height:100%;background:#3FA7A8\"></div></div><div style=\"font-size:12px;color:#E0533D;font-weight:700\">${over ? 'Over by ' + over + ' · 超出 ' + over + ' 课时' : 'Remaining · 剩余 ' + (100 - pct) + '%'}</div>"
],
[
"${esc(name)} has completed <b>${done}</b> of <b>${total}</b> lessons in the current package, with <b>${left}</b> lessons remaining.<br>${esc(cn || name)} 当前课程包已完成 ${done} / ${total} 课时，剩余 ${left} 课时。",
"${over ? `${esc(name)} has completed <b>${done}</b> lessons on a <b>${total}</b>-lesson package: <b>${over}</b> lesson${over === 1 ? '' : 's'} over. Please renew to continue.<br>${esc(cn || name)} 课程包共 ${total} 课时，已上 ${done} 课时，超出 ${over} 课时，请续费以继续上课。` : `${esc(name)} has completed <b>${done}</b> of <b>${total}</b> lessons in the current package, with <b>${left}</b> lessons remaining.<br>${esc(cn || name)} 当前课程包已完成 ${done} / ${total} 课时，剩余 ${left} 课时。`}"
],
[
"c.fillText(shared ? 'shared package' : P.renew ? 'lessons now' : 'lessons left', 136 + nw, y + 66); c.fillStyle = '#4C4868'; c.font = '400 24px ' + F; c.fillText(shared ? '共享课时包' : P.renew ? '现有课时' : '剩余课时', 136 + nw, y + 100);",
"const ov = !shared && !P.renew && +b.left < 0; c.fillText(shared ? 'shared package' : P.renew ? 'lessons now' : ov ? 'lessons over the package' : 'lessons left', 136 + nw, y + 66); c.fillStyle = '#4C4868'; c.font = '400 24px ' + F; c.fillText(shared ? '共享课时包' : P.renew ? '现有课时' : ov ? '超出课程包课时' : '剩余课时', 136 + nw, y + 100);"
],
[
"if(b.left !== '' && b.left != null && +b.left <= 5) out.push(['', '', ['Only ' + n(b.left) + ' lessons left', 'Renew now to keep the same class time'], ['仅剩 ' + n(b.left) + ' 课时 · 现在续费可保留原上课时间']]);",
"if(b.left !== '' && b.left != null && +b.left < 0) out.push(['', '', ['Package used up · ' + n(-b.left) + ' lessons over', 'Please renew to keep the same class time'], ['课时已用完 · 超出 ' + n(-b.left) + ' 课时 · 请续费以保留原上课时间']]);\nelse if(b.left !== '' && b.left != null && +b.left <= 5) out.push(['', '', ['Only ' + n(b.left) + ' lessons left', 'Renew now to keep the same class time'], ['仅剩 ' + n(b.left) + ' 课时 · 现在续费可保留原上课时间']]);"
]
]);
