// Two packages with the same teacher (Damon, Merlin): the profile warns when that teacher's calendar has a book (e.g. a new RE level) that is in
// neither package's COURSE, so those lessons are not counted. "Schedule stopped" reasons read 家长停上该时段课程 in Chinese.
require('../tools/lib.js')(process.argv[2], [
[
"    const rn = r[C.row], cd = esc(String(r[C.code] || ''));\n    return '<div class=\"row noprint\" style=\"gap:6px;flex-wrap:wrap;margin-top:8px\" onclick=\"event.stopPropagation()\">' + ((n > 1 || cur.length) && books.length ?",
"    const rn = r[C.row], cd = esc(String(r[C.code] || ''));\n    const warn = (() => { const tl = String(r[C.teacher] || '').trim().toLowerCase(), up = s => String(s || '').trim().toUpperCase(); const tw = (AT.rows || []).filter(x => up(x[C.code]) === up(r[C.code]) && String(x[C.teacher] || '').trim().toLowerCase() === tl && x[C.enrolled] !== ''); if(tw.length < 2) return '';\n      const all = []; tw.forEach(x => String(x[C.course] || '').split(',').map(y => y.trim()).filter(Boolean).forEach(y => all.push(y.toUpperCase())));\n      const miss = [...new Set(((STU && STU.cls) || []).filter(c => !c.cancelled && String(c.teacher || '').trim().toLowerCase() === tl).map(c => String(c.book || '').trim()).filter(b => b && all.indexOf(b.toUpperCase()) < 0))];\n      return miss.length ? '<div class=\"small\" style=\"color:#B4513B;margin-top:6px\">⚠ ' + esc(miss.map(pkCourse).join(', ')) + ' lessons with ' + esc(r[C.teacher]) + ' are not counted in any package (new book?). Tap it on the package it belongs to.</div>' : ''; })();\n    return warn + '<div class=\"row noprint\" style=\"gap:6px;flex-wrap:wrap;margin-top:8px\" onclick=\"event.stopPropagation()\">' + ((n > 1 || cur.length) && books.length ?"
],
[
"const CX_ZH = [[",
"const CX_ZH = [[/schedule stopped|stopped from/i,'家长停上该时段课程'],["
]
]);
