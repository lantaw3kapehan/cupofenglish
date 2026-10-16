// 16 Oct · Misty: Eric already enrolled (15 lessons from 20 Oct) — a booked trial of an enrolled student shows "Enrolled ✓"
// (from the package records), sits at the end and is not counted as to come.
require('../tools/lib.js')(process.argv[2], [
[".filter(x => !q || [x.student, x.code, x.teacher, x.book].join(' ').toLowerCase().indexOf(q) > -1);",
 ".filter(x => !q || [x.student, x.code, x.teacher, x.book].join(' ').toLowerCase().indexOf(q) > -1).sort((a, b) => (+!!a.pkg) - (+!!b.pkg));"],
["<span class=\"c\">${L.length} · from Schedule · tap to open the student</span>",
 "<span class=\"c\">${L.filter(x => !x.pkg).length} to come${L.some(x => x.pkg) ? ' · ' + L.filter(x => x.pkg).length + ' already enrolled' : ''} · from Schedule · tap to open the student</span>"],
["const chip = past ? '<span class=\"chip amber\">Report not in yet</span>'",
 "const chip = x.pkg ? '<span class=\"chip green\">Enrolled ✓ · ' + x.pkg.lessons + ' lessons' + (x.pkg.first ? ' from ' + esc(new Date(String(x.pkg.first).slice(0, 10) + 'T12:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })) : '') + '</span>' : past ? '<span class=\"chip amber\">Report not in yet</span>'"],
]);
