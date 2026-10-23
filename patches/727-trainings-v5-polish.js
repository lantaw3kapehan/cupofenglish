// 727: Trainings v5 polish — bars in "What I can teach" line up; checklist text normal spacing; a higher rank already completed shows a teal ✓.
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const rep = (a, b) => { if (s.split(a).length !== 2) { console.error('not unique: ' + a.slice(0, 90)); process.exit(1); } s = s.replace(a, b); };
rep(".st5 .ok em{color:#2B2253}.st5 .nx em,.st5 .lk em{color:#9A97AE}", ".st5 .ok em{color:#2B2253}.st5 .nx em,.st5 .lk em{color:#9A97AE}.st5 .lk em.all{color:#00A3AD}");
rep("(T.length ? '<em>' + (dn === T.length ? '✓' : dn + '/' + T.length) + '</em>' : '')", "(T.length ? '<em' + (dn === T.length ? ' class=\"all\"' : '') + '>' + (dn === T.length ? '✓' : dn + '/' + T.length) + '</em>' : '')");
rep(".tx5 .ck small{display:block;font-size:11.5px;color:#77738C}", ".tx5 .ck small{display:block;font-size:11.5px;color:#77738C;letter-spacing:normal;font-weight:400}.tx5 .ck b{letter-spacing:normal}.tx5 .tx-gr{grid-template-columns:128px 1fr 40px}.tx5 .tx-gr .nm{min-width:0;overflow:hidden;text-overflow:ellipsis}");
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
