// 21 Oct · Teacher Growth / QA / student page polish: section chips, folded peer comments and older visits, step pills, one action row, age from the profile.
const inc = require('fs').readFileSync(require('path').join(__dirname, '510-teacher-growth-qa-student.inc'), 'utf8');
require('../tools/lib.js')(process.argv[2], [
["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"],
["function birthOf(code){ try{ const r = ((typeof DB !== 'undefined' && DB && DB.rows) || []).find(x => up(x[0]) === up(code)); if(!r) return null;",
 "function birthOf(code){ try{ const r = ((typeof DB !== 'undefined' && DB && DB.rows) || []).find(x => up(x[0]) === up(code)) || (() => { const p = typeof STU !== 'undefined' && STU && STU.r && STU.r.profile; return p && Array.isArray(p.row) && up(p.row[0]) === up(code) ? p.row : null; })(); if(!r) return null;   /* 510: teachers read the student's own profile row */"],
["    if((typeof DB === 'undefined' || !DB) && !asked){ asked = 1; loadDb(true)",
 "    if((typeof DB === 'undefined' || !DB) && !asked && D && D.mgr){ asked = 1; loadDb(true)"]
]);
