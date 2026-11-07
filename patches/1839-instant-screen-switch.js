// 1839: (Misty 7 Nov "clicking now screens and buttons slowed down and feels lagging") switching back to a screen already opened
//   shows it at once and refreshes it a moment later, instead of rebuilding it before showing (Students took ~0.5 s).
const lib = require('../tools/lib.js'), fs = require('fs'), file = process.argv[2];
const inc = fs.readFileSync(__dirname + '/1839-instant-screen-switch.inc.txt', 'utf8');
lib(file, [["\n</body>", "\n" + inc + "</body>"]]);
