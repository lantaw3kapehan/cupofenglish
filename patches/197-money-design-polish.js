// 15 Oct night · Sales & costs polish: change chips sized to their text, no dash before "October so far", the "today"
// mark no longer touches the notes, expenses as a clean list (last month vs its usual level), years swipe on phones.
const fs = require('fs'), path = require('path');
const oldInc = fs.readFileSync(path.join(__dirname, '197-money-design-old.inc'), 'utf8'), inc = fs.readFileSync(path.join(__dirname, '197-money-design-polish.inc'), 'utf8');
require('../tools/lib.js')(process.argv[2], [[oldInc, inc]]);
