// 22 Oct · Misty: notice of breach with Explain (Addendum No. 1, Clause 5.1) — see 613-notices.inc.txt.
// Server: Supabase function coe-notice + table coe_notices (phone alerts from trigger coe_notice_notify).
// Inserted before the last </body> (the printable contract code also contains "</body>" inside a string).
const fs = require('fs'), path = require('path'), file = process.argv[2];
const inc = fs.readFileSync(path.join(__dirname, '613-notices.inc.txt'), 'utf8');
let s = fs.readFileSync(file, 'utf8'); const i = s.lastIndexOf('</body>');
if(i < 0 || s.indexOf('613 · Notice of breach') >= 0){ console.error('cannot insert'); process.exit(1); }
fs.writeFileSync(file, s.slice(0, i) + inc + '\n' + s.slice(i));
require('../tools/lib.js')(file, []);
