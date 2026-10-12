// Package course chips: each package offers only its own teacher's calendar courses (Virgo: Debate · Misty: IELTS Writing),
// and removing a course is "tap again to remove" instead of a browser confirm box (which browsers can silently block).
require('../tools/lib.js')(process.argv[2], [
[
"((STU && STU.cls) || []).forEach(c => { const b = String(c.book || '').trim(); if(b && books.indexOf(b) < 0) books.push(b); });",
"(cls => { const tl = String(r[C.teacher] || '').trim().toLowerCase(), mine = cls.filter(c => String(c.teacher || '').trim().toLowerCase() === tl); return mine.length ? mine : cls; })((STU && STU.cls) || []).forEach(c => { const b = String(c.book || '').trim(); if(b && books.indexOf(b) < 0) books.push(b); });"
],
[
"i = cur.indexOf(b); if(i > -1){ if(!confirm('Remove ' + pkCourse(b) + ' from this package? Its lessons then count with every course of this teacher.')) return; cur.splice(i, 1); } else cur.push(b);",
"i = cur.indexOf(b); if(i > -1){ const k = rn + '|' + b; if(window._pkRm !== k){ window._pkRm = k; setTimeout(() => { if(window._pkRm === k) window._pkRm = ''; }, 5000); return toast('Tap ' + pkCourse(b) + ' again to remove it from this package'); } window._pkRm = ''; cur.splice(i, 1); } else cur.push(b);"
]
]);
