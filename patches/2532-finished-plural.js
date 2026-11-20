// 2532 (final QA): Schedule · "Finished 1 classes" → "1 class".
const file = process.argv[2];
const s = require('fs').readFileSync(file, 'utf8'), A = '<h2>Finished <span class="c">${fin.filter(e=>!e.cancelled).length} classes</span></h2>';
const B = '<h2>Finished <span class="c">${(n => n + (n === 1 ? \' class\' : \' classes\'))(fin.filter(e=>!e.cancelled).length)}</span></h2>';
require('fs').writeFileSync(file, s.split(A).join(B));
require('../tools/lib.js')(file, []);
