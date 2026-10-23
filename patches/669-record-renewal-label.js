// 669: (Misty) "Renewed · paid" on the student Status box read like a fact (a first-package student looked renewed).
// Now an action: "+ Record renewal" with a hint; it only says "Renewed · paid" where it is a step in the renewal flow.
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const rep = (a, b) => { const i = s.indexOf(a); if (i < 0 || s.indexOf(a, i + 1) > -1) { console.error('not unique: ' + a.slice(0, 90)); process.exit(1); } s = s.replace(a, b); };
rep(`'<button class="btn sm ghost" onclick="renPaidSheet(\\'' + esc(code) + '\\',\\'' + nm + '\\',\\'' + tc + '\\')">Renewed · paid</button>') + '</div>' +`,
    `'<button class="btn sm ghost" title="Use this when the parent pays for the next package" onclick="renPaidSheet(\\'' + esc(code) + '\\',\\'' + nm + '\\',\\'' + tc + '\\')">+ Record renewal</button>') + '</div>' +`);
rep("paid = find(/Renewed · paid/),", "paid = find(/Renewed · paid|Record renewal/),");
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
