// 22 Oct · Addendum No. 1 Clause 1.2: teachers are paid a service fee, not a salary. Teacher screens say "pay" (feedback due lines).
const fs = require('fs'); const file = process.argv[2];
let s = fs.readFileSync(file, 'utf8'); const n = s.split('before salary on the 10th').length - 1;
if(n < 1){ console.error('phrase not found'); process.exit(1); }
s = s.split('before salary on the 10th').join('before pay on the 10th'); fs.writeFileSync(file, s);
require('../tools/lib.js')(file, [
['your salary is released once it is done', 'your pay is released once it is done'],
]);
