// 680: (Misty "too slow") Renewed · paid / + Record renewal opens at once; Google's package check (≈ 5–20 s) fills in while you choose.
const fs = require('fs'), path = require('path'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const A = "async function renPaidSheet(code, name, teacher, again){", Z = "async function renPaidSave(){";
const i = s.indexOf(A), j = s.indexOf(Z); if (i < 0 || j < i || s.indexOf(A, i + 1) > -1) { console.error('renPaidSheet not found once'); process.exit(1); }
s = s.slice(0, i) + fs.readFileSync(path.join(__dirname, '680-renew-paid-instant.inc.txt'), 'utf8') + s.slice(j);
// start the check when the pointer reaches the button
const b = "'<button class=\"btn sm ghost\" title=\"Use this when the parent pays for the next package\" onclick=\"renPaidSheet(";
if (s.split(b).length !== 2) { console.error('button not found'); process.exit(1); }
s = s.replace(b, "'<button class=\"btn sm ghost\" title=\"Use this when the parent pays for the next package\" onpointerenter=\"rpWarm(\\'' + esc(code) + '\\',\\'' + tc + '\\')\" onclick=\"renPaidSheet(");
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
