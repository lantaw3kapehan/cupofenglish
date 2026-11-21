// 2655 (Misty 21:41 "not on management, since the teachers add the meeting ids"): 2654's Meeting ID box on management's class sheet is removed
//   (script b2654 taken out). Database 2654 rolled back: a meeting ID is set only by the class's own teacher, as before.
const fs = require('fs'); const file = process.argv[2]; let h = fs.readFileSync(file, 'utf8');
const a = h.indexOf('<script id="b2654">'); if (a < 0) throw new Error('no b2654'); const b = h.indexOf('</script>', a) + 9;
h = h.slice(0, a) + h.slice(b); fs.writeFileSync(file, h);
require('../tools/lib.js')(file, []);
