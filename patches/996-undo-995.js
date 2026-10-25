// 996: undo 995 (calmer design) — Misty (19:44) asked to see laptop and phone previews before visual changes are deployed,
// with a refined direction. 995 had already gone live a minute earlier; this removes its style block exactly.
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const a = s.indexOf('<style id="s995">'); if (a < 0) { console.error('995 not found'); process.exit(1); }
const b = s.indexOf('</style>', a) + '</style>\n'.length;
s = s.slice(0, a) + s.slice(b);
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
