// 20 Oct · Add class (one class, weekly package, trial) saved in the database at once; Google Calendar follows in the background.
const inc = require('fs').readFileSync(require('path').join(__dirname, '355-add-class-fast.inc'), 'utf8');
require('../tools/lib.js')(process.argv[2], [
// Change teacher / schedule: Google's "already has these classes" means they are there (an earlier try made them)
["try{ const x = await api('addClass', TOKEN, f); return x && x.ok ? { ok: true } : { ok: false, conflict: !!(x && x.conflict), msg: (x && x.msg) || 'not added' }; }",
 "try{ const x = await api('addClass', TOKEN, f); return x && (x.ok || /already has these classes|already has a class at/i.test(String(x.msg || ''))) ? { ok: true } : { ok: false, conflict: !!(x && x.conflict), msg: (x && x.msg) || 'not added' }; }"],
["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"]]);
