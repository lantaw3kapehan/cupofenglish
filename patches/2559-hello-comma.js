// 2559 (Misty 21 Nov 09:38 "It should be Hello, ____! · follow the right punctuation"): every greeting that names the person takes
// the comma of direct address: "Hello, David!", "Hi, Anna," (agreement, reminders, trial and progress messages, leave notices).
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8'), n = 0;
const R = [[/Hello \$\{([^}]+)\}([!,])/g, 'Hello, ${$1}$2'], [/Hello ' \+ ([\w.()]+) \+ '([!,])/g, "Hello, ' + $1 + '$2"], [/Hi ' \+ ([\w.()]+) \+ '([!,])/g, "Hi, ' + $1 + '$2"], [/Hi \$\{([^}]+)\}([!,])/g, 'Hi, ${$1}$2']];
for (const [re, to] of R) s = s.replace(re, (...m) => { n++; return m[0].replace(re, to); });
if (!n) { console.error('nothing to change'); process.exit(1); }
fs.writeFileSync(file, s); console.log(n + ' greetings');
require('../tools/lib.js')(file, []);
